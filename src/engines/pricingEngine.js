import { getRouteDistance } from './distanceCalculator';

const FUEL_RATE = 10;

const RIDER_FEES = {
  shillong_local: 400,
  sohra: 500,
  jaintia_hills: 500,
  dawki_mawlynnong: 600,
};

const SERVICE_TOTAL = 1200;

const SERVICE_BREAKDOWN = {
  medicalEmergency: { label: 'Medical Emergency', desc: 'Emergency medical coverage during your ride', amount: 600 },
  processingFee: { label: 'Processing Fee', desc: 'Booking system, platform & operational support', amount: 600 },
};

export function calculatePrice(route, circuitId) {
  const routeDistance = getRouteDistance(route);

  const fuelCost = Math.round(routeDistance * FUEL_RATE);
  const riderFee = RIDER_FEES[circuitId] || 500;
  const serviceCost = Object.values(SERVICE_BREAKDOWN).map(s => s.amount);
  const serviceTotal = serviceCost.reduce((a, b) => a + b, 0);
  const total = fuelCost + riderFee + serviceTotal;

  return { fuelCost, riderFee, serviceTotal, serviceBreakdown: SERVICE_BREAKDOWN, total, routeDistance };
}
