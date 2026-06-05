/**
 * WhatsApp utility functions and template system.
 * Separated from WhatsAppDialog component to satisfy react-refresh rules.
 */

function cleanPhone(phone) {
  return String(phone).replace(/[\s+()-]/g, '');
}

/* ── Template helpers ── */

const TEMPLATES = {
  confirmation: {
    label: 'Booking Confirmation',
    emoji: '✅',
    build: (booking) => {
      const lines = [
        '*ShillongRide — Booking Confirmed!* 🎉',
        '',
        `ID: ${booking.id}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Circuit: ${booking.circuitName || booking.circuitId || '—'}`,
        `Places: ${(booking.spotNames || booking.spots || []).join(', ') || '—'}`,
        `Group: ${booking.groupType || 'Solo'}`,
        `Vehicle: ${booking.vehicleType || 'Bike'}`,
        `Pickup: ${booking.nodalPoint || booking.pickupLocation || 'Shillong'}`,
        `Time: ${booking.timeSlot || '—'}`,
        booking.homestay ? `Stay: ${booking.homestay.name}` : null,
        `Status: ${booking.status || 'Pending'}`,
        '',
        '_Thank you for choosing ShillongRide!_',
      ].filter(Boolean);
      return lines.join('\n');
    },
  },
  rider_assigned: {
    label: 'Rider Assigned',
    emoji: '🏍️',
    build: (booking) => {
      const riderName = booking.rider || 'Your rider';
      const riderPhone = booking.riderPhone || '';
      const lines = [
        '*ShillongRide — Rider Assigned!* 🎉',
        '',
        `ID: ${booking.id}`,
        `Name: ${booking.name}`,
        `Circuit: ${booking.circuitName || booking.circuitId || '—'}`,
        `Places: ${(booking.spotNames || booking.spots || []).join(', ') || '—'}`,
        `Pickup: ${booking.nodalPoint || booking.pickupLocation || 'Shillong'}`,
        `Time: ${booking.timeSlot || '—'}`,
        '',
        `*Your Rider:* ${riderName}${riderPhone ? ` (${riderPhone})` : ''}`,
        '',
        '_They will coordinate the pickup details with you._',
        '_Safe travels!_ 🏍️',
      ];
      return lines.join('\n');
    },
  },
  trip_reminder: {
    label: 'Trip Reminder',
    emoji: '⏰',
    build: (booking) => {
      const lines = [
        '*ShillongRide — Trip Reminder* ⏰',
        '',
        `Hi ${booking.name}, your adventure is coming up!`,
        '',
        `ID: ${booking.id}`,
        `Circuit: ${booking.circuitName || booking.circuitId || '—'}`,
        `Places: ${(booking.spotNames || booking.spots || []).join(', ') || '—'}`,
        `Pickup: ${booking.nodalPoint || booking.pickupLocation || 'Shillong'}`,
        `Time: ${booking.timeSlot || '—'}`,
        '',
        '*What to bring:*',
        '• Comfortable clothing & shoes',
        '• Camera 📸',
        '• Water & snacks',
        '• Raincoat/umbrella (just in case)',
        '',
        '_See you soon!_ 🏍️',
      ];
      return lines.join('\n');
    },
  },
  completion: {
    label: 'Trip Completion & Review',
    emoji: '⭐',
    build: (booking) => {
      const lines = [
        '*ShillongRide — Trip Complete!* ⭐',
        '',
        `Hi ${booking.name}, we hope you had an amazing time!`,
        '',
        `Circuit: ${booking.circuitName || booking.circuitId || '—'}`,
        `Places: ${(booking.spotNames || booking.spots || []).join(', ') || '—'}`,
        '',
        '_We would love to hear your feedback!_',
        '',
        'Please leave us a review:',
        '🔗 https://wa.me/919999999999?text=Review%3A%20',
        '',
        '_Thank you for riding with ShillongRide!_ 🏍️💨',
      ];
      return lines.join('\n');
    },
  },
};

export { TEMPLATES };

export function buildWhatsAppMessage(booking, templateId = 'confirmation') {
  const tmpl = TEMPLATES[templateId];
  if (!tmpl) return TEMPLATES.confirmation.build(booking);
  return tmpl.build(booking);
}

export function buildWhatsAppUrl(phone, message) {
  const cleaned = cleanPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/91${cleaned}?text=${encoded}`;
}

export function handleSendWhatsApp(booking, templateId = 'confirmation') {
  const phone = booking.phone || '';
  const message = buildWhatsAppMessage(booking, templateId);
  const url = buildWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}