import { getRouteDistance } from './distanceCalculator';

const FUEL_RATE = 10;
const GROUP_TYPES = {
  solo: { multiplier: 1.3, groupSize: 1, floorMin: 3500 },
  couple: { multiplier: 1.0, groupSize: 2, floorMin: 6000 },
  friends: { multiplier: 0.85, groupSize: 3, floorMin: 7500 },
  family: { multiplier: 0.75, groupSize: 4, floorMin: 8000 },
};

const RIDER_FEES = {
  shillong_local: 400,
  sohra: 500,
  jaintia_hills: 500,
  dawki_mawlynnong: 600,
};

const SERVICE_BREAKDOWN = {
  medicalEmergency: { label: 'Medical Emergency', desc: 'Emergency medical coverage during your ride', amount: 600 },
  processingFee: { label: 'Processing Fee', desc: 'Booking system, platform & operational support', amount: 600 },
};

const PREMIUM_BREAKDOWN = [
  { id: 'medicalEmergency', label: 'Medical Emergency Cover', desc: '24/7 on-call assistance, first-aid kit, hospital coordination', amount: 600 },
  { id: 'processingFee', label: 'Processing Fee', desc: 'Platform operations, booking system & support', amount: 600 },
  { id: 'riderFee', label: 'Rider Fee', desc: 'Personal local buddy/guide for your entire premium trip', amount: 1800 },
  { id: 'fuelCost', label: 'Fuel Cost', desc: 'Estimated 120km curated route at ₹10/km', amount: 1200 },
  { id: 'mealPlan', label: 'Meal Plan', desc: 'Veg & Non-Veg meals — breakfast + dinner', amount: 800 },
  { id: 'curatedHomestay', label: 'Curated Homestay', desc: 'Premium accommodation handpicked for your journey', amount: 4500 },
  { id: 'experiencePremium', label: 'Experience Premium', desc: 'Guided itinerary, flexible routing, scenic planning, emergency coordination', amount: 3000 },
];

export function calculatePrice(route, circuitId) {
  const routeDistance = getRouteDistance(route);
  const fuelCost = Math.round(routeDistance * FUEL_RATE);
  const riderFee = RIDER_FEES[circuitId] || 500;
  const serviceCost = Object.values(SERVICE_BREAKDOWN).map(s => s.amount);
  const serviceTotal = serviceCost.reduce((a, b) => a + b, 0);
  const total = fuelCost + riderFee + serviceTotal;
  return { fuelCost, riderFee, serviceTotal, serviceBreakdown: SERVICE_BREAKDOWN, total, routeDistance };
}

export function calculateNormalPrice(route, circuitId, groupType) {
  const base = calculatePrice(route, circuitId);
  const config = GROUP_TYPES[groupType];
  if (!config) return { ...base, perPerson: base.total, groupTotal: base.total, groupSize: 1, groupType: 'solo' };
  const perPersonRaw = base.total * config.multiplier;
  const groupTotalRaw = perPersonRaw * config.groupSize;
  const groupTotal = Math.max(groupTotalRaw, config.floorMin);
  const perPerson = Math.round(groupTotal / config.groupSize);
  return {
    ...base,
    perPerson,
    groupTotal,
    groupSize: config.groupSize,
    groupType,
  };
}

export function calculatePremiumPrice(vehicleType) {
  const breakdown = PREMIUM_BREAKDOWN;
  const total = breakdown.reduce((s, i) => s + i.amount, 0);
  return { breakdown, total, vehicleType };
}
