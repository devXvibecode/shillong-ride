import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const STAYS = [
  {
    id: 'mountain', label: 'Mountain View Escape', desc: 'Wake up to the clouds.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
  },
  {
    id: 'nature', label: 'Nature & Peace', desc: 'Deep in the green heart.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: 'traditional', label: 'Traditional Homestay', desc: 'Authentic local life.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'modern', label: 'Cozy Modern Stay', desc: 'Modern comfort, local vibe.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="22" x2="9" y2="2" /><line x1="15" y1="22" x2="15" y2="2" />
      </svg>
    ),
  },
  {
    id: 'budget', label: 'Budget Friendly Stay', desc: 'Simple, clean, affordable.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

export default function Homestay() {
  const navigate = useNavigate();
  const { setSelectedHomestay } = useBooking();

  const handleSelect = (stay) => {
    setSelectedHomestay(stay);
    navigate(BOOKING_ROUTES.time);
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.vehicle)}
      backLabel="Vehicle"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {STAYS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 80, damping: 15 }}
            whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(s)}
            className="neo-card flex flex-col items-center text-center group p-6 sm:p-8"
          >
            <div className="w-20 h-20 rounded-xl bg-surface-lighter border-2 border-border flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-black transition-all duration-300">
              {s.icon}
            </div>
            <h3 className="font-anton text-xl sm:text-2xl text-text-primary mb-2 uppercase">{s.label}</h3>
            <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest">{s.desc}</p>
          </motion.button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
