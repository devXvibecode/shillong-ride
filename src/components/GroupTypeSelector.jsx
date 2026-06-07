import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const GROUPS = [
  { id: 'solo', label: 'Solo Explorer', icon: '👤', desc: 'Just you and the road' },
  { id: 'couple', label: 'Couple Escape', icon: '👩‍❤️‍👨', desc: 'A journey for two' },
  { id: 'friends', label: 'Friends Trip', icon: '🍻', desc: 'Squad goals only' },
  { id: 'family', label: 'Family Journey', icon: '🏠', desc: 'Memories for all' },
];

export default function GroupTypeSelector() {
  const { setGroupType, setStep, setBookingType } = useBooking();

  const handleSelect = (id) => {
    setGroupType(id);
    // Initialize with normal, StayDecision will pivot to premium if needed
    setBookingType('normal');
    setStep(1);
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Who are you <span className="text-yellow-500 text-stroke">Traveling With?</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GROUPS.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(g.id)}
            className="neo-card flex flex-col items-center text-center group bg-white"
          >
            <div className="w-16 h-16 bg-slate-100 border-4 border-black flex items-center justify-center text-3xl mb-4 group-hover:bg-yellow-500 transition-colors">
              {g.icon}
            </div>
            <h3 className="font-anton text-2xl mb-2">{g.label}</h3>
            <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{g.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
