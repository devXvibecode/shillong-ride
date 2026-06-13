import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TEMPLATES,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from '../engines/whatsAppService';

/* ── Template Selector Dialog (Admin use) ── */

export function WhatsAppTemplateSelector({ open, onClose, booking }) {
  const [selected, setSelected] = useState('confirmation');

  if (!open || !booking) return null;

  const phone = booking.phone || '';
  const handleSend = () => {
    const message = buildWhatsAppMessage(booking, selected);
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="bg-white border-4 border-var-border shadow-neo-lg max-w-lg w-full p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-['Anton'] text-black text-lg tracking-wider">
              Send WhatsApp
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-black/40 hover:text-black hover:bg-yellow-500 border-2 border-var-border transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p className="text-black/60 text-xs font-bold mb-4">Select a message template for {booking.name}:</p>

          <div className="space-y-2 mb-5">
            {Object.entries(TEMPLATES).map(([id, tmpl]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`w-full text-left p-3 border-4 border-var-border transition-all ${
                  selected === id
                    ? 'bg-yellow-500 text-black shadow-neo'
                    : 'bg-white text-black/70 hover:shadow-neo'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tmpl.emoji}</span>
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    selected === id ? 'text-black' : 'text-black/70'
                  }`}>
                    {tmpl.label}
                  </span>
                </div>
                <p className="text-black/50 text-[10px] mt-1 font-mono line-clamp-1">
                  {tmpl.build(booking).split('\n')[0].replace(/\*/g, '')}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-white border-4 border-var-border shadow-neo p-4 mb-5 max-h-40 overflow-y-auto">
            <p className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-2">Preview</p>
            <div className="text-black/70 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
              {buildWhatsAppMessage(booking, selected)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border-4 border-var-border shadow-neo flex-1 py-3 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!phone}
              className={`bg-green-500 text-white border-4 border-var-border shadow-neo flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${
                !phone ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#075e54">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send via WhatsApp
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Opt-in Dialog (public use) ── */

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="bg-white border-4 border-var-border shadow-neo-lg max-w-md w-full p-6 sm:p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* WhatsApp Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 border-4 border-var-border shadow-neo flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
          </div>

          <h3 className="font-['Anton'] text-black text-xl tracking-wider text-center mb-2">
            Get Booking Details on WhatsApp?
          </h3>

          <p className="text-black/60 text-xs text-center mb-6 leading-relaxed font-bold">
            We'll send your complete booking details — itinerary, pricing, and pickup info — directly to your WhatsApp so you have it handy.
          </p>

          <div className="bg-white border-4 border-var-border shadow-neo p-4 mb-6">
            <p className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-2">Preview</p>
            <div className="text-black/70 text-[11px] font-mono whitespace-pre-wrap leading-relaxed">
              {buildWhatsAppMessage(booking)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="bg-white border-4 border-var-border shadow-neo flex-1 py-3 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              No, Thanks
            </button>
            <button
              type="button"
              onClick={handleConsent}
              disabled={saving}
              className="bg-green-500 text-white border-4 border-var-border shadow-neo flex-1 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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