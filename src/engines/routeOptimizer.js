import { getDistance } from './distanceCalculator';

const SHILLONG = 'police_bazar';

export function optimizeRoute(spotIds) {
  if (spotIds.length === 0) return [];
  if (spotIds.length === 1) {
    return [SHILLONG, spotIds[0], SHILLONG];
  }

  const unvisited = [...spotIds];
  const route = [SHILLONG];
  let current = SHILLONG;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    unvisited.forEach((spotId, idx) => {
      const dist = getDistance(current, spotId);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = idx;
      }
    });

    current = unvisited.splice(nearestIdx, 1)[0];
    route.push(current);
  }

  route.push(SHILLONG);
  return route;
}
