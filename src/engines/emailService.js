export async function sendBookingEmail(bookingData) {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  if (!publicKey || !serviceId || !templateId) {
    console.warn('EmailJS not configured — booking saved locally only');
    return { success: false, error: 'EmailJS not configured' };
  }

  try {
    const emailjs = await import('@emailjs/browser');
    const templateParams = {
      booking_id: bookingData.id,
      name: bookingData.name,
      phone: bookingData.phone,
      pickup_location: bookingData.pickupLocation || 'Shillong',
      circuit_name: bookingData.circuitName || bookingData.circuitId,
      spots: (bookingData.spotNames || []).join(', '),
      route: (bookingData.routeNames || []).join(' → '),
      platform_fee: `₹${bookingData.priceBreakdown.ownerFee}`,
      rider_fee: `₹${bookingData.priceBreakdown.riderFee}`,
      fuel_cost: `₹${bookingData.priceBreakdown.fuelCost}`,
      total: `₹${bookingData.priceBreakdown.total}`,
      distance: `${bookingData.priceBreakdown.routeDistance} KM`,
      time_slot: bookingData.timeSlot,
      status: bookingData.status,
    };

    console.log('EmailJS: sending email with params:', { serviceId, templateId, templateParams });
    const result = await emailjs.send(serviceId, templateId, templateParams, { publicKey });
    console.log('EmailJS: success', result);
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return { success: false, error: error.message };
  }
}
