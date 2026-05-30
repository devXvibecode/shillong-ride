import { getDistance } from './distanceCalculator';

const SHILLONG = 'police_bazar';

export function optimizeRoute(spotIds, startPoint) {
  const origin = startPoint || SHILLONG;

  if (spotIds.length === 0) return [];
  if (spotIds.length === 1) {
    return [origin, spotIds[0], origin];
  }

  const unvisited = [...spotIds];
  const route = [origin];
  let current = origin;

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

  route.push(origin);
  return route;
}
