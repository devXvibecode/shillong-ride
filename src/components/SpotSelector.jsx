import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useBooking } from '../context/BookingContext';
import PlaceCard from './PlaceCard';

export default function SpotSelector() {
  const { places } = useData();
  const { selectedCircuit, selectedSpots, removeSpot, setStep } = useBooking();

  if (!selectedCircuit) return null;

  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places.filter(p => circuitSpotIds.includes(p.id));

  if (places.length === 0) {
    return (
      <div>
        <div className="h-10" />
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em]">{selectedCircuit.shortName}</h2>
          <div className="font-['Anton'] text-lg px-4 py-2 border-2 border-orange-500/30 bg-orange-500/10 text-orange-500">0/4</div>
        </div>
        <p className="text-white/40 mb-4">Loading destinations...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="border-2 border-white/10 bg-[#1a1a1a] overflow-hidden animate-pulse">
              <div className="h-44 bg-white/5" />
              <div className="p-4">
                <div className="h-5 bg-white/10 w-2/3 mb-2" />
                <div className="h-3 bg-white/10 w-full mb-1" />
                <div className="h-3 bg-white/10 w-1/2 mb-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="h-10" />
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
        <div>
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em]">{selectedCircuit.shortName}</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-white/40 text-sm">{selectedCircuit.tagline}</p>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-3 py-1 bg-[#1a1a1a] text-orange-400 font-['Anton'] text-[10px] uppercase tracking-wider border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/60 hover:shadow-[2px_2px_0_0_rgba(230,81,0,0.3)] transition-all duration-200 whitespace-nowrap"
            >
              ← Change Route
            </button>
          </div>
        </div>
        <div className={`font-['Anton'] text-lg px-4 py-2 border-2 transition-all flex-shrink-0 ${
          selectedSpots.length === 4
            ? 'text-green-400 border-green-400/30 bg-green-400/10'
            : 'text-orange-500 border-orange-500/30 bg-orange-500/10'
        }`}>
          {selectedSpots.length}/4
        </div>
      </div>

      {selectedSpots.length >= 4 && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-green-400/80 text-sm font-medium border-l-2 border-green-400/30 pl-3"
        >
          Maximum 4 spots selected. Tap a selected place to deselect.
        </motion.p>
      )}

      {spots.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10">
          <p className="text-white/40 text-lg font-['Anton'] uppercase tracking-wider">No places in this circuit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
          {spots.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedSpots.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t-2 border-black shadow-[0_-6px_12px_rgba(0,0,0,0.5)] px-4 py-3 sm:py-4"
          >
            <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
                {selectedSpots.map(spotId => {
                  const p = places.find(x => x.id === spotId);
                  return p ? (
                    <span
                      key={spotId}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500/15 text-orange-400 border-2 border-orange-500/30 text-xs sm:text-sm font-['Anton'] uppercase tracking-wider whitespace-nowrap"
                    >
                      {p.name}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeSpot(spotId); }}
                        className="ml-1 hover:text-white transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className={`text-xs sm:text-sm font-['Anton'] tracking-wider whitespace-nowrap ${
                selectedSpots.length === 4 ? 'text-green-400' : 'text-white/50'
              }`}>
                {selectedSpots.length}/4
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="industrial-btn px-6 py-2.5 text-sm sm:text-base rounded-none tracking-widest flex-shrink-0"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
