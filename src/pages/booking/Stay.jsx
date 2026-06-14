import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const OPTIONS = [
  {
    value: true,
    number: 'YES',
    title: 'Yes, Show Stays',
    desc: 'Unlocks the Premium Package: curated homestays, meals, 4-wheelers, and personal guides.',
    features: ['Curated homestays', 'Local meals included', '4-wheeler option', 'Personal guide'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    value: false,
    number: 'NO',
    title: 'No, Just Riding',
    desc: 'The Standard Package: affordable day exploration with nodal pickup and optimized loop routes.',
    features: ['Nodal point pickup', 'Optimized routes', 'Affordable pricing', 'Pay after ride'],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M15 6h4l2 4" /><path d="M8 17h7" /><path d="M15 14L14 8H8" /><path d="M5.5 17L3 8h2" />
      </svg>
    ),
  },
];

export default function Stay() {
  const navigate = useNavigate();
  const { setBookingType } = useBooking();

  const handleDecision = (needsStay) => {
    if (needsStay) {
      setBookingType('premium');
      navigate(BOOKING_ROUTES.vehicle);
    } else {
      setBookingType('normal');
      navigate(BOOKING_ROUTES.pickup);
    }
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.spots)}
      backLabel="Spots"
    >
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={String(opt.value)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 100, damping: 20 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDecision(opt.value)}
            className="neo-card-accent group text-left p-0 overflow-hidden"
          >
            <div className={`p-6 sm:p-8 ${opt.value ? 'bg-gradient-to-br from-primary/20 to-primary/5' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
              <div className={`w-14 h-14 flex items-center justify-center font-anton text-2xl mb-6 ${opt.value ? 'bg-primary text-black shadow-neo-sm' : 'bg-text-muted text-black shadow-neo-sm'}`}>
                {opt.number}
              </div>
              <div className="text-primary mb-4">{opt.icon}</div>
              <h3 className="text-3xl sm:text-4xl font-anton text-text-primary mb-3 uppercase">{opt.title}</h3>
              <p className="text-text-secondary text-sm font-bold leading-relaxed">{opt.desc}</p>
            </div>
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-2.5 mt-4">
              {opt.features.map((f, fi) => (
                <motion.div
                  key={fi}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + fi * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">{f}</span>
                </motion.div>
              ))}
            </div>
            <div className="border-t-3 border-border px-6 sm:px-8 py-4 flex items-center justify-between">
              <span className="font-anton text-sm text-text-muted tracking-wider">SELECT</span>
              <motion.svg
                className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <polyline points="9 18 15 12 9 6" />
              </motion.svg>
            </div>
          </motion.button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
