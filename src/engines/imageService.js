import imageManifest from '../data/images-manifest.json';

const STORAGE_KEY = 'sr_place_images';

const defaultImages = {
  umiam_lake: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  elephant_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  laitlum_canyon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  shillong_peak: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  wards_lake: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  don_bosco_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  sweet_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  beadon_falls: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  crinoline_falls: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  mawphlang_sacred_forest: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
  sohpetbneng_peak: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  mawlynnong_village: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  dawki_river: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  nohkalikai_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  seven_sisters_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  mawsmai_caves: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  mawkdok_valley: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  air_force_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  rhino_museum: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400&h=300&fit=crop',
  golf_course: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=300&fit=crop',
  cathedral_church: 'https://images.unsplash.com/photo-1516565061399-2dc8762a2adc?w=400&h=300&fit=crop',
  spread_eagle_falls: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop',
  lyngksiar_falls: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  bishop_falls: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  shillong_hati: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
  cherrapunji_viewpoint: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  mawsmai_village: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
  dawki_viewpoint: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  krem_labiit: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  krem_phyllut: 'https://images.unsplash.com/photo-1462690419189-5f4e7e1b5c9b?w=400&h=300&fit=crop',
  lakshmi_llorin_peak: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
  ramble_lake: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  umsiuh_river: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
  thangkharang_park: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
  krang_suri_falls: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
  lady_hydari_park: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
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

export function getEffectiveImage(placeId) {
  const overrides = loadFromStorage();
  if (overrides[placeId] && overrides[placeId].length > 0) {
    return overrides[placeId][0];
  }
  const manifest = getManifestImages(placeId);
  if (manifest.length > 0) {
    return manifest[0];
  }
  return defaultImages[placeId] || DEFAULT_IMG;
}

export function getAllImagesForPlace(placeId) {
  const overrides = loadFromStorage();
  if (overrides[placeId] && overrides[placeId].length > 0) {
    return overrides[placeId];
  }
  const manifest = getManifestImages(placeId);
  if (manifest.length > 0) {
    return manifest;
  }
  const single = defaultImages[placeId];
  return single ? [single] : [];
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
