import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const SLOTS = [
  { id: 'morning', label: 'Early Morning', time: '07:00 AM - 09:00 AM', icon: '🌅' },
  { id: 'midmorning', label: 'Mid Morning', time: '09:00 AM - 11:00 AM', icon: '☀️' },
  { id: 'noon', label: 'Afternoon', time: '12:00 PM - 02:00 PM', icon: '🌤️' },
];

export default function TimeSlotPicker() {
  const { setTimeSlot, setStep } = useBooking();

  const handleSelect = (id) => {
    setTimeSlot(id);
    setStep(6); // Move to Normal Review
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">When should we <span className="text-yellow-500 text-stroke">Start?</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {SLOTS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -2 : 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(s.id)}
            className="neo-card flex flex-col items-center text-center group bg-white p-6"
          >
            <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">{s.icon}</div>
            <h3 className="font-anton text-2xl mb-2 uppercase">{s.label}</h3>
            <p className="font-black text-yellow-500 text-sm tracking-widest">{s.time}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => setStep(4)}
          className="font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
