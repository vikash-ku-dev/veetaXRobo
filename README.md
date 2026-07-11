# Smart Emergency Response System

A traffic emergency system with a backend server, frontend control panels, computer vision car counting, and an Arduino hardware sketch.

It lets operators monitor incidents on a live map, manage checkpoints, dispatch vehicles, and view emergency reports in real time.

The project includes:
- `project/backend` — Express server with API and WebSocket support
- `project/frontend` — web UI for control, checkpoint management, and reporting
- `Computer_vission` — car counting scripts
- `sketch_apr19a` — Arduino sketch and hardware notes

## Download and install

1. Clone or download the repo to your machine.
2. Install backend packages:
```bash
cd project/backend
npm install
```
3. Install vision dependencies:
```bash
cd Computer_vission
pip install -r requirements.txt
```

## Run the project

1. Start backend:
```bash
cd project/backend
npm install
npm start
```

2. Start frontend:
```bash
cd project/frontend
python -m http.server 8000
```

3. Open in browser:
- `http://localhost:8000/control.html`
- `http://localhost:8000/reporter.html`

## Notes

- Backend listens on `http://localhost:3000`
- Use `npx live-server` instead of Python if preferred
- `Computer_vission` and `sketch_apr19a` are separate modules for vision and hardware
   - Open Checkpoint Editor
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
| `reporter.html` | Emergency incident reporting |
| `style.css` | Shared styling for all interfaces |
| `firebase.js` | Firebase configuration (currently optional) |
| `i18n.js` | Multilingual support and language strings |

## Multilingual Support

The system supports **9 languages** out of the box:

- **English** (en)
- **हिन्दी** (hi) — Hindi
- **தமிழ்** (ta) — Tamil
- **ਪੰਜਾਬੀ** (pa) — Punjabi
- **ಕನ್ನಡ** (kn) — Kannada
- **ગુજરાતી** (gu) — Gujarati
- **ଓଡ଼ିଆ** (or) — Odia
- **বাংলা** (bn) — Bengali
- **मराठी** (mr) — Marathi

### Changing Language

Users can switch languages via the language dropdown menu available on both the **Control Panel** and **Reporter** interfaces. The selected language preference is automatically saved and persists across sessions.

### Adding New Languages

To add a new language:
1. Open `project/frontend/i18n.js`
2. Add language code and label to `LOCALE_OPTIONS`
3. Create a translation object with all required keys
4. Export the translations in the `getTranslations()` function

## Future Enhancements

- Enhanced map features (route planning, estimated arrival times)
- Advanced filtering and search for historical reports
- User authentication and role-based access control
- Mobile app version
- Integration with actual GIS/mapping services
- Predictive dispatch algorithms

  ## Opencv

  -Add photo location in the computer vission folder
  -put any car photo it detect not of vehical in this photo
  - 
