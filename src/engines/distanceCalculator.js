import distanceMatrix from '../data/distance-matrix.json';
import places from '../data/places.json';

export function getDistance(fromId, toId) {
  if (fromId === toId) return 0;
  const row = distanceMatrix[fromId];
  if (row && row[toId] !== undefined) return row[toId];
  const reverseRow = distanceMatrix[toId];
  if (reverseRow && reverseRow[fromId] !== undefined) return reverseRow[fromId];
  const fromPlace = places.find(p => p.id === fromId);
  const toPlace = places.find(p => p.id === toId);
  if (fromPlace && toPlace) {
    return Math.abs(fromPlace.distanceWeight - toPlace.distanceWeight);
  }
  return 0;
}

export function getRouteDistance(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += getDistance(route[i], route[i + 1]);
  }
  return total;
}
