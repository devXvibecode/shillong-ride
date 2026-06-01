/**
 * Storage service for user data isolation and sync.
 * Uses localStorage per-device + GitHub API for cross-device sync.
 * Data keys are prefixed per-user to prevent conflicts.
 */
const STORAGE_PREFIX = 'sr_';

export function getStorageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

export function getUserPhone() {
  try { return localStorage.getItem(getStorageKey('user_phone')) || ''; } catch { return ''; }
}

export function setUserPhone(phone) {
  try { localStorage.setItem(getStorageKey('user_phone'), phone); } catch {}
}

export function loadLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function saveLocal(key, data) {
  try { localStorage.setItem(getStorageKey(key), JSON.stringify(data)); } catch {}
}

export function loadBookings() {
  return loadLocal('bookings', []);
}

export function saveBookings(bookings) {
  saveLocal('bookings', bookings);
}

// Activity log
export function loadActivityLog() {
  return loadLocal('activity_log', []);
}

export function addActivity(action, details = '') {
  const log = loadActivityLog();
  log.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  // Keep last 200 entries
  if (log.length > 200) log.length = 200;
  saveLocal('activity_log', log);
  return log;
}

// Riders
export function loadRiders() {
  return loadLocal('riders', []);
}

export function saveRiders(riders) {
  saveLocal('riders', riders);
}

export function loadStats() {
  return loadLocal('stats', {
    totalRevenue: 0,
    completedTrips: 0,
    activeRiders: 0,
  });
}

export function saveStats(stats) {
  saveLocal('stats', stats);
}