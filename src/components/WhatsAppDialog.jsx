import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function cleanPhone(phone) {
  return String(phone).replace(/[\s\+\-\(\)]/g, '');
}

function buildWhatsAppMessage(booking) {
  const lines = [
    '*Booking Detail*',
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
    `_Thank you for choosing ShillongRide!_`,
  ].filter(Boolean);
  return lines.join('\n');
}

export function buildWhatsAppUrl(phone, message) {
  const cleaned = cleanPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/91${cleaned}?text=${encoded}`;
}

export function handleSendWhatsApp(booking) {
  const phone = booking.phone || '';
  const message = buildWhatsAppMessage(booking);
  const url = buildWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function WhatsAppDialog({ booking, open, onClose, onConsent, onDismiss }) {
  const [saving, setSaving] = useState(false);

  if (!open || !booking) return null;

  const phone = booking.phone || '';

  const handleConsent = async () => {
    setSaving(true);
    try {
      if (onConsent) await onConsent();
      const message = buildWhatsAppMessage(booking);
      const url = buildWhatsAppUrl(phone, message);
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = () => {
    if (onDismiss) onDismiss();
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="neo-card-dark max-w-md w-full p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* WhatsApp Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
          </div>

          <h3 className="font-['Anton'] text-white text-xl tracking-wider text-center mb-2">
            Get Booking Details on WhatsApp?
          </h3>

          <p className="text-white/60 text-xs text-center mb-6 leading-relaxed">
            We'll send your complete booking details — itinerary, pricing, and pickup info — directly to your WhatsApp so you have it handy.
          </p>

          <div className="neo-card-dark p-4 mb-6 bg-[#16161f]">
            <p className="text-white/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-2">Preview</p>
            <div className="text-white/70 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
              {buildWhatsAppMessage(booking)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="neo-btn-dark flex-1 py-3 text-xs"
            >
              No, Thanks
            </button>
            <button
              type="button"
              onClick={handleConsent}
              disabled={saving}
              className="neo-btn-primary-dark flex-1 py-3 text-xs flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#075e54">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
