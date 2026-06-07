import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const VEHICLES = [
  { 
    id: 'bike', 
    label: '2-WHEELER PREMIUM', 
    icon: '🏍️', 
    desc: 'Designed for solo explorers & backpackers. Lightweight adventure.',
    vibe: 'Immersive Exploration'
  },
  { 
    id: 'car', 
    label: '4-WHEELER PREMIUM', 
    icon: '🚗', 
    desc: 'Designed for couples & families. Scenic comfort and relaxed travel.',
    vibe: 'Relaxed Comfort'
  },
];

export default function VehicleSelector() {
  const { setVehicleType, setStep } = useBooking();

  const handleSelect = (id) => {
    setVehicleType(id);
    setStep(5); // Move to Homestay Selection
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Select Your <span className="text-yellow-500 text-stroke">Premium Ride</span></h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {VEHICLES.map((v, i) => (
          <motion.button
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(v.id)}
            className="neo-card-accent group text-left bg-white p-6 lg:p-8"
          >
            <div className="bg-black text-white w-16 h-16 flex items-center justify-center text-4xl mb-6 group-hover:bg-yellow-500 transition-colors">
              {v.icon}
            </div>
            <h3 className="text-3xl font-anton mb-4">{v.label}</h3>
            <p className="font-bold text-slate-600 mb-8">{v.desc}</p>
            <div className="flex items-center justify-between border-t-4 border-black pt-6">
              <span className="neo-badge bg-black text-white">{v.vibe}</span>
              <span className="font-black uppercase text-sm group-hover:text-yellow-500 transition-colors">
                SELECT →
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => setStep(3)}
          className="font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
