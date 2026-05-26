import placesData from '../data/places.json';
import hubsData from '../data/hubs.json';
import distanceMatrixData from '../data/distance-matrix.json';
import circuitsData from '../data/circuits.json';

const GITHUB_BASE = import.meta.env.VITE_GITHUB_DATA_URL || 'https://raw.githubusercontent.com/anomalyco/shillong-ride/main/data';

const cached = {};

async function fetchJson(name) {
  if (cached[name]) return cached[name];
  try {
    const res = await fetch(`${GITHUB_BASE}/${name}.json`);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    cached[name] = data;
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
