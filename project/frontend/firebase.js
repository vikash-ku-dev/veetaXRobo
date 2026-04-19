// Firebase Realtime Database helpers via REST (no SDK dependency).
const RTDB_BASE_URL = 'https://veetax-1a2ff-default-rtdb.asia-southeast1.firebasedatabase.app';

function normalizePath(path) {
  return String(path || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

export async function rtdbGet(path = '') {
  const key = normalizePath(path);
  const url = `${RTDB_BASE_URL}/${key ? `${key}.json` : '.json'}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RTDB GET failed: ${res.status}`);
  return res.json();
}

export async function rtdbSet(path, value) {
  const key = normalizePath(path);
  if (!key) throw new Error('RTDB path is required');
  const res = await fetch(`${RTDB_BASE_URL}/${key}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  if (!res.ok) throw new Error(`RTDB PUT failed: ${res.status}`);
  return res.json();
}
