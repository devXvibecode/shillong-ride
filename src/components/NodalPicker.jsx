import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

export default function NodalPicker() {
  const { setNodalPoint, setStep } = useBooking();
  const { hubs } = useData();

  const handleSelect = (hubId) => {
    setNodalPoint(hubId);
    setStep(5);
  };

  return (
    <div className="py-12">
      <h2 className="text-4xl sm:text-6xl font-anton mb-12 text-center">Where should we <span className="text-orange-500 text-stroke">Pick You Up?</span></h2>
      <p className="text-center font-bold text-slate-500 mb-12 uppercase tracking-widest max-w-2xl mx-auto">
        Standard packages use nodal points to keep pricing predictable and operations efficient.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {hubs?.map((hub, i) => (
          <motion.button
            key={hub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? -1 : 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(hub.id)}
            className="neo-card flex items-center gap-6 group bg-white p-8"
          >
            <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-4xl group-hover:bg-orange-500 transition-colors shrink-0">
              📍
            </div>
            <div className="text-left">
              <h3 className="font-anton text-3xl mb-1 uppercase">{hub.name}</h3>
              <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">
                {hub.description || 'Main Nodal Hub'}
              </p>
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
