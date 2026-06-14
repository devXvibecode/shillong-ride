import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

const CARDS = [
  {
    id: 'normal',
    number: '01',
    title: 'Standard Ride',
    desc: 'Essential exploration. Flexible routes, local riders, and the raw beauty of Meghalaya.',
    features: ['Nodal pickup points', 'Up to 3 spots', 'Local rider guide', 'Pay after ride'],
    color: 'from-slate-800 to-slate-900',
    accent: 'bg-text-muted',
  },
  {
    id: 'premium',
    number: '02',
    title: 'Premium Journey',
    desc: 'Curated excellence with homestays, meals, medical cover, and a personal local buddy.',
    features: ['Doorstep pickup', 'Up to 4 spots', 'Homestay & meals', 'Personal guide'],
    color: 'from-primary/20 to-primary/5',
    accent: 'bg-primary',
  },
];

export default function BookingType() {
  const navigate = useNavigate();
  const { setBookingType, setGroupType } = useBooking();

  const handleSelect = (type) => {
    setBookingType(type);
    if (type === 'normal') {
      setGroupType('solo');
    }
    navigate(BOOKING_ROUTES.group);
  };

  return (
    <BookingPageLayout>
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 100, damping: 20 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(card.id)}
            className="neo-card-accent group text-left p-0 overflow-hidden"
          >
            <div className={`p-6 sm:p-8 ${card.color}`}>
              <div className={`${card.accent} text-black w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6 shadow-neo-sm`}>
                {card.number}
              </div>
              <h3 className="text-3xl sm:text-4xl font-anton text-text-primary mb-3">{card.title}</h3>
              <p className="text-text-secondary font-bold text-sm mb-6 leading-relaxed">{card.desc}</p>
            </div>
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-2.5">
              {card.features.map((f, fi) => (
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
                className="w-5 h-5 text-primary"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
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
