import { optimizeRoute } from './routeOptimizer';
import { calculatePrice } from './pricingEngine';

export function generateBookingId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${date}-${rand}`;
}

export function createBooking({ name, phone, pickupLocation, circuitId, spotIds, timeSlot, vehicleType, notes }) {
  const route = optimizeRoute(spotIds);
  const priceBreakdown = calculatePrice(route, circuitId);

  return {
    id: generateBookingId(),
    name,
    phone,
    pickupLocation,
    circuitId,
    spots: spotIds,
    route,
    timeSlot,
    vehicleType: vehicleType || 'bike',
    notes: notes || '',
    priceBreakdown,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
