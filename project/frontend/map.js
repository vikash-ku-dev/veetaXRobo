/**
 * Map + page-specific emergency / control / checkpoint logic.
 * Uses relative imports; load after firebase.js (see HTML).
 */
import * as api from './api.js';
import { rtdbGet, rtdbSet } from './firebase.js';


// Standalone map controller init for reporter.html (Firebase-independent)
document.addEventListener('DOMContentLoaded', () => {
  const page = getPage();
  if (page !== 'reporter.html') return;
  const viewport = document.getElementById('mapViewport');
  const layer = document.getElementById('mapLayer');
  const img = document.getElementById('mapImage');
  const overlay = document.getElementById('mapOverlay');
  if (!viewport || !layer || !img || !overlay) {
    console.error('[Map] DOM elements missing');
    return;
  }
  createMapController(viewport, layer, img, overlay);
  console.log('[Map] Controller attached to reporter.html - Zoom: mouse wheel | Pan: drag');
  
  // Image load handlers (standalone)
  img.addEventListener('load', () => console.log('[Map] Image loaded', img.naturalWidth + 'x' + img.naturalHeight));
  img.addEventListener('error', () => console.error('[Map] Image failed to load:', img.src));
});


// Removed Firebase refs


const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

/** --- Map viewport: zoom (wheel) + pan (drag), image coords from clicks --- */
function createMapController(viewportEl, layerEl, imgEl, overlayEl) {
  let scale = 1;
  let tx = 0;
  let ty = 0;
  const minScale = 0.35;
  const maxScale = 4;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = 0;

  function applyTransform() {
    layerEl.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    scale = clamp(scale * delta, minScale, maxScale);
    applyTransform();
  }

  function onDown(e) {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    viewportEl.classList.add('dragging');
  }

  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX;
    lastY = e.clientY;
    tx += dx;
    ty += dy;
    applyTransform();
  }

  function onUp() {
    dragging = false;
    viewportEl.classList.remove('dragging');
  }

  viewportEl.addEventListener('wheel', onWheel, { passive: false });
  viewportEl.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  applyTransform();

  function clientToMapCoords(clientX, clientY) {
    const rect = imgEl.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }
    const nw = imgEl.naturalWidth || rect.width;
    const nh = imgEl.naturalHeight || rect.height;
    const x = ((clientX - rect.left) / rect.width) * nw;
    const y = ((clientY - rect.top) / rect.height) * nh;
    return { x, y };
  }

  return {
    clientToMapCoords,
    wasDrag() {
      return dragMoved > 6;
    },
    resetDragFlag() {
      dragMoved = 0;
    }
  };
}

function getPage() {
  const p = (window.location.pathname || '').split('/').pop() || '';
  return p.toLowerCase();
}

/** --- Reporter --- */
async function ensureEmergencyParent() { return Promise.resolve(); } // Stub to fix runtime error

async function initReporter() {
  const selected = { type: null, location: null };
  const lockedLocation = { x: null, y: null };
  const btns = {
    accident: document.getElementById('btnAccident'),
    fire: document.getElementById('btnFire'),
    medical: document.getElementById('btnMedical')
  };
  const listEl = document.getElementById('messageList');
  const viewport = document.getElementById('mapViewport');
  const layer = document.getElementById('mapLayer');
  const img = document.getElementById('mapImage');
  const overlay = document.getElementById('mapOverlay');

  function setType(t) {
    selected.type = t;
    Object.entries(btns).forEach(([k, b]) => {
      if (!b) return;
      b.classList.toggle('selected', k === t);
    });
  }

  function pushStatus(text, tone = 'info') {
    if (!listEl) return;
    const item = document.createElement('div');
    item.className = 'message-item';
    item.dataset.tone = tone;
    const ts = new Date();
    item.innerHTML = `<strong>${escapeHtml(text)}</strong><div class="meta">${ts.toLocaleString()}</div>`;
    listEl.prepend(item);
    while (listEl.children.length > 5) {
      listEl.removeChild(listEl.lastElementChild);
    }
  }

  function setTypeButtonsEnabled(enabled) {
    Object.values(btns).forEach((b) => {
      if (!b) return;
      b.disabled = !enabled;
    });
  }

  function clearTypeSelection() {
    selected.type = null;
    Object.values(btns).forEach((b) => b?.classList.remove('selected'));
  }

  setTypeButtonsEnabled(false);
  pushStatus('Click the map to select location first.', 'info');

  Object.entries(btns).forEach(([k, b]) => {
    b?.addEventListener('click', async () => {
      if (!selected.location || !Number.isFinite(lockedLocation.x) || !Number.isFinite(lockedLocation.y)) {
        console.log('[Reporter] Select location first');
        pushStatus('Select location on the map first.', 'warn');
        return;
      }

      setType(k);
      const payload = {
        x: lockedLocation.x,
        y: lockedLocation.y,
        type: selected.type,
        timestamp: Date.now()
      };

      try {
        await api.postReport(payload);
        console.log('[Reporter] Backend write OK', payload);
        pushStatus(`Report submitted: ${selected.type} @ (${Math.round(payload.x)}, ${Math.round(payload.y)})`, 'ok');
      } catch (err) {
        console.error('[Reporter] Backend write failed', err);
        pushStatus('Report failed to submit. Please try again.', 'error');
      } finally {
        clearTypeSelection();
        setTypeButtonsEnabled(true);
        pushStatus('Location kept on map. You can report again or choose a new location.', 'info');
      }
    });
  });

  await ensureEmergencyParent();

  // TODO: Re-enable Firebase reports list when backend ready
  // const reportsRef = collection(db, ...REPORTS_PATH);
  // const q = query(reportsRef, orderBy('timestamp', 'desc'), limit(80));
  //
  // onSnapshot(
  //   q,
  //   (snap) => {
  //     listEl.innerHTML = '';
  //     snap.forEach((d) => {
  //       const r = d.data();
  //       const ts = new Date(r.timestamp);
  //       const div = document.createElement('div');
  //       div.className = 'message-item';
  //       div.innerHTML = `<strong>${escapeHtml(r.type)}</strong> @ (${Math.round(r.x)}, ${Math.round(r.y)})<div class="meta">${ts.toLocaleString()}</div>`;
  //       listEl.appendChild(div);
  //     });
  //   },
  //   (err) => console.error('[Reporter] reports snapshot error', err)
  // );

  const map = createMapController(viewport, layer, img, overlay);
  overlay.classList.add('interactive');

  // Visual marker on reporter
  const reporterMarker = document.createElement('div');
  reporterMarker.className = 'marker emergency-dot';
  reporterMarker.style.pointerEvents = 'none';
  overlay.appendChild(reporterMarker);

  function renderReporterMarker() {
    if (!Number.isFinite(lockedLocation.x) || !Number.isFinite(lockedLocation.y)) {
      reporterMarker.style.display = 'none';
      return;
    }
    const nw = Number(img.naturalWidth) || 1000;
    const nh = Number(img.naturalHeight) || 700;
    if (!Number.isFinite(nw) || !Number.isFinite(nh) || nw <= 0 || nh <= 0) {
      reporterMarker.style.display = 'none';
      return;
    }
    const px = lockedLocation.x / nw;
    const py = lockedLocation.y / nh;
    if (!Number.isFinite(px) || !Number.isFinite(py)) {
      reporterMarker.style.display = 'none';
      return;
    }
    reporterMarker.style.display = 'block';
    reporterMarker.style.left = `${(px * 100).toFixed(4)}%`;
    reporterMarker.style.top = `${(py * 100).toFixed(4)}%`;
  }

  viewport.addEventListener('click', async (e) => {
    if (map.wasDrag()) {
      map.resetDragFlag();
      return;
    }
    const coords = map.clientToMapCoords(e.clientX, e.clientY);
    if (!coords) {
      console.log('[Reporter] Map click outside image');
      return;
    }
    selected.location = coords;
    lockedLocation.x = coords.x;
    lockedLocation.y = coords.y;
    clearTypeSelection();
    setTypeButtonsEnabled(true);
    console.log('[Reporter] Location selected', coords);
    pushStatus(`Location selected @ (${Math.round(coords.x)}, ${Math.round(coords.y)}). Now choose emergency type.`, 'ok');
    
    renderReporterMarker();
  });

img.addEventListener('load', () => {
  console.log('[Reporter] Map image loaded', img.naturalWidth, img.naturalHeight);
  renderReporterMarker();
});
img.addEventListener('error', () => console.error('[Reporter] Map image load failed', img.src));
}

/**
 * Road grid on control map (m.png): white circles at intersections, dashed white lane lines.
 * Normalized 0..1 — tune X/Y arrays so nodes sit on intersection centers (hospital ≈ bottom row).
 */
const CONTROL_GRID_XS = [0.1, 0.26, 0.43, 0.58, 0.74, 0.9];
const CONTROL_GRID_YS = [0.12, 0.3, 0.48, 0.66, 0.8];

function densifyRoadPolyline(pts, stepsPerSegment = 6) {
  if (pts.length < 2) return pts.slice();
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    for (let s = 0; s < stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      out.push({
        x: a.x * (1 - t) + b.x * t,
        y: a.y * (1 - t) + b.y * t
      });
    }
  }
  out.push({ ...pts[pts.length - 1] });
  return out;
}

function buildControlGridPoints(w, h) {
  const cols = CONTROL_GRID_XS.length;
  const nodes = [];
  for (let r = 0; r < CONTROL_GRID_YS.length; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      nodes.push({
        x: CONTROL_GRID_XS[c] * w,
        y: CONTROL_GRID_YS[r] * h,
        i
      });
    }
  }
  return nodes;
}

function nearestGridNodeIndex(px, py, nodes) {
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const d = dist(px, py, nodes[i].x, nodes[i].y);
    if (d < bd) {
      bd = d;
      best = i;
    }
  }
  return best;
}

function gridNeighbors(nodeIndex, rows, cols) {
  const r = Math.floor(nodeIndex / cols);
  const c = nodeIndex % cols;
  const out = [];
  if (r > 0) out.push(nodeIndex - cols);
  if (r < rows - 1) out.push(nodeIndex + cols);
  if (c > 0) out.push(nodeIndex - 1);
  if (c < cols - 1) out.push(nodeIndex + 1);
  return out;
}

function gridBfsPath(startI, goalI, rows, cols) {
  if (startI === goalI) return [startI];
  const parent = new Map();
  parent.set(startI, null);
  const q = [startI];
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++];
    for (const v of gridNeighbors(u, rows, cols)) {
      if (parent.has(v)) continue;
      parent.set(v, u);
      if (v === goalI) {
        const path = [];
        let cur = goalI;
        while (cur !== null) {
          path.unshift(cur);
          cur = parent.get(cur);
        }
        return path;
      }
      q.push(v);
    }
  }
  return [startI, goalI];
}

/** L-shaped path along horizontal/vertical roads only (between two points). */
function manhattanRoadPath(a, b, stepsPerLeg = 10) {
  const mid1 = { x: b.x, y: a.y };
  const mid2 = { x: a.x, y: b.y };
  const d1 = dist(a.x, a.y, mid1.x, mid1.y) + dist(mid1.x, mid1.y, b.x, b.y);
  const d2 = dist(a.x, a.y, mid2.x, mid2.y) + dist(mid2.x, mid2.y, b.x, b.y);
  const corners = d1 <= d2 ? [a, mid1, b] : [a, mid2, b];
  return densifyRoadPolyline(corners, stepsPerLeg);
}

function concatPathDedupe(a, b) {
  if (!a.length) return b.slice();
  if (!b.length) return a.slice();
  const last = a[a.length - 1];
  const first = b[0];
  if (dist(last.x, last.y, first.x, first.y) < 0.5) {
    return a.concat(b.slice(1));
  }
  return a.concat(b);
}

/** Build a path finder directly from dark road pixels in map image. */
function createImageRoadRouter(imgEl) {
  if (!imgEl || !imgEl.naturalWidth || !imgEl.naturalHeight) return null;

  const w = imgEl.naturalWidth;
  const h = imgEl.naturalHeight;
  const cellSize = 5;
  const gw = Math.max(1, Math.floor(w / cellSize));
  const gh = Math.max(1, Math.floor(h / cellSize));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(imgEl, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h).data;

  const idx = (x, y) => y * gw + x;
  const darkRoad = new Uint8Array(gw * gh);
  const whiteLine = new Uint8Array(gw * gh);

  const rgbAt = (px, py) => {
    const x = clamp(px, 0, w - 1);
    const y = clamp(py, 0, h - 1);
    const o = (y * w + x) * 4;
    const r = imageData[o];
    const g = imageData[o + 1];
    const b = imageData[o + 2];
    return { r, g, b };
  };

  const luminance = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const saturation = ({ r, g, b }) => Math.max(r, g, b) - Math.min(r, g, b);

  function sampleCell(gx, gy) {
    const sx = gx * cellSize;
    const sy = gy * cellSize;
    return [
      rgbAt(sx + 1, sy + 1),
      rgbAt(sx + Math.floor(cellSize / 2), sy + Math.floor(cellSize / 2)),
      rgbAt(sx + cellSize - 2, sy + cellSize - 2)
    ];
  }

  // Pass 1: classify cells as black-road-ish or white-line-ish.
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      const pts = sampleCell(gx, gy);
      let darkVotes = 0;
      let whiteVotes = 0;
      for (const p of pts) {
        const l = luminance(p);
        const s = saturation(p);
        const isDarkRoad = l < 95 && !(p.g > p.r + 30 && p.g > p.b + 30); // reject green-ish dark
        const isWhiteMark = l > 212 && s < 35; // bright neutral white
        if (isDarkRoad) darkVotes++;
        if (isWhiteMark) whiteVotes++;
      }
      darkRoad[idx(gx, gy)] = darkVotes >= 2 ? 1 : 0;
      whiteLine[idx(gx, gy)] = whiteVotes >= 2 ? 1 : 0;
    }
  }

  // Pass 2: keep only white marks that are near dark road (avoids random white UI/buildings).
  const whiteOnRoad = new Uint8Array(whiteLine.length);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (!whiteLine[idx(gx, gy)]) continue;
      let nearRoad = false;
      for (let dy = -2; dy <= 2 && !nearRoad; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          if (darkRoad[idx(nx, ny)]) {
            nearRoad = true;
            break;
          }
        }
      }
      whiteOnRoad[idx(gx, gy)] = nearRoad ? 1 : 0;
    }
  }

  // Walkable cells: white dotted line only + tiny black-road bridge near white.
  const bridgeRoad = new Uint8Array(darkRoad.length);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      if (!darkRoad[idx(gx, gy)]) continue;
      let nearWhite = false;
      for (let dy = -1; dy <= 1 && !nearWhite; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          if (whiteOnRoad[idx(nx, ny)]) {
            nearWhite = true;
            break;
          }
        }
      }
      bridgeRoad[idx(gx, gy)] = nearWhite ? 1 : 0;
    }
  }

  const walkable = new Uint8Array(darkRoad.length);
  for (let i = 0; i < walkable.length; i++) {
    walkable[i] = whiteOnRoad[i] || bridgeRoad[i] ? 1 : 0;
  }

  // Very small inflate for anti-aliased dotted segments only.
  const inflated = new Uint8Array(walkable.length);
  for (let gy = 0; gy < gh; gy++) {
    for (let gx = 0; gx < gw; gx++) {
      let ok = false;
      for (let dy = -1; dy <= 1 && !ok; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > 1) continue; // no diagonal inflate
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          if (walkable[idx(nx, ny)]) {
            ok = true;
            break;
          }
        }
      }
      inflated[idx(gx, gy)] = ok ? 1 : 0;
    }
  }

  function pxToGrid(x, y) {
    return {
      gx: clamp(Math.floor(x / cellSize), 0, gw - 1),
      gy: clamp(Math.floor(y / cellSize), 0, gh - 1)
    };
  }

  function gridToPx(gx, gy) {
    return {
      x: gx * cellSize + cellSize * 0.5,
      y: gy * cellSize + cellSize * 0.5
    };
  }

  function nearestWalkable(startGx, startGy, allowDarkRoad = false) {
    const isAllowed = (gx, gy) =>
      whiteOnRoad[idx(gx, gy)] || inflated[idx(gx, gy)] || (allowDarkRoad && darkRoad[idx(gx, gy)]);
    if (isAllowed(startGx, startGy)) return { gx: startGx, gy: startGy };
    const maxR = Math.max(gw, gh);
    for (let r = 1; r <= maxR; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const nx = startGx + dx;
          const ny = startGy + dy;
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          if (isAllowed(nx, ny)) return { gx: nx, gy: ny };
        }
      }
    }
    return null;
  }

  function reconstructPath(cameFrom, endNode) {
    const out = [];
    let cur = endNode;
    while (cur) {
      out.push(gridToPx(cur.gx, cur.gy));
      cur = cameFrom.get(`${cur.gx},${cur.gy}`);
    }
    out.reverse();
    return out;
  }

  function runAStar(start, goal, allowDarkRoad = false) {
    const key = (n) => `${n.gx},${n.gy}`;
    const open = [start];
    const openSet = new Set([key(start)]);
    const cameFrom = new Map();
    const gScore = new Map([[key(start), 0]]);
    const fScore = new Map([[key(start), Math.abs(start.gx - goal.gx) + Math.abs(start.gy - goal.gy)]]);

    while (open.length) {
      let bestI = 0;
      for (let i = 1; i < open.length; i++) {
        if ((fScore.get(key(open[i])) ?? Infinity) < (fScore.get(key(open[bestI])) ?? Infinity)) bestI = i;
      }
      const current = open.splice(bestI, 1)[0];
      openSet.delete(key(current));
      if (current.gx === goal.gx && current.gy === goal.gy) {
        return reconstructPath(cameFrom, current);
      }

      const neighbors = [
        { gx: current.gx + 1, gy: current.gy },
        { gx: current.gx - 1, gy: current.gy },
        { gx: current.gx, gy: current.gy + 1 },
        { gx: current.gx, gy: current.gy - 1 }
      ];
      for (const nb of neighbors) {
        if (nb.gx < 0 || nb.gy < 0 || nb.gx >= gw || nb.gy >= gh) continue;
        const nIdx = idx(nb.gx, nb.gy);
        const allowed = whiteOnRoad[nIdx] || bridgeRoad[nIdx] || (allowDarkRoad && darkRoad[nIdx]);
        if (!allowed) continue;
        const nKey = key(nb);
        // Prefer white dotted centerline strongly; black bridge only for tiny gaps.
        const stepCost = whiteOnRoad[nIdx] ? 1 : bridgeRoad[nIdx] ? 18 : darkRoad[nIdx] ? 7 : 999;
        const tentative = (gScore.get(key(current)) ?? Infinity) + stepCost;
        if (tentative >= (gScore.get(nKey) ?? Infinity)) continue;
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentative);
        const hCost = Math.abs(nb.gx - goal.gx) + Math.abs(nb.gy - goal.gy);
        fScore.set(nKey, tentative + hCost);
        if (!openSet.has(nKey)) {
          open.push(nb);
          openSet.add(nKey);
        }
      }
    }

    return null;
  }

  function buildPath(fromX, fromY, toX, toY) {
    const startRaw = pxToGrid(fromX, fromY);
    const goalRaw = pxToGrid(toX, toY);

    // Pass 1: strict dotted-line routing.
    const strictStart = nearestWalkable(startRaw.gx, startRaw.gy, false);
    const strictGoal = nearestWalkable(goalRaw.gx, goalRaw.gy, false);
    if (strictStart && strictGoal) {
      const strictPath = runAStar(strictStart, strictGoal, false);
      if (strictPath && strictPath.length) return strictPath;
    }

    // Pass 2: still image-road-only, but allow full black road cells.
    const fallbackStart = nearestWalkable(startRaw.gx, startRaw.gy, true);
    const fallbackGoal = nearestWalkable(goalRaw.gx, goalRaw.gy, true);
    if (fallbackStart && fallbackGoal) {
      return runAStar(fallbackStart, fallbackGoal, true);
    }
    return null;
  }

  return { buildPath };
}

/** Route only on the dashed road grid (intersection nodes + horizontal/vertical legs). */
function buildGridRoadPath(fromX, fromY, toX, toY, w, h) {
  const rows = CONTROL_GRID_YS.length;
  const cols = CONTROL_GRID_XS.length;
  const nodes = buildControlGridPoints(w, h);
  const ia = nearestGridNodeIndex(fromX, fromY, nodes);
  const ib = nearestGridNodeIndex(toX, toY, nodes);
  const nodeIdxPath = gridBfsPath(ia, ib, rows, cols);
  const gridPts = nodeIdxPath.map((idx) => ({ x: nodes[idx].x, y: nodes[idx].y }));
  let dense = [];
  const toFirst = manhattanRoadPath({ x: fromX, y: fromY }, { x: gridPts[0].x, y: gridPts[0].y }, 8);
  dense = concatPathDedupe([], toFirst);
  dense = concatPathDedupe(dense, densifyRoadPolyline(gridPts, 10));
  const toDest = manhattanRoadPath(
    { x: gridPts[gridPts.length - 1].x, y: gridPts[gridPts.length - 1].y },
    { x: toX, y: toY },
    8
  );
  dense = concatPathDedupe(dense, toDest.slice(1));
  return dense.length ? dense : [{ x: toX, y: toY }];
}

/** Normalize checkpoints for control routing. */
function normalizeCheckpointsForControl(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => ({
      id: String(c.id || ''),
      x: Number(c.x),
      y: Number(c.y),
      active: c.active !== false,
      cpType: c.cpType === 'sensor' ? 'sensor' : 'manual',
      sensorIndex: Number(c.sensorIndex || 0),
      createdAt: Number(c.createdAt ?? 0)
    }))
    .filter((c) => Number.isFinite(c.x) && Number.isFinite(c.y))
    .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
}

function extractMagneticSensorMap(raw) {
  const entries = Object.entries(raw || {})
    .map(([key, value]) => {
      const m = String(key).match(/^magnetic(?:sensor|senser)(\d+)$/i);
      if (!m) return null;
      return { index: Number(m[1]), value };
    })
    .filter((x) => x && Number.isFinite(x.index) && x.index > 0)
    .sort((a, b) => a.index - b.index);
  return new Map(entries.map((e) => [e.index, e.value]));
}

function sensorIsOn(value) {
  return value === true || value === 1 || value === '1' || value === 'on' || value === 'ON' || value === 'true';
}

/** --- Control --- */
function initControl() {
  /** Only show the newest N items in the control message list (keeps UI clean). */
  const CONTROL_MESSAGE_LIMIT = 5;
  const listEl = document.getElementById('controlMessageList');
  const viewport = document.getElementById('mapViewport');
  const layer = document.getElementById('mapLayer');
  const img = document.getElementById('mapImage');
  const overlay = document.getElementById('mapOverlay');
  if (!listEl || !viewport || !layer || !img || !overlay) {
    console.error('[Control] DOM elements missing');
    return;
  }
  overlay.classList.add('interactive');

  const selectedReport = { id: null, type: null, x: 0, y: 0 };
  const completedReportIds = new Set();
  let cachedControlReports = [];
  const reportStatus = new Map();
  let dispatchedReportId = null;

  let checkpointsForControl = [];
  let latestSensorMap = new Map();
  let roadRouter = null;

  function getPendingReports() {
    return cachedControlReports.filter((r) => !completedReportIds.has(r.id));
  }

  function notifyNoEmergency() {
    window.alert('NO EMERGENCY REPORTED');
  }

  function setCheckpointStopsFromServer(raw) {
    checkpointsForControl = normalizeCheckpointsForControl(raw);
  }

  async function fetchCheckpointsForRoute() {
    try {
      setCheckpointStopsFromServer(await api.getCheckpoints());
    } catch (err) {
      console.error('[Control] getCheckpoints failed', err);
    }
  }

  async function syncSensorsForControl() {
    try {
      latestSensorMap = extractMagneticSensorMap(await rtdbGet(''));
    } catch (err) {
      console.error('[Control] sensor read failed', err);
    }
  }

  function collectManualStopsBetween(a, b, usedManualIds) {
    const ax = a.x;
    const ay = a.y;
    const bx = b.x;
    const by = b.y;
    const dx = bx - ax;
    const dy = by - ay;
    const segLen2 = dx * dx + dy * dy;
    if (segLen2 <= 1e-6) return [];
    const maxDist = Math.max(22, Math.sqrt(segLen2) * 0.12);
    const candidates = checkpointsForControl
      .filter((cp) => cp.cpType === 'manual' && cp.active && !usedManualIds.has(cp.id))
      .map((cp) => {
        const t = ((cp.x - ax) * dx + (cp.y - ay) * dy) / segLen2;
        if (t <= 0 || t >= 1) return null;
        const projX = ax + t * dx;
        const projY = ay + t * dy;
        const off = dist(cp.x, cp.y, projX, projY);
        if (off > maxDist) return null;
        return { cp, t };
      })
      .filter(Boolean)
      .sort((m1, m2) => m1.t - m2.t)
      .map((m) => m.cp);
    candidates.forEach((cp) => usedManualIds.add(cp.id));
    return candidates;
  }

  function getSensorCheckpoints(indices) {
    const set = new Set(indices);
    return checkpointsForControl
      .filter((cp) => cp.cpType === 'sensor' && set.has(cp.sensorIndex))
      .sort((a, b) => a.sensorIndex - b.sensorIndex);
  }

  function buildRouteLegPath(ax, ay, bx, by, width, height) {
    const ensureRoadRouter = () => {
      if (!roadRouter && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        roadRouter = createImageRoadRouter(img);
      }
    };
    ensureRoadRouter();
    return roadRouter?.buildPath(ax, ay, bx, by) || buildGridRoadPath(ax, ay, bx, by, width, height);
  }

  function buildLegsThroughAnchors(anchors, options = {}) {
    const legs = [];
    const usedManualIds = new Set();
    const width = nw();
    const height = nh();
    for (let i = 0; i < anchors.length - 1; i++) {
      const from = anchors[i];
      const to = anchors[i + 1];
      const addManualBetween = from.sensorIndex > 0 && to.sensorIndex > 0;
      const manualStops = addManualBetween ? collectManualStopsBetween(from, to, usedManualIds) : [];
      const through = [from, ...manualStops, to];
      const gateSensorIndex = to.sensorIndex > 0 ? to.sensorIndex : null;
      for (let j = 0; j < through.length - 1; j++) {
        const a = through[j];
        const b = through[j + 1];
        const path = buildRouteLegPath(a.x, a.y, b.x, b.y, width, height);
        if (!path || !path.length) continue;
        const sensorGate =
          a.sensorIndex > 0
            ? a.sensorIndex
            : b.sensorIndex > 0
              ? b.sensorIndex
              : null;
        legs.push({
          path,
          gateSensorIndex: sensorGate,
          waitUntilOn: Boolean(sensorGate),
          slowWhenOff: false
        });
      }
    }
    return legs;
  }

  function buildDispatchLegs(fromX, fromY, toX, toY) {
    const outboundSensors = getSensorCheckpoints([1, 2, 3, 4]);
    const anchors = [{ x: fromX, y: fromY, sensorIndex: 0 }, ...outboundSensors, { x: toX, y: toY, sensorIndex: 0 }];
    return buildLegsThroughAnchors(anchors, { waitFirstSensorOn: true, slowOnGatedLegs: false });
  }

  function buildReturnLegs(fromX, fromY, homeX, homeY) {
    const returnSensors = checkpointsForControl
      .filter((cp) => cp.cpType === 'sensor' && cp.sensorIndex >= 5)
      .sort((a, b) => a.sensorIndex - b.sensorIndex);
    const anchors = [{ x: fromX, y: fromY, sensorIndex: 0 }, ...returnSensors, { x: homeX, y: homeY, sensorIndex: 0 }];
    return buildLegsThroughAnchors(anchors, { waitFirstSensorOn: false, slowOnGatedLegs: false });
  }

  function legSpeed(leg) {
    const base = 0.38;
    if (!leg || !leg.gateSensorIndex) return base;
    const on = sensorIsOn(latestSensorMap.get(leg.gateSensorIndex));
    if (leg.waitUntilOn && !on) return 0;
    return base;
  }

  createMapController(viewport, layer, img, overlay);
  const markers = {};
  const nw = () => img.naturalWidth || 1000;
  const nh = () => img.naturalHeight || 700;
  const ambulanceEl = overlay.querySelector('.ambulance-icon');
  const ambulance = {
    x: nw() * 0.43,
    y: nh() * 0.8,
    homeX: nw() * 0.43,
    homeY: nh() * 0.8,
    routeLegs: [],
    legIndex: 0,
    legPointIndex: 0,
    phase: 'idle'
  };

  if (ambulanceEl) {
    ambulanceEl.style.pointerEvents = 'auto';
    ambulanceEl.style.cursor = 'pointer';
    const leftPct = parseFloat(ambulanceEl.style.left || '43');
    const topPct = parseFloat(ambulanceEl.style.top || '80');
    if (Number.isFinite(leftPct) && Number.isFinite(topPct)) {
      ambulance.x = (leftPct / 100) * nw();
      ambulance.y = (topPct / 100) * nh();
      ambulance.homeX = ambulance.x;
      ambulance.homeY = ambulance.y;
    }
  }

  function renderAmbulance() {
    if (!ambulanceEl) return;
    ambulanceEl.style.left = `${(ambulance.x / nw()) * 100}%`;
    ambulanceEl.style.top = `${(ambulance.y / nh()) * 100}%`;
  }

  function placeEmergencyDot() {
    let el = markers['emergency'];
    if (!el) {
      el = document.createElement('div');
      el.className = 'marker emergency-dot';
      overlay.appendChild(el);
      markers['emergency'] = el;
    }
    if (!selectedReport.id || completedReportIds.has(selectedReport.id)) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.left = `${(selectedReport.x / nw()) * 100}%`;
    el.style.top = `${(selectedReport.y / nh()) * 100}%`;
  }

  function normalizeReports(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((r, index) => ({
        id: String(r.id ?? r._id ?? `${r.timestamp ?? Date.now()}-${index}`),
        type: String(r.type || 'unknown'),
        x: Number(r.x),
        y: Number(r.y),
        timestamp: Number(r.timestamp || Date.now())
      }))
      .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, CONTROL_MESSAGE_LIMIT);
  }

  function selectReport(r) {
    selectedReport.id = r.id;
    selectedReport.type = r.type;
    selectedReport.x = r.x;
    selectedReport.y = r.y;
    placeEmergencyDot();
  }

  function moveToward(entity, tx, ty, speed) {
    const d = dist(entity.x, entity.y, tx, ty);
    if (d < 2) {
      entity.x = tx;
      entity.y = ty;
      return true;
    }
    const t = Math.min(1, speed / Math.max(d, 0.001));
    entity.x += (tx - entity.x) * t;
    entity.y += (ty - entity.y) * t;
    return false;
  }

  function formatReportLabel(type) {
    const t = String(type || 'unknown').toLowerCase();
    if (t === 'accident') return 'Accident';
    if (t === 'fire') return 'Fire';
    if (t === 'medical') return 'Medical';
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function renderReports(reports) {
    listEl.innerHTML = '';
    reports.forEach((r) => {
      const ts = new Date(r.timestamp);
      const div = document.createElement('div');
      const status = reportStatus.get(r.id);
      const done = completedReportIds.has(r.id);
      div.className = 'message-item';
      if (done) div.classList.add('completed-dispatch');
      if (r.id === selectedReport.id) div.classList.add('selected');
      let metaLine, metaClass = 'meta';
      if (status === 'on-the-way') {
        metaLine = '<span class="status-label">On the way</span>';
      } else if (status === 'to-hospital') {
        metaLine = '<span class="status-label">On hospital way</span>';
      } else if (done) {
        metaLine = `<span class="success-label">Successful</span> · ${ts.toLocaleString()}`;
        metaClass = 'meta meta-success';
      } else {
        metaLine = ts.toLocaleString();
      }
      div.innerHTML = `<strong>${escapeHtml(formatReportLabel(r.type))}</strong><div class="${metaClass}">${metaLine}</div>`;
      div.addEventListener('click', () => {
        if (done) return;
        selectReport(r);
        listEl.querySelectorAll('.message-item').forEach((el) => el.classList.remove('selected'));
        div.classList.add('selected');
      });
      listEl.appendChild(div);
    });
  }


function onAmbulanceReachedEmergency() {
  const id = selectedReport.id;
  if (id) {
    completedReportIds.add(id);
    if (reportStatus.has(id)) {
      reportStatus.set(id, 'to-hospital');
      renderReports(cachedControlReports);
    }
  }
  selectedReport.id = null;
  selectedReport.type = null;
  selectedReport.x = 0;
  selectedReport.y = 0;
  placeEmergencyDot();
  renderReports(cachedControlReports);
}


  api.onData('reports', (incoming) => {
    const reports = normalizeReports(incoming);
    cachedControlReports = reports;
    renderReports(reports);
    if (!reports.length) {
      selectedReport.id = null;
      placeEmergencyDot();
      return;
    }
    const pendingReports = getPendingReports();
    const selectedStillExists =
      selectedReport.id &&
      pendingReports.some((r) => r.id === selectedReport.id);
    if (!selectedStillExists) {
      if (pendingReports.length) {
        selectReport(pendingReports[0]);
      } else {
        selectedReport.id = null;
        selectedReport.type = null;
        selectedReport.x = 0;
        selectedReport.y = 0;
        placeEmergencyDot();
      }
    }
  });

  renderReports([]);
  selectedReport.id = null;
  placeEmergencyDot();

  fetchCheckpointsForRoute();
  syncSensorsForControl();
  window.setInterval(syncSensorsForControl, 700);
  api.onData('checkpoints', (incoming) => {
    setCheckpointStopsFromServer(incoming);
  });

  if (ambulanceEl) {
    ambulanceEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (ambulance.phase !== 'idle') return;
      const pendingReports = getPendingReports();
      if (!selectedReport.id && pendingReports.length) {
        selectReport(pendingReports[0]);
        renderReports(cachedControlReports);
      }
      if (!selectedReport.id) {
        notifyNoEmergency();
        return;
      }
      if (completedReportIds.has(selectedReport.id)) {
        notifyNoEmergency();
        return;
      }
      // Trigger servo immediately, before any route computation.
      rtdbSet('servo/status', 1).catch((err) => {
        console.error('[Control] Failed to set servo/status', err);
      });
      ambulance.routeLegs = buildDispatchLegs(
        ambulance.x,
        ambulance.y,
        selectedReport.x,
        selectedReport.y
      );
      if (!ambulance.routeLegs.length) {
        // Final safety fallback so click always dispatches.
        ambulance.routeLegs = [{
          path: buildGridRoadPath(ambulance.x, ambulance.y, selectedReport.x, selectedReport.y, nw(), nh()),
          gateSensorIndex: null,
          waitUntilOn: false,
          slowWhenOff: false
        }];
      }
      if (!ambulance.routeLegs.length) return;
      ambulance.legIndex = 0;
      ambulance.legPointIndex = 0;
      ambulance.phase = 'to-emergency';
      reportStatus.set(selectedReport.id, 'on-the-way');
      renderReports(cachedControlReports);
      console.log(
        '[Control] Ambulance dispatch',
        ambulance.routeLegs.length ? `via ${ambulance.routeLegs.length} leg(s)` : 'via grid road'
      );
    });
  }


  function frame() {
    const activeLeg = ambulance.routeLegs[ambulance.legIndex];
    if (activeLeg && activeLeg.path.length && ambulance.legPointIndex < activeLeg.path.length) {
      const target = activeLeg.path[ambulance.legPointIndex];
      const speed = legSpeed(activeLeg);
      const done = moveToward(ambulance, target.x, target.y, speed);
      if (done) ambulance.legPointIndex++;
      if (ambulance.legPointIndex >= activeLeg.path.length) {
        ambulance.legIndex++;
        ambulance.legPointIndex = 0;
      }
      if (ambulance.legIndex >= ambulance.routeLegs.length) {
        ambulance.routeLegs = [];
        ambulance.legIndex = 0;
        ambulance.legPointIndex = 0;
        if (ambulance.phase === 'to-emergency') {
          onAmbulanceReachedEmergency();
          const returnLegs = buildReturnLegs(
            ambulance.x,
            ambulance.y,
            ambulance.homeX,
            ambulance.homeY
          );
          if (!returnLegs.length) {
            ambulance.phase = 'idle';
            console.warn('[Control] No valid dotted-line return route found');
          } else {
            ambulance.phase = 'return-home';
            ambulance.routeLegs = returnLegs;
            ambulance.legIndex = 0;
            ambulance.legPointIndex = 0;
            console.log('[Control] Ambulance reached emergency, returning on dotted-line route');
          }
        } else if (ambulance.phase === 'return-home') {
          ambulance.phase = 'idle';
          // Clear any lingering status
          for (const id of reportStatus.keys()) {
            reportStatus.delete(id);
          }
          renderReports(cachedControlReports);
          console.log('[Control] Ambulance returned to hospital');
        }
      }

      renderAmbulance();
    }
    requestAnimationFrame(frame);
  }
  renderAmbulance();
  requestAnimationFrame(frame);

  img.addEventListener('load', () => {
    console.log('[Control] Map image loaded', img.naturalWidth, img.naturalHeight);
    roadRouter = createImageRoadRouter(img);
    placeEmergencyDot();
    renderAmbulance();
  });

  if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
    roadRouter = createImageRoadRouter(img);
  }
}

/** --- Checkpoint editor --- */
async function initCheckpoint() {
  const viewport = document.getElementById('mapViewport');
  const layer = document.getElementById('mapLayer');
  const img = document.getElementById('mapImage');
  const overlay = document.getElementById('mapOverlay');
  const listEl = document.getElementById('checkpointList');
  const modeSwitchEl = document.getElementById('checkpointModeSwitch');
  const modeHintEl = document.getElementById('checkpointModeHint');
  if (!viewport || !layer || !img || !overlay || !listEl || !modeSwitchEl || !modeHintEl) {
    console.error('[Checkpoint] DOM elements missing');
    return;
  }
  overlay.classList.add('interactive');

  const map = createMapController(viewport, layer, img, overlay);
  const markersById = {};
  let checkpointDocs = [];
  let syncingSensors = false;
  let selectedCreateType = 'sensor';
  let sensorCount = 0;
  let latestSensorMap = new Map();

  function normalizeCheckpointDocs(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map((c) => ({
        id: String(c.id || ''),
        x: Number(c.x),
        y: Number(c.y),
        active: c.active !== false,
        cpType: c.cpType === 'sensor' ? 'sensor' : 'manual',
        sensorIndex: Number(c.sensorIndex || 0),
        createdAt: Number(c.createdAt ?? 0)
      }))
      .filter((c) => c.id && Number.isFinite(c.x) && Number.isFinite(c.y))
      .sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id));
  }

  function parseSensorMap(raw) {
    const entries = Object.entries(raw || {})
      .map(([key, value]) => {
        const m = String(key).match(/^magnetic(?:sensor|senser)(\d+)$/i);
        if (!m) return null;
        return { index: Number(m[1]), value };
      })
      .filter((x) => x && Number.isFinite(x.index) && x.index > 0)
      .sort((a, b) => a.index - b.index);
    return new Map(entries.map((e) => [e.index, e.value]));
  }

  function renderModeHint() {
    const usedSensor = checkpointDocs.filter((c) => c.cpType === 'sensor').length;
    modeHintEl.textContent = `Sensor checkpoints: ${usedSensor}/${sensorCount}`;
  }

  function setCreateType(type) {
    selectedCreateType = type === 'manual' ? 'manual' : 'sensor';
    modeSwitchEl.querySelectorAll('.cp-mode-btn').forEach((btn) => {
      const on = btn.dataset.mode === selectedCreateType;
      btn.classList.toggle('selected', on);
    });
  }

  modeSwitchEl.querySelectorAll('.cp-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => setCreateType(btn.dataset.mode));
  });
  setCreateType('sensor');

  function renderList(docs) {
    listEl.innerHTML = '';
    docs.forEach((c) => {
      const row = document.createElement('div');
      row.className = 'cp-item';
      const shortId = c.id.length > 8 ? `${escapeHtml(c.id.slice(0, 8))}…` : escapeHtml(c.id);
      const cpLabel =
        c.cpType === 'sensor'
          ? `S${c.sensorIndex > 0 ? c.sensorIndex : '?'} · Sensor`
          : 'Manual';
      row.innerHTML = `<span>[${cpLabel}] ${shortId} (${Math.round(c.x)}, ${Math.round(c.y)})</span>`;
      const actions = document.createElement('div');
      actions.className = 'cp-actions';
      const t = document.createElement('button');
      t.className = 'toggle';
      t.textContent = c.cpType === 'sensor' ? 'AUTO' : c.active ? 'ON' : 'OFF';
      t.disabled = c.cpType === 'sensor';
      if (c.cpType !== 'sensor') {
        t.addEventListener('click', async () => {
          try {
            await api.putCheckpoint(c.id, { active: !c.active });
            console.log('[Checkpoint] toggled', c.id, !c.active);
          } catch (err) {
            console.error('[Checkpoint] toggle failed', err);
          }
        });
      }
      const del = document.createElement('button');
      del.className = 'cp-delete';
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        try {
          await api.deleteCheckpoint(c.id);
          console.log('[Checkpoint] deleted', c.id);
        } catch (err) {
          console.error('[Checkpoint] delete failed', err);
        }
      });
      actions.appendChild(t);
      actions.appendChild(del);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  function placeCpMarker(id, x, y, active) {
    const cp = checkpointDocs.find((d) => d.id === id);
    let el = markersById[id];
    if (!el) {
      el = document.createElement('div');
      el.className = 'marker cp-marker';
      overlay.appendChild(el);
      markersById[id] = el;
    }
    el.classList.toggle('sensor', cp?.cpType === 'sensor');
    el.classList.toggle('inactive', !active);
    const nw = img.naturalWidth || 1000;
    const nh = img.naturalHeight || 700;
    el.style.left = `${(x / nw) * 100}%`;
    el.style.top = `${(y / nh) * 100}%`;
    el.style.display = 'block';
  }

  function applyCheckpointData(raw) {
    const docs = normalizeCheckpointDocs(raw);
    checkpointDocs = docs;
    renderList(docs);
    renderModeHint();
    Object.keys(markersById).forEach((k) => {
      if (!docs.find((d) => d.id === k)) {
        markersById[k].remove();
        delete markersById[k];
      }
    });
    docs.forEach((c) => placeCpMarker(c.id, c.x, c.y, c.active));
  }

  function toSensorBool(v) {
    if (v === true || v === 1 || v === '1' || v === 'on' || v === 'ON' || v === 'true') return true;
    return false;
  }

  async function syncCheckpointsFromSensors() {
    if (syncingSensors) return;
    syncingSensors = true;
    try {
      const sensors = (await rtdbGet('')) || {};
      latestSensorMap = parseSensorMap(sensors);
      sensorCount = latestSensorMap.size;
      renderModeHint();
      if (!Array.isArray(checkpointDocs) || !checkpointDocs.length) return;
      const updates = [];
      const sensorCpsByCreated = [...checkpointDocs]
        .filter((cp) => cp.cpType === 'sensor')
        .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
      const occupied = new Set(sensorCpsByCreated.map((cp) => cp.sensorIndex).filter((n) => n > 0));
      for (const cp of sensorCpsByCreated) {
        if (cp.sensorIndex > 0) continue;
        for (let i = 1; i <= sensorCount; i++) {
          if (!occupied.has(i)) {
            occupied.add(i);
            cp.sensorIndex = i;
            updates.push(api.putCheckpoint(cp.id, { sensorIndex: i }));
            break;
          }
        }
      }
      checkpointDocs.forEach((cp) => {
        if (cp.cpType !== 'sensor' || cp.sensorIndex <= 0) return;
        if (!latestSensorMap.has(cp.sensorIndex)) return;
        const shouldBeOn = toSensorBool(latestSensorMap.get(cp.sensorIndex));
        if (cp.active !== shouldBeOn) {
          updates.push(api.putCheckpoint(cp.id, { active: shouldBeOn }));
        }
      });
      if (updates.length) await Promise.all(updates);
    } catch (err) {
      console.error('[Checkpoint] sensor sync failed', err);
    } finally {
      syncingSensors = false;
    }
  }

  api.onData('checkpoints', (incoming) => {
    applyCheckpointData(incoming);
  });

  try {
    applyCheckpointData(await api.getCheckpoints());
    await syncCheckpointsFromSensors();
    window.setInterval(syncCheckpointsFromSensors, 1200);
  } catch (err) {
    console.error('[Checkpoint] initial load failed', err);
  }

  viewport.addEventListener('click', async (e) => {
    if (map.wasDrag()) {
      map.resetDragFlag();
      return;
    }
    const coords = map.clientToMapCoords(e.clientX, e.clientY);
    if (!coords) return;
    console.log('[Checkpoint] Map click create', coords);
    try {
      const sensorCps = checkpointDocs.filter((c) => c.cpType === 'sensor');
      const usedIndices = new Set(sensorCps.map((c) => c.sensorIndex).filter((n) => n > 0));
      let sensorIndex = 0;
      if (selectedCreateType === 'sensor') {
        for (let i = 1; i <= sensorCount; i++) {
          if (!usedIndices.has(i)) {
            sensorIndex = i;
            break;
          }
        }
        if (sensorIndex === 0) {
          window.alert('All sensor checkpoints are already used. Add manual checkpoint or delete one sensor checkpoint.');
          return;
        }
      }
      await api.postCheckpoint({
        x: coords.x,
        y: coords.y,
        active: selectedCreateType === 'sensor' ? toSensorBool(latestSensorMap.get(sensorIndex)) : false,
        cpType: selectedCreateType,
        sensorIndex
      });
      console.log('[Checkpoint] saved');
    } catch (err) {
      console.error('[Checkpoint] save failed', err);
    }
  });

  img.addEventListener('load', () => console.log('[Checkpoint] Map image loaded', img.naturalWidth, img.naturalHeight));
}

// Removed ensureEmergencyParent


function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function boot() {
  const page = getPage();
  console.log('[App] boot', page);
  api.connectWS();

  if (page === 'reporter.html') await initReporter();
  else if (page === 'control.html') initControl();
  else if (page === 'checkpoint.html') await initCheckpoint();
  else console.warn('[App] Unknown page — no init', page);
}

boot();
