import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const VEHICLES = [
  {
    id: 'bike',
    label: '2-Wheeler Premium',
    desc: 'Designed for solo explorers & backpackers. Lightweight adventure through narrow mountain roads.',
    vibe: 'Immersive Exploration',
    features: ['Navigate narrow roads', 'Park anywhere', 'Feel the wind', 'Budget friendly'],
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M15 6h4l2 4" /><path d="M8 17h7" /><path d="M15 14L14 8H8" /><path d="M5.5 17L3 8h2" />
      </svg>
    ),
  },
  {
    id: 'car',
    label: '4-Wheeler Premium',
    desc: 'Designed for couples & families. Scenic comfort and relaxed travel with extra space.',
    vibe: 'Relaxed Comfort',
    features: ['Comfortable seating', 'Weather protection', 'Extra luggage space', 'Smooth ride'],
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 002 2h2" /><path d="M17 17a2 2 0 01-2 2h-2" /><circle cx="7" cy="15" r="1" /><circle cx="17" cy="15" r="1" />
      </svg>
    ),
  },
];

export default function Vehicle() {
  const navigate = useNavigate();
  const { setVehicleType } = useBooking();

  const handleSelect = (id) => {
    setVehicleType(id);
    navigate(BOOKING_ROUTES.homestay);
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.stay)}
      backLabel="Stay Decision"
    >
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {VEHICLES.map((v, i) => (
          <motion.button
            key={v.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 100, damping: 20 }}
            whileHover={{ scale: 1.02, y: -6, rotate: i === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(v.id)}
            className="neo-card-accent group text-left p-6 sm:p-8"
          >
            <div className="w-20 h-20 bg-surface-lighter border-3 border-border flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all duration-300">
              {v.icon}
            </div>
            <h3 className="text-3xl sm:text-4xl font-anton text-text-primary mb-3 uppercase">{v.label}</h3>
            <p className="text-text-secondary text-sm font-bold leading-relaxed mb-6">{v.desc}</p>

            <div className="space-y-2 mb-6">
              {v.features.map((f, fi) => (
                <div key={fi} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-text-muted font-bold text-xs uppercase tracking-wider">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t-3 border-border pt-4">
              <span className="neo-badge bg-surface-lighter text-text-primary text-[10px]">{v.vibe}</span>
              <span className="font-anton text-sm text-primary group-hover:translate-x-1 transition-transform">SELECT →</span>
            </div>
          </motion.button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
