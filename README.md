# Smart Emergency Response System

A real-time emergency dispatch and response management system featuring live map visualization, checkpoint management, and vehicle dispatch control.

## Project Overview

This application enables emergency dispatch operators to:
- Monitor incoming emergency reports in real-time
- View incident locations on an interactive map
- Manage emergency checkpoints and sensor activation
- Dispatch appropriate vehicles (ambulances, fire trucks) based on incident type
- Track ambulance status through delivery stages (dispatched → en route → hospital)

## Project Structure

```
project/
├── backend/          # Express.js server with WebSocket support
│   ├── server.js     # Main server with API endpoints
│   ├── package.json  # Dependencies (Express, WebSocket, lowdb)
│   ├── reports.json  # Stored emergency reports
│   ├── checkpoints.json  # Stored checkpoint data
│   └── TODO.md       # Development tasks
│
└── frontend/         # HTML/CSS/JavaScript web interfaces
    ├── control.html     # Operations control panel
    ├── checkpoint.html  # Checkpoint management interface
    ├── reporter.html    # Emergency report submission
    ├── map.js           # Map visualization & interactions
    ├── api.js           # Backend API client
    ├── firebase.js      # Firebase integration (optional)
    └── style.css        # Shared styling
```

## Features

### Backend Features
- **RESTful API** for creating and retrieving emergency reports
- **WebSocket Server** for real-time data broadcasts to all connected clients
- **Checkpoint Management** for simulating sensor networks
- **Vehicle Assignment** tracking
- **Data Persistence** using JSON files (lowdb)
- **CORS Support** for cross-origin requests

### Frontend Features

#### Control Panel (`control.html`)
- Real-time message stream of incoming emergencies
- Interactive map with zoom and pan controls
- Vehicle dispatch buttons for each incident
- Ambulance status tracking (on the way → hospital way → successful)
- Selected incident highlighting with red dots

#### Checkpoint Editor (`checkpoint.html`)
- Add/view emergency checkpoints on the map
- Toggle checkpoint activation to simulate sensor triggers
- Manage checkpoint visibility and states

#### Reporter (`reporter.html`)
- Submit new emergency reports via map clicks
- Report classification (medical, accident, fire, etc.)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd project/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server runs on `http://localhost:3000` by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd project/frontend
```

2. Start a local web server (required for CORS):
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js live-server
npx live-server
```

3. Open your browser and visit:
- **Control Panel**: `http://localhost:8000/control.html`
- **Checkpoint Editor**: `http://localhost:8000/checkpoint.html`
- **Reporter**: `http://localhost:8000/reporter.html`

## API Endpoints

### Reports
- **GET `/reports`** - Retrieve recent 80 emergency reports
- **POST `/reports`** - Submit a new emergency report

### Checkpoints
- **GET `/checkpoints`** - Retrieve all checkpoints
- **POST `/checkpoints`** - Create a new checkpoint
- **PUT `/checkpoints/:id`** - Update checkpoint status (active/inactive)

### Assignment
- **GET `/assignment/current`** - Get current vehicle assignment
- **PUT `/assignment/current`** - Update assignment

### WebSocket (`ws://localhost:3000/ws`)
Real-time data broadcasts:
- `reports` - Updated emergency reports list
- `checkpoints` - Updated checkpoint list
- `assignment` - Updated vehicle assignment

## Technology Stack

### Backend
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **lowdb** - Lightweight JSON database
- **CORS** - Cross-origin request handling
- **UUID** - Unique ID generation

### Frontend
- **Vanilla JavaScript (ES6 Modules)** - Client-side logic
- **HTML5** - Markup
- **CSS3** - Styling and responsive layout
- **Fetch API** - HTTP requests
- **WebSocket API** - Real-time data listening

## Data Models

### Emergency Report
```json
{
  "id": "uuid",
  "type": "medical|accident|fire",
  "location": { "x": 100, "y": 200 },
  "description": "string",
  "timestamp": 1234567890
}
```

### Checkpoint
```json
{
  "id": "uuid",
  "location": { "x": 100, "y": 200 },
  "active": true,
  "createdAt": 1234567890
}
```

### Ambulance Status States
- `on-the-way` - Ambulance dispatched and en route to emergency
- `to-hospital` - Reached emergency, now en route to hospital
- `successful` - Arrived at hospital

## Current Development Status

### Completed
- ✅ Core Express backend with API endpoints
- ✅ WebSocket real-time broadcast system
- ✅ Map visualization framework
- ✅ Ambulance status message system
- ✅ Checkpoint management interface
- ✅ Report submission interface

### In Progress
- 📋 Reporter map click interaction testing
- 📋 Firebase integration (optional)

### Known Issues & Tasks
See individual `TODO.md` files in:
- `project/TODO.md` - Reporter map click fixes
- `project/backend/TODO.md` - Backend tasks
- `project/frontend/TODO.md` - Frontend tasks

## Usage Workflow

1. **Start the System**
   - Launch backend server from `project/backend`
   - Start frontend web server from `project/frontend`

2. **Create Checkpoints**
   - Open Checkpoint Editor
   - Click map to add checkpoints
   - Toggle active/inactive to test sensor simulation

3. **Submit Reports**
   - Open Reporter interface
   - Click map locations to create emergency reports
   - Specify emergency type and details

4. **Dispatch Response**
   - View reports in Control Panel
   - Click incident to select it
   - Click appropriate dispatch button based on incident type:
     - Medical/Accident → Ambulance
     - Fire → Fire Truck

5. **Track Status**
   - Monitor ambulance status updates as it progresses through stages
   - Real-time updates broadcast to all connected clients

## Files & Responsibilities

| File | Purpose |
|------|---------|
| `server.js` | Express app, API routes, WebSocket handler, DB management |
| `api.js` | Frontend API client, WebSocket connection, fetch helpers |
| `map.js` | Map rendering, zoom/pan, report/checkpoint visualization |
| `control.html` | Operator interface for dispatch operations |
| `checkpoint.html` | Checkpoint creation and management |
| `reporter.html` | Emergency incident reporting |
| `style.css` | Shared styling for all interfaces |
| `firebase.js` | Firebase configuration (currently optional) |

## Troubleshooting

- **WebSocket connection refused** → Ensure backend server is running on port 3000
- **CORS errors** → Make sure frontend is served from a local web server, not opening `file://` directly
- **Map click not working** → Check that `ensureEmergencyParent` function is defined in `map.js`
- **No real-time updates** → Verify WebSocket connection in browser DevTools

## Future Enhancements

- Enhanced map features (route planning, estimated arrival times)
- Advanced filtering and search for historical reports
- User authentication and role-based access control
- Mobile app version
- Integration with actual GIS/mapping services
- Predictive dispatch algorithms

## License

[Add your license here]

## Contact & Support

[Add contact information here]
