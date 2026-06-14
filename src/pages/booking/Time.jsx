import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const SLOTS = [
  {
    id: 'morning', label: 'Early Morning', time: '07:00 AM - 09:00 AM',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    gradient: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'midmorning', label: 'Mid Morning', time: '09:00 AM - 11:00 AM',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        <path d="M8 12h8" />
      </svg>
    ),
    gradient: 'from-yellow-500/20 to-amber-500/10',
  },
  {
    id: 'noon', label: 'Afternoon', time: '12:00 PM - 02:00 PM',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <path d="M16 8l-4 4" />
      </svg>
    ),
    gradient: 'from-blue-500/20 to-sky-500/10',
  },
];

export default function Time() {
  const navigate = useNavigate();
  const { setTimeSlot, isPremium } = useBooking();

  const handleSelect = (id) => {
    setTimeSlot(id);
    if (isPremium) {
      navigate(BOOKING_ROUTES.confirmPremium);
    } else {
      navigate(BOOKING_ROUTES.confirmNormal);
    }
  };

  return (
    <BookingPageLayout
      onBack={() => {
        if (isPremium) {
          navigate(BOOKING_ROUTES.homestay);
        } else {
          navigate(BOOKING_ROUTES.pickup);
        }
      }}
      backLabel="Previous"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {SLOTS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 80, damping: 15 }}
            whileHover={{ scale: 1.05, y: -6, rotate: i % 2 === 0 ? -2 : 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(s.id)}
            className="neo-card flex flex-col items-center text-center group p-6 sm:p-8"
          >
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${s.gradient} border-2 border-border flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-black transition-all duration-300`}>
              {s.icon}
            </div>
            <h3 className="font-anton text-2xl text-text-primary mb-2 uppercase">{s.label}</h3>
            <p className="font-anton text-sm text-primary tracking-wider">{s.time}</p>
          </motion.button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
