import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const GROUPS = [
  { id: 'solo', label: 'Solo', icon: '👤', desc: 'Just you and the road' },
  { id: 'couple', label: 'Couple', icon: '👩‍❤️‍👨', desc: 'A journey for two' },
  { id: 'friends', label: 'Friends', icon: '🍻', desc: 'Squad goals only' },
  { id: 'family', label: 'Family', icon: '🏠', desc: 'Memories for all' },
];

export default function GroupTypeSelector() {
  const { setGroupType, setStep } = useBooking();

  const handleSelect = (id) => {
    setGroupType(id);
    setStep(2);
  };

  return (
    <div className="py-12">
      <h2 className="text-4xl sm:text-6xl font-anton mb-12 text-center">Who's <span className="text-orange-500 text-stroke">Coming?</span></h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {GROUPS.map((g) => (
          <motion.button
            key={g.id}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(g.id)}
            className="neo-card flex flex-col items-center text-center group"
          >
            <span className="text-4xl mb-4 group-hover:scale-125 transition-transform">{g.icon}</span>
            <h3 className="font-anton text-xl mb-2">{g.label}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{g.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
