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

      <Modal open={showProceedDialog} onClose={() => setShowProceedDialog(false)}>
        <div className="text-center px-2">
          <div className="relative w-[72px] h-[72px] mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 rounded-full bg-[#0b0b12] flex items-center justify-center" style={{ margin: 2 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-['Anton'] text-2xl text-white uppercase tracking-[0.08em]">All Set!</h3>
          </div>

          <p className="text-white/80 font-['Bebas_Neue'] text-lg tracking-wider mb-1">4 Spots Selected</p>
          <p className="text-white/55 text-sm mb-7 max-w-xs mx-auto leading-relaxed text-center">
            Your route is optimized and ready. Proceed to review your itinerary and confirm your booking.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => { setShowProceedDialog(false); setStep(2); }}
              className="w-full py-3.5 font-['Anton'] text-sm uppercase tracking-[0.12em] rounded-xl brut-btn-primary"
            >
              Book Now →
            </button>
            <button
              type="button"
              onClick={() => setShowProceedDialog(false)}
              className="w-full py-3 text-sm font-['Anton'] uppercase tracking-[0.12em] rounded-xl brut-btn"
            >
              Continue Selecting
            </button>
          </div>

          <p className="text-white/25 text-[10px] font-mono mt-4 tracking-wider uppercase">
            Tap a selected spot to deselect
          </p>
        </div>
      </Modal>
    </div>
  );
}
