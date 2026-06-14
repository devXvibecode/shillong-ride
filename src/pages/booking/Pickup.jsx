import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';

export default function Pickup() {
  const navigate = useNavigate();
  const { setNodalPoint } = useBooking();
  const { hubs } = useData();

  const handleSelect = (hubId) => {
    setNodalPoint(hubId);
    navigate(BOOKING_ROUTES.time);
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.stay)}
      backLabel="Overnight Stay"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
        {hubs?.map((hub, i) => (
          <motion.button
            key={hub.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 80, damping: 15 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(hub.id)}
            className="neo-card flex items-center gap-5 group p-6 sm:p-8"
          >
            <div className="w-16 h-16 rounded-xl bg-surface-lighter border-2 border-border flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-anton text-2xl text-text-primary mb-1 uppercase">{hub.name}</h3>
              <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest">
                {hub.description || 'Main Nodal Hub'}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <div className="neo-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <p className="font-anton text-xs text-primary uppercase tracking-wider mb-1">How Nodal Pickup Works</p>
              <p className="text-text-muted text-xs leading-relaxed">
                Standard packages use nodal points to keep pricing predictable and operations efficient. 
                Our riders will meet you at the selected hub to start your adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BookingPageLayout>
  );
}
