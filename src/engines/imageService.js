import imageManifest from '../data/images-manifest.json';

const STORAGE_KEY = 'sr_place_images';

const defaultImages = {
  hero: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  sohra: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
  dawki_mawlynnong: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
  jaintia_hills: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',

  /* Homestay images */
  cherrapunjee_holiday: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
  goshen_homestay: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
  iba_homestay: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  green_hills_sohra: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  umngot_river_cottage: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&h=300&fit=crop',
  by_the_river: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1125?w=400&h=300&fit=crop',
  gawooh_adventure: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop',
  iai_kyrsoi: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop',
  krangshuri_home: 'https://images.unsplash.com/photo-1596178060671-7a80dc8053e4?w=400&h=300&fit=crop',
  lks_homestay: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop',
  mandy_homestay: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  heijos_homestay: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
  shillong_heritage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  pinewood_shillong: 'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop',
  mountain_view_shillong: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
};

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAllPlaceImages() {
  return loadFromStorage();
}

function getManifestImages(placeId) {
  return imageManifest[placeId] || [];
}

const BASE = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL || '/' : '/';

function resolveImageUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith(BASE)) return url;
  if (url.startsWith('/')) return BASE.replace(/\/$/, '') + url;
  return url;
}

export function getEffectiveImage(placeId) {
  const all = getImageSourceList(placeId);
  return all.length > 0 ? all[0] : DEFAULT_IMG;
}

export function getImageSourceList(placeId) {
  const overrides = loadFromStorage();
  if (overrides[placeId] && overrides[placeId].length > 0) {
    return overrides[placeId].map(resolveImageUrl);
  }
  const manifest = getManifestImages(placeId);
  if (manifest.length > 0) {
    return manifest.map(resolveImageUrl);
  }
  const single = defaultImages[placeId];
  return single ? [resolveImageUrl(single)] : [DEFAULT_IMG];
}

export function getAllImagesForPlace(placeId) {
  const overrides = loadFromStorage();
  if (overrides[placeId] && overrides[placeId].length > 0) {
    return overrides[placeId].map(resolveImageUrl);
  }
  const manifest = getManifestImages(placeId);
  if (manifest.length > 0) {
    return manifest.map(resolveImageUrl);
  }
  const single = defaultImages[placeId];
  return single ? [resolveImageUrl(single)] : [DEFAULT_IMG];
}

export function addImageToPlace(placeId, url) {
  const data = loadFromStorage();
  if (!data[placeId]) data[placeId] = [];
  if (data[placeId].includes(url)) return false;
  data[placeId].push(url);
  saveToStorage(data);
  return true;
}

export function removeImageFromPlace(placeId, index) {
  const data = loadFromStorage();
  if (!data[placeId]) return false;
  data[placeId].splice(index, 1);
  if (data[placeId].length === 0) delete data[placeId];
  saveToStorage(data);
  return true;
}

export function setPrimaryImage(placeId, index) {
  const data = loadFromStorage();
  if (!data[placeId] || index >= data[placeId].length) return false;
  const [url] = data[placeId].splice(index, 1);
  data[placeId].unshift(url);
  saveToStorage(data);
  return true;
}

export function resetPlaceImages(placeId) {
  const data = loadFromStorage();
  delete data[placeId];
  saveToStorage(data);
}
