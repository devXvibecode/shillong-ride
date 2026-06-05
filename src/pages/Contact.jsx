import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How do I book a tour?',
    a: 'Pick a direction, choose up to 4 spots, review your itinerary and pricing, then share your details. No account needed, no payment upfront — just confirm and we\'ll take it from there.',
  },
  {
    q: 'Who will I ride with?',
    a: 'Every tour pairs you with a local guide who handles the riding, navigation, and photography. They know the terrain intimately — the best angles, the quietest times, the hidden lookouts. One person, fully dedicated to your experience.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Three simple components: a flat ₹1,200 Booking Fee, a fixed Rider Cost based on your chosen route (₹400–₹600), and Fuel charged at ₹10 per km. The total distance is calculated from Shillong to your spots and back. No surge pricing, no bargaining.',
  },
  {
    q: 'Can I customize my route?',
    a: 'Absolutely. Pick any combination of up to 4 destinations within your chosen route. Our routing engine automatically maps the most efficient loop. You can change your selection freely before confirming.',
  },
  {
    q: 'When does the tour happen?',
    a: 'After confirmation, our team contacts you to coordinate the exact pickup time. This flexibility ensures your schedule fits naturally — no rigid time slots at booking.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is handled offline after your ride. We\'ll reach out to arrange it — cash and UPI are both accepted. No need to pull out your wallet mid-journey.',
  },
  {
    q: 'What if I need to cancel?',
    a: 'Reach us at least 24 hours before your scheduled pickup for a full refund. Late cancellations may incur a nominal charge. Contact us at hello@shillongride.in or +91 9591794044.',
  },
  {
    q: 'Is solo travel safe?',
    a: 'Absolutely. Our guides are trained locals who accompany you from pickup to drop-off. Vetted, reliable, and deeply familiar with the terrain. Solo travelers make up most of our community — you\'re in good company.',
  },
  {
    q: 'Can I book for a group?',
    a: 'ShillongRide is designed for one passenger per experience — a private pillion tour on a scooty or bike with your personal guide. We don\'t currently support group bookings. Each traveler books individually and is assigned their own guide.',
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f0f1a] pb-16 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg mb-3">
            <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.15em]">HELP DESK</span>
          </div>
          <h1 className="font-['Anton'] text-4xl sm:text-6xl text-white uppercase tracking-[0.02em] mb-4">Contact & FAQ</h1>
          <p className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Real questions from real travelers. We keep it straightforward.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="brut-card p-5 sm:p-6 text-center">
            <div className="text-orange-500 mb-3 flex justify-center" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </div>
            <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Email</p>
            <a href="mailto:hello@shillongride.in" className="text-white font-['Bebas_Neue'] text-base sm:text-lg tracking-wider hover:text-orange-500 transition-colors">hello@shillongride.in</a>
          </div>
          <div className="brut-card p-5 sm:p-6 text-center">
            <div className="text-orange-500 mb-3 flex justify-center" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </div>
            <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Enquiry & Emergency</p>
            <a href="tel:+919591794044" className="text-white font-['Bebas_Neue'] text-base sm:text-lg tracking-wider hover:text-orange-500 transition-colors">+91 9591794044</a>
          </div>
          <div className="brut-card p-5 sm:p-6 text-center">
            <div className="text-orange-500 mb-3 flex justify-center" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Location</p>
            <p className="text-white font-['Bebas_Neue'] text-base sm:text-lg tracking-wider">Shillong, Meghalaya</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em] mb-6">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="brut-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className="text-white font-['Bebas_Neue'] text-base sm:text-lg tracking-wider pr-4">{faq.q}</span>
                  <span className={`text-orange-500 transition-transform duration-300 flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div id={`faq-panel-${i}`} className="px-5 sm:px-6 pb-5 sm:pb-6 border-t-2 border-[#2e2e44] pt-4">
                        <p className="text-white/55 text-sm sm:text-base leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
