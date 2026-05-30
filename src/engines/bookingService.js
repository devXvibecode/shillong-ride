import { optimizeRoute } from './routeOptimizer';
import { calculatePrice, calculateNormalPrice, calculatePremiumPrice } from './pricingEngine';
import places from '../data/places.json';

export function generateBookingId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${date}-${rand}`;
}

export function createBooking({ name, phone, pickupLocation, circuitId, spotIds, timeSlot, vehicleType, notes }) {
  const route = optimizeRoute(spotIds);
  const priceBreakdown = calculatePrice(route, circuitId);
  const spotNames = spotIds.map(id => places.find(p => p.id === id)?.name || id);
  const routeNames = ['Shillong City', ...spotNames, 'Shillong City'];
  return {
    id: generateBookingId(),
    bookingType: 'normal',
    name, phone, pickupLocation, circuitId, spotIds, spotNames, routeNames,
    route, timeSlot, vehicleType: vehicleType || 'bike',
    notes: notes || '', priceBreakdown,
    status: 'pending', createdAt: new Date().toISOString(),
  };
}

export function createNormalBooking({ name, phone, circuitId, spotIds, groupType, nodalPoint, timeSlot }) {
  const route = optimizeRoute(spotIds, nodalPoint || 'police_bazar');
  const priceBreakdown = calculateNormalPrice(route, circuitId, groupType);
  const spotNames = spotIds.map(id => places.find(p => p.id === id)?.name || id);
  return {
    id: generateBookingId(),
    bookingType: 'normal',
    name, phone,
    circuitId, spotIds, spotNames, route,
    groupType, nodalPoint, timeSlot,
    priceBreakdown,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function createPremiumBooking({ name, phone, circuitId, spotIds, groupType, vehicleType, homestay, timeSlot }) {
  const route = optimizeRoute(spotIds);
  const priceBreakdown = calculatePremiumPrice(vehicleType);
  const spotNames = spotIds.map(id => places.find(p => p.id === id)?.name || id);
  const routeNames = ['Shillong City', ...spotNames, 'Shillong City'];
  const timeline = generateTimeline(route, spotNames, homestay?.name);
  return {
    id: generateBookingId(),
    bookingType: 'premium',
    name, phone,
    circuitId, spotIds, spotNames, routeNames, route,
    groupType, vehicleType,
    homestay: homestay ? { id: homestay.id, name: homestay.name, vibe: homestay.vibe } : null,
    timeSlot: timeSlot || 'morning',
    timeline,
    priceBreakdown,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

function generateTimeline(route, spotNames, homestayName) {
  const entries = [];
  let hour = 8;
  entries.push({ time: `${hour}:00 AM`, label: 'Pickup from your location in Shillong', icon: 'pickup' });
  hour++;
  for (let i = 1; i < route.length - 1; i++) {
    const spotName = spotNames[i - 1] || 'Destination';
    entries.push({ time: `${hour}:00 AM`, label: spotName, icon: 'spot' });
    hour++;
    if (i === 1) { entries.push({ time: `${hour}:00 AM`, label: 'Travel between spots', icon: 'travel' }); hour++; }
  }
  if (hour < 12) hour = 12;
  entries.push({ time: `${hour}:00 PM`, label: 'Café / Lunch stop', icon: 'food' });
  hour += 2;
  if (homestayName) {
    entries.push({ time: `${hour}:00 PM`, label: `Check-in at ${homestayName}`, icon: 'stay' });
  } else {
    entries.push({ time: `${hour}:00 PM`, label: 'Return to Shillong', icon: 'return' });
  }
  return entries;
}
