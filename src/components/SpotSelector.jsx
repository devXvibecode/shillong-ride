import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { useBooking } from '../context/BookingContext';
import PlaceCard from './PlaceCard';
import Modal from './Modal';

export default function SpotSelector() {
  const { places } = useData();
  const { selectedCircuit, selectedSpots, setStep } = useBooking();
  const [showProceedDialog, setShowProceedDialog] = useState(false);

  useEffect(() => {
    if (selectedSpots.length === 4) {
      setShowProceedDialog(true);
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
          <div className="font-['Anton'] text-lg px-4 py-2 border border-orange-500/30 bg-orange-500/10 text-orange-500 rounded-lg">0/4</div>
        </div>
        <p className="text-white/55 mb-4">Loading destinations...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
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
    <div className="flex flex-col gap-6">
      <div className="h-10" />
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
        <div>
          <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em]">{selectedCircuit.shortName}</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-white/55 text-sm">{selectedCircuit.tagline}</p>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-3 py-1 glass-btn text-[10px] uppercase tracking-wider"
            >
              ← Change Route
            </button>
          </div>
        </div>
        <div className={`font-['Anton'] text-lg px-4 py-2 border transition-all flex-shrink-0 rounded-lg ${
          selectedSpots.length === 4
            ? 'text-green-400 border-green-400/30 bg-green-400/10'
            : selectedSpots.length > 0
            ? 'text-orange-500 border-orange-500/30 bg-orange-500/10'
            : 'text-white/55 border-white/10 bg-white/5'
        }`}>
          {selectedSpots.length}/4
        </div>
      </div>

      {spots.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/55 text-lg font-['Anton'] uppercase tracking-wider">No places in this circuit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {spots.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      )}

      <Modal open={showProceedDialog} onClose={() => setShowProceedDialog(false)}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-white font-['Anton'] text-xl uppercase tracking-wider mb-2">All Set!</h3>
          <p className="text-white/55 text-sm mb-1">You've selected 4 spots.</p>
          <p className="text-white/55 text-sm mb-6">Ready to proceed to checkout?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowProceedDialog(false)}
              className="flex-1 glass-btn py-3 text-sm"
            >
              Continue Selecting
            </button>
            <button
              type="button"
              onClick={() => { setShowProceedDialog(false); setStep(2); }}
              className="flex-1 glass-btn-primary py-3 text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}