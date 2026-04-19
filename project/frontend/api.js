// API client for custom backend (localhost:3000)

const API_BASE = 'http://localhost:3000';

let ws = null;
let listeners = {};

export function connectWS() {
  ws = new WebSocket('ws://localhost:3000/ws');
  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    listeners[type]?.(data);
  };
}

export function onData(type, callback) {
  listeners[type] = callback;
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'subscribe', data: type }));
  }
}

export async function getReports() {
  const res = await fetch(`${API_BASE}/reports`);
  return res.json();
}

export async function postReport(report) {
  const res = await fetch(`${API_BASE}/reports`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(report) });
  return res.json();
}

export async function getCheckpoints() {
  const res = await fetch(`${API_BASE}/checkpoints`);
  return res.json();
}

export async function postCheckpoint(cp) {
  const res = await fetch(`${API_BASE}/checkpoints`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(cp) });
  return res.json();
}

export async function putCheckpoint(id, update) {
  const res = await fetch(`${API_BASE}/checkpoints/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(update) });
  return res.json();
}

export async function deleteCheckpoint(id) {
  const res = await fetch(`${API_BASE}/checkpoints/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getAssignment() {
  const res = await fetch(`${API_BASE}/assignment/current`);
  return res.json();
}

export async function putAssignment(assignment) {
  const res = await fetch(`${API_BASE}/assignment/current`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(assignment) });
  return res.json();
}

