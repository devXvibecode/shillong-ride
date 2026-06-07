import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const STAYS = [
  { id: 'mountain', label: 'Mountain View Escape', icon: '⛰️', desc: 'Wake up to the clouds.' },
  { id: 'nature', label: 'Nature & Peace', icon: '🌿', desc: 'Deep in the green heart.' },
  { id: 'traditional', label: 'Traditional Homestay', icon: '🛖', desc: 'Authentic local life.' },
  { id: 'modern', label: 'Cozy Modern Stay', icon: '🏢', desc: 'Modern comfort, local vibe.' },
  { id: 'budget', label: 'Budget Friendly Stay', icon: '🎒', desc: 'Simple, clean, affordable.' },
];

export default function HomestaySelector() {
  const { setSelectedHomestay, setStep } = useBooking();

  const handleSelect = (stay) => {
    setSelectedHomestay(stay);
    setStep(6); // Move to Timeline Preview
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">What kind of stay <span className="text-yellow-500 text-stroke">Matches Your Vibe?</span></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAYS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(s)}
            className="neo-card flex flex-col items-center text-center group bg-white p-6"
          >
            <div className="w-16 h-16 bg-slate-100 border-4 border-black flex items-center justify-center text-3xl mb-4 group-hover:bg-yellow-500 transition-colors">
              {s.icon}
            </div>
            <h3 className="font-anton text-2xl mb-2 uppercase">{s.label}</h3>
            <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{s.desc}</p>
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
