import placesData from '../data/places.json';
import hubsData from '../data/hubs.json';
import distanceMatrixData from '../data/distance-matrix.json';
import circuitsData from '../data/circuits.json';

const GITHUB_BASE = import.meta.env.VITE_GITHUB_DATA_URL || 'https://raw.githubusercontent.com/devXvibecode/shillong-ride/main/data';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const API_BASE = `https://api.github.com/repos/devXvibecode/shillong-ride/contents/data`;

const cached = {};
let cacheTimestamp = 0;
const CACHE_TTL = 10_000; // 10 seconds before a re-fetch is allowed

export function clearCache() {
  Object.keys(cached).forEach(key => delete cached[key]);
  cacheTimestamp = 0;
}

async function fetchJson(name) {
  // Allow re-fetch if cache is older than TTL or forced
  if (cached[name] && Date.now() - cacheTimestamp < CACHE_TTL) return cached[name];
  try {
    let data;

    // When token is present, use GitHub API for immediate consistency
    if (GITHUB_TOKEN) {
      const cacheBuster = `?t=${Date.now()}`;
      const res = await fetch(`${API_BASE}/${name}.json${cacheBuster}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });
      if (!res.ok) throw new Error('GitHub API fetch failed');
      const apiData = await res.json();
      data = JSON.parse(atob(apiData.content));
    } else {
      // Fallback to Raw CDN with aggressive cache-busting
      const cacheBuster = `?t=${Date.now()}&_=${Math.random()}`;
      const res = await fetch(`${GITHUB_BASE}/${name}.json${cacheBuster}`);
      if (!res.ok) throw new Error('Raw CDN fetch failed');
      data = await res.json();
    }

    cached[name] = data;
    cacheTimestamp = Date.now();
    return data;
  } catch {
    throw new Error(`Failed to fetch ${name}`);
  }
}

export async function getPlaces() {
  try { return await fetchJson('places'); }
  catch { return placesData; }
}

export async function getHubs() {
  try { return await fetchJson('hubs'); }
  catch { return hubsData; }
}

export async function getDistanceMatrix() {
  try { return await fetchJson('distance-matrix'); }
  catch { return distanceMatrixData; }
}

export async function getCircuits() {
  try { return await fetchJson('circuits'); }
  catch { return circuitsData; }
}

export async function getAllData() {
  return Promise.all([getPlaces(), getHubs(), getDistanceMatrix(), getCircuits()]);
}