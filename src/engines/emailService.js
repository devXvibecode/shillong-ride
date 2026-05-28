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
    const p = bookingData.priceBreakdown;

    const baseParams = {
      booking_id: bookingData.id,
      name: bookingData.name,
      phone: bookingData.phone,
      circuit_name: bookingData.circuitId,
      spots: (bookingData.spotNames || []).join(', '),
      status: bookingData.status,
      booking_type: bookingData.bookingType,
      total: `₹${p.total || p.groupTotal || 0}`,
      time_slot: bookingData.timeSlot || '',
    };

    let templateParams;
    if (bookingData.bookingType === 'premium') {
      templateParams = {
        ...baseParams,
        vehicle_type: bookingData.vehicleType || '',
        homestay: bookingData.homestay?.name || '',
        homestay_vibe: bookingData.homestay?.vibe || '',
        timeline: (bookingData.timeline || []).map(t => `${t.time} → ${t.label}`).join('\n'),
        group_type: bookingData.groupType || '',
        medical_emergency: 600,
        processing_fee: 600,
        rider_fee: 1800,
        fuel_cost: 1200,
        meal_plan: 800,
        curated_homestay: 4500,
        experience_premium: 3000,
      };
    } else {
      const pb = p.serviceBreakdown || {};
      const svcItems = Object.values(pb);
      templateParams = {
        ...baseParams,
        nodal_point: bookingData.nodalPoint || '',
        group_type: bookingData.groupType || '',
        service_medical: (svcItems[0] || {}).amount || 600,
        service_processing: (svcItems[1] || {}).amount || 600,
        rider_fee: p.riderFee || 0,
        fuel_cost: p.fuelCost || 0,
        distance: `${p.routeDistance || 0} KM`,
        per_person: p.perPerson ? `₹${p.perPerson}` : '',
        group_size: p.groupSize || 1,
      };
    }

    console.log('EmailJS: sending email with params:', { serviceId, templateId, templateParams });
    const result = await emailjs.send(serviceId, templateId, templateParams, { publicKey });
    console.log('EmailJS: success', result);
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return { success: false, error: error.message };
  }
}
