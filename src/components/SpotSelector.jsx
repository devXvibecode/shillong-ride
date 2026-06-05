import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

export default function SpotSelector({ maxSpots }) {
  const { selectedCircuit, selectedSpots, addSpot, setStep } = useBooking();
  const { places } = useData();

  const circuitSpots = places?.filter(p => p.circuitId === selectedCircuit?.id) || [];

  return (
    <div className="py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
        <h2 className="text-4xl sm:text-6xl font-anton">Select <span className="text-orange-500">Spots</span></h2>
        <div className="neo-card py-2 px-6 bg-black text-white font-anton text-xl rotate-3">
          {selectedSpots.length} / {maxSpots} SELECTED
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {circuitSpots.map((place) => {
          const isSelected = selectedSpots.includes(place.id);
          const isDisabled = !isSelected && selectedSpots.length >= maxSpots;

          return (
            <motion.button
              key={place.id}
              whileHover={!isDisabled ? { y: -8 } : {}}
              onClick={() => !isDisabled && addSpot(place.id)}
              className={`neo-card p-0 overflow-hidden text-left group ${
                isSelected ? 'border-orange-500 shadow-[4px_4px_0px_#f97316]' : isDisabled ? 'opacity-40 grayscale cursor-not-allowed' : ''
              }`}
            >
              <div className="relative h-48 overflow-hidden border-b-4 border-black">
                <img 
                  src={`https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=400&id=${place.id}`} 
                  alt={place.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                    <div className="bg-white border-4 border-black p-2 rotate-12">
                      <span className="text-2xl font-black">SELECTED</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-anton mb-1">{place.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{place.category || 'Sightseeing'}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedSpots.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <button
              onClick={() => setStep(4)}
              className="neo-btn-primary w-full text-2xl flex justify-between items-center"
            >
              <span>Continue Journey</span>
              <span>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
