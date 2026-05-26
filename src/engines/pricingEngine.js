import { getRouteDistance } from './distanceCalculator';

const FUEL_RATE = 10;

const RIDER_FEES = {
  shillong_local: 400,
  sohra: 500,
  jaintia_hills: 500,
  dawki_mawlynnong: 600,
};

const PLATFORM_FEE = 1200;

export function calculatePrice(route, circuitId) {
  const routeDistance = getRouteDistance(route);

  const fuelCost = Math.round(routeDistance * FUEL_RATE);
  const riderFee = RIDER_FEES[circuitId] || 500;
  const ownerFee = PLATFORM_FEE;
  const total = fuelCost + riderFee + ownerFee;

  return { fuelCost, riderFee, ownerFee, total, routeDistance };
}
