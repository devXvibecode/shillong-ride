#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PLACES_DIR = path.resolve(__dirname, '..', 'public', 'images', 'places');
const MANIFEST_PATH = path.resolve(__dirname, '..', 'src', 'data', 'images-manifest.json');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'];

function scanImages() {
  const manifest = {};

  if (!fs.existsSync(PLACES_DIR)) {
    console.log('No images directory found.');
    return manifest;
  }

  const circuitDirs = fs.readdirSync(PLACES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name)
    .sort();

  if (circuitDirs.length === 0) {
    console.log('No circuit folders found in public/images/places/');
    return manifest;
  }

  for (const circuitName of circuitDirs) {
    const circuitDir = path.join(PLACES_DIR, circuitName);
    const entries = fs.readdirSync(circuitDir).sort();

    for (const entry of entries) {
      const ext = path.extname(entry).toLowerCase();
      if (!IMAGE_EXTS.includes(ext)) continue;

      const spotId = path.basename(entry, ext);
      const imagePath = `/images/places/${circuitName}/${entry}`;

      if (!manifest[spotId]) manifest[spotId] = [];
      manifest[spotId].push(imagePath);
    }
  }

  return manifest;
}

function writeManifest(manifest) {
  const sorted = {};
  for (const key of Object.keys(manifest).sort()) {
    sorted[key] = manifest[key];
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
}

const manifest = scanImages();
writeManifest(manifest);

const totalImages = Object.values(manifest).reduce((sum, arr) => sum + arr.length, 0);
const placesWithImages = Object.keys(manifest).length;

console.log(` Done!`);
console.log(`   ${totalImages} images found for ${placesWithImages} spots`);
console.log(`   Manifest written: src/data/images-manifest.json`);
