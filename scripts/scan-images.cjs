#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PLACES_DIR = path.resolve(__dirname, '..', 'public', 'images', 'places');
const MANIFEST_PATH = path.resolve(__dirname, '..', 'src', 'data', 'images-manifest.json');
const PLACES_JSON = path.resolve(__dirname, '..', 'src', 'data', 'places.json');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

function getAllPlaceIds() {
  const raw = fs.readFileSync(PLACES_JSON, 'utf-8');
  const places = JSON.parse(raw);
  return places.map(p => p.id);
}

function scanImages() {
  const manifest = {};

  if (!fs.existsSync(PLACES_DIR)) {
    console.log('No images directory found. Creating empty manifest.');
    fs.mkdirSync(PLACES_DIR, { recursive: true });
  }

  const placeIds = getAllPlaceIds();

  for (const placeId of placeIds) {
    const dir = path.join(PLACES_DIR, placeId);
    const files = [];

    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir).sort();
      for (const entry of entries) {
        const ext = path.extname(entry).toLowerCase();
        if (IMAGE_EXTS.includes(ext) && !entry.startsWith('.')) {
          files.push(`/images/places/${placeId}/${entry}`);
        }
      }
    }

    if (files.length > 0) {
      manifest[placeId] = files;
    }
  }

  return manifest;
}

function createMissingDirs(placeIds) {
  let created = 0;
  for (const placeId of placeIds) {
    const dir = path.join(PLACES_DIR, placeId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      created++;
    }
  }
  return created;
}

function writeManifest(manifest) {
  const sorted = {};
  for (const key of Object.keys(manifest).sort()) {
    sorted[key] = manifest[key];
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
}

const placeIds = getAllPlaceIds();
const created = createMissingDirs(placeIds);
const manifest = scanImages();
writeManifest(manifest);

const totalImages = Object.values(manifest).reduce((sum, arr) => sum + arr.length, 0);
const placesWithImages = Object.keys(manifest).length;

console.log(` Done!`);
console.log(`   ${created} new folders created`);
console.log(`   ${placesWithImages} places with images`);
console.log(`   ${totalImages} images found`);
console.log(`   Manifest written: src/data/images-manifest.json`);
