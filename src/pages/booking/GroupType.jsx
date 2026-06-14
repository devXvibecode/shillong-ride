import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const GROUPS = [
  {
    id: 'solo', label: 'Solo Explorer',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    desc: 'Just you and the road',
  },
  {
    id: 'couple', label: 'Couple Escape',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    desc: 'A journey for two',
  },
  {
    id: 'friends', label: 'Friends Trip',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
        <path d="M21 12.28V21" /><path d="M17 14.5V21" />
      </svg>
    ),
    desc: 'Squad goals only',
  },
  {
    id: 'family', label: 'Family Journey',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21s-4-3-4-9 4-9 4-9" /><path d="M16 3s4 3 4 9-4 9-4 9" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    desc: 'Memories for all',
  },
];

export default function GroupType() {
  const navigate = useNavigate();
  const { setGroupType, setBookingType } = useBooking();

  const handleSelect = (id) => {
    setGroupType(id);
    setBookingType('normal');
    navigate(BOOKING_ROUTES.circuit);
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.type)}
      backLabel="Booking Type"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {GROUPS.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 80, damping: 15 }}
            whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(g.id)}
            className="neo-card flex flex-col items-center text-center group p-6 sm:p-8"
          >
            <div className="w-20 h-20 rounded-xl bg-surface-lighter border-2 border-border flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-black transition-all duration-300">
              {g.icon}
            </div>
            <h3 className="font-anton text-2xl text-text-primary mb-2 uppercase">{g.label}</h3>
            <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest">{g.desc}</p>
          </motion.button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
