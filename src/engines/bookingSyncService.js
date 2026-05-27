const GITHUB_OWNER = 'devXvibecode';
const GITHUB_REPO = 'shillong-ride';
const GITHUB_PATH = 'data/bookings.json';
const GITHUB_BRANCH = 'main';

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_PATH}`;
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`;

let cachedSha = null;

async function getCurrentFile() {
  try {
    const res = await fetch(API_URL, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });
    if (!res.ok) {
      if (res.status === 404) return { sha: null, bookings: [] };
      throw new Error(`GitHub API error: ${res.status}`);
    }
    const data = await res.json();
    cachedSha = data.sha;
    const content = atob(data.content);
    return { sha: data.sha, bookings: JSON.parse(content) };
  } catch {
    return { sha: null, bookings: [] };
  }
}

export async function pushBooking(bookingData) {
  if (!TOKEN) {
    console.warn('VITE_GITHUB_TOKEN not set — booking saved locally only');
    return false;
  }

  try {
    const { sha, bookings } = await getCurrentFile();
    const updated = [bookingData, ...bookings];

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));

    const body = {
      message: `Booking: ${bookingData.id} — ${bookingData.name}`,
      content,
      branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;

    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`GitHub API write error: ${res.status}`);
    cachedSha = null;
    return true;
  } catch (err) {
    console.error('Failed to sync booking to GitHub:', err);
    return false;
  }
}

export async function updateSingleBooking(bookingId, updates) {
  if (!TOKEN) return false;
  try {
    const { sha, bookings } = await getCurrentFile();
    const updated = bookings.map(b => b.id === bookingId ? { ...b, ...updates } : b);
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `Update booking ${bookingId}`, content, sha, branch: GITHUB_BRANCH }),
    });
    if (!res.ok) throw new Error(`GitHub API update error: ${res.status}`);
    cachedSha = null;
    return true;
  } catch (err) {
    console.error('Failed to update booking on GitHub:', err);
    return false;
  }
}

export async function deleteBooking(bookingId) {
  if (!TOKEN) return false;
  try {
    const { sha, bookings } = await getCurrentFile();
    const updated = bookings.filter(b => b.id !== bookingId);
    if (updated.length === bookings.length) return false;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `Delete booking ${bookingId}`, content, sha, branch: GITHUB_BRANCH }),
    });
    if (!res.ok) throw new Error(`GitHub API delete error: ${res.status}`);
    cachedSha = null;
    return true;
  } catch (err) {
    console.error('Failed to delete booking from GitHub:', err);
    return false;
  }
}

export async function fetchAllBookings() {
  try {
    if (TOKEN) {
      const { bookings } = await getCurrentFile();
      return bookings;
    }
    const res = await fetch(RAW_URL);
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Fetch error: ${res.status}`);
    }
    return await res.json();
  } catch {
    return [];
  }
}
