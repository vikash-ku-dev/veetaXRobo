const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Data adapters
const reportsAdapter = new JSONFile('reports.json');
const checkpointsAdapter = new JSONFile('checkpoints.json');
const assignmentAdapter = new JSONFile('assignment.json');
const db = {
  reports: new Low(reportsAdapter, []),
  checkpoints: new Low(checkpointsAdapter, []),
  assignment: new Low(assignmentAdapter, null)
};

// Init DB
async function initDB() {
  await db.reports.read();
  db.reports.data ||= [];
  await db.checkpoints.read();
  db.checkpoints.data ||= [];
  await db.assignment.read();
  db.assignment.data ||= null;
  await Promise.all([db.reports.write(), db.checkpoints.write(), db.assignment.write()]);
}
initDB();

function broadcast(type, data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

// Reports: GET /reports (recent 80), POST /reports
app.get('/reports', async (req, res) => {
  const reports = db.reports.data.slice(0, 80);
  res.json(reports);
});

app.post('/reports', async (req, res) => {
  const report = { id: uuid(), ...req.body, timestamp: Date.now() };
  db.reports.data.unshift(report);
  if (db.reports.data.length > 100) db.reports.data = db.reports.data.slice(0, 100);
  await db.reports.write();
  broadcast('reports', db.reports.data.slice(0, 80));
  res.json(report);
});

// Checkpoints: GET /checkpoints, POST /checkpoints, PUT /checkpoints/:id, DELETE /checkpoints/:id
app.get('/checkpoints', async (req, res) => {
  res.json(db.checkpoints.data);
});

app.post('/checkpoints', async (req, res) => {
  const cp = { id: uuid(), ...req.body, createdAt: Date.now() };
  db.checkpoints.data.push(cp);
  await db.checkpoints.write();
  broadcast('checkpoints', db.checkpoints.data);
  res.json(cp);
});

app.put('/checkpoints/:id', async (req, res) => {
  const id = req.params.id;
  const cp = db.checkpoints.data.find(c => c.id === id);
  if (cp) {
    cp.active = req.body.active;
    await db.checkpoints.write();
    broadcast('checkpoints', db.checkpoints.data);
    res.json(cp);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/checkpoints/:id', async (req, res) => {
  const id = req.params.id;
  const beforeLen = db.checkpoints.data.length;
  db.checkpoints.data = db.checkpoints.data.filter((c) => c.id !== id);
  if (db.checkpoints.data.length === beforeLen) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  await db.checkpoints.write();
  broadcast('checkpoints', db.checkpoints.data);
  res.json({ ok: true, id });
});

// Assignment: GET/PUT /assignment/current
app.get('/assignment/current', async (req, res) => {
  res.json(db.assignment.data || {});
});

app.put('/assignment/current', async (req, res) => {
  db.assignment.data = req.body;
  await db.assignment.write();
  broadcast('assignment', db.assignment.data);
  res.json(db.assignment.data);
});

// WS connect
wss.on('connection', (ws) => {
  // Send current data
  ws.send(JSON.stringify({ type: 'reports', data: db.reports.data.slice(0, 80) }));
  ws.send(JSON.stringify({ type: 'checkpoints', data: db.checkpoints.data }));
  ws.send(JSON.stringify({ type: 'assignment', data: db.assignment.data }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend on http://localhost:${PORT}`);
});

