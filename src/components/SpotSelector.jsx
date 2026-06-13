import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import PlaceImage from './PlaceImage';

export default function SpotSelector({ maxSpots }) {
  const { selectedCircuit, selectedSpots, addSpot, setStep } = useBooking();
  const { places } = useData();

  // Filter spots based on the selected circuit's spot list
  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places?.filter(p => circuitSpotIds.includes(p.id)) || [];

  return (
    <div className="py-12 pb-40">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl sm:text-5xl font-anton">Select <span className="bg-yellow-500 text-black px-4 py-1 inline-block rotate-1 shadow-neo">Destinations</span></h2>
          <p className="font-black text-slate-400 uppercase tracking-widest mt-2">
            {selectedCircuit?.shortName} • PICK UP TO {maxSpots} SPOTS
          </p>
        </div>
        <div className="neo-card py-2 px-8 bg-black text-white font-anton text-3xl rotate-3">
          {selectedSpots.length} / {maxSpots}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map((place) => {
          const isSelected = selectedSpots.includes(place.id);
          const isDisabled = !isSelected && selectedSpots.length >= maxSpots;

          return (
            <motion.button
              key={place.id}
              whileHover={!isDisabled ? { y: -8 } : {}}
              onClick={() => !isDisabled && addSpot(place.id)}
              className={`neo-card p-0 overflow-hidden text-left group transition-all ${
                isSelected ? 'border-yellow-500 shadow-[8px_8px_0px_#000000] ring-4 ring-yellow-500' : 
                isDisabled ? 'opacity-40 cursor-not-allowed' : 'bg-white'
              }`}
            >
              <div className="relative h-56 overflow-hidden border-b-4 border-var-border">
                <PlaceImage 
                  placeId={place.id}
                  alt={place.name}
                  className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? '' : 'group-hover:scale-110'}`}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                    <div className="bg-white border-4 border-var-border px-6 py-2 rotate-12 shadow-xl">
                      <span className="text-3xl font-black text-black">SELECTED</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="neo-badge bg-white text-black text-[10px]">{place.vibe || 'Nature'}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-anton leading-tight">{place.name}</h3>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-4 line-clamp-2">
                  {place.description || 'Discover the breathtaking views and serene atmosphere of this spot.'}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 border-2 border-var-border">
                    {place.popularity || 'Popular'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {place.distance || '12km'} from hub
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Visual Journey Builder Tray */}
      <AnimatePresence>
        {selectedSpots.length > 0 && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-8 border-var-border p-4 sm:p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
              <div className="flex-1 overflow-x-auto scrollbar-hide w-full">
                <div className="flex gap-4 items-center">
                  <span className="font-anton text-2xl rotate-[-90deg] whitespace-nowrap">YOUR JOURNEY</span>
                  {selectedSpots.map((spotId, idx) => {
                    const spot = places.find(p => p.id === spotId);
                    return (
                      <div key={spotId} className="flex items-center gap-4 shrink-0">
                        <div className="neo-card p-2 flex items-center gap-3 bg-slate-50 border-2">
                          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-anton text-xl">
                            {idx + 1}
                          </div>
                          <span className="font-black text-sm uppercase pr-4">{spot?.name}</span>
                        </div>
                        {idx < selectedSpots.length - 1 && (
                          <span className="text-3xl font-black">→</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setStep(3)}
                className="neo-btn-primary text-xl sm:text-3xl px-8 sm:px-12 py-3 sm:py-4 whitespace-nowrap w-full md:w-auto shadow-[8px_8px_0px_#000000]"
              >
                CONTINUE →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
