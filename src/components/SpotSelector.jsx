import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useBooking } from '../context/BookingContext';
import PlaceCard from './PlaceCard';

export default function SpotSelector() {
  const { places } = useData();
  const { selectedCircuit, selectedSpots, setStep } = useBooking();

  useEffect(() => {
    if (selectedSpots.length === 4) {
    }
  }, [selectedSpots.length]);

  if (!selectedCircuit) return null;

  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places.filter(p => circuitSpotIds.includes(p.id));

  if (places.length === 0) {
    return (
      <div>
        <div className="h-10" />
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em]">{selectedCircuit.shortName}</h2>
          <div className="font-['Anton'] text-lg px-4 py-2 border-2 border-orange-500/30 bg-orange-500/10 text-orange-500 rounded-lg">0/4</div>
        </div>
        <p className="text-white/55 mb-4">Loading destinations...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border-2 border-[#2e2e44] bg-[#16161f] overflow-hidden animate-pulse">
              <div className="h-44 bg-white/5" />
              <div className="p-4">
                <div className="h-5 bg-white/10 w-2/3 mb-2 rounded" />
                <div className="h-3 bg-white/10 w-full mb-1 rounded" />
                <div className="h-3 bg-white/10 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 sm:pb-6">
      <div className="h-10" />
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
        <div>
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em]">{selectedCircuit.shortName}</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-white/55 text-sm">{selectedCircuit.tagline}</p>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-3 py-1 brut-btn text-[10px] uppercase tracking-wider"
            >
              ← Change Route
            </button>
          </div>
        </div>
        <div className={`font-['Anton'] text-lg px-4 py-2 border-2 transition-all flex-shrink-0 rounded-lg ${
          selectedSpots.length === 4
            ? 'text-green-400 border-green-400/30 bg-green-400/10'
            : selectedSpots.length > 0
            ? 'text-orange-500 border-orange-500/30 bg-orange-500/10'
            : 'text-white/55 border-[#2e2e44] bg-[#16161f]'
        }`}>
          {selectedSpots.length}/4
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[#2e2e44] rounded-xl">
          <p className="text-white/55 text-lg font-['Anton'] uppercase tracking-wider">No places in this circuit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {spots.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedSpots.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 sm:static sm:z-auto"
          >
            <div className="bg-[#1e1e2b] border-t-2 border-[#f97316] p-3 sm:border-2 sm:border-[#f97316] sm:rounded-xl sm:max-w-md sm:mx-auto">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">
                    {selectedSpots.length} of 4 spots selected
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`px-6 py-3 font-['Anton'] text-sm uppercase tracking-wider transition-all btn-bounce ${
                    selectedSpots.length >= 4
                      ? 'brut-btn-primary animate-pulse'
                      : 'brut-btn-primary'
                  }`}
                >
                  Build Your Adventure →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
