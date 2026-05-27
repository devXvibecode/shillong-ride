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
        <div className="text-center px-2">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/30 to-emerald-600/20 animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-[3px] rounded-2xl bg-[#0a0a0f] flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            </div>
            <h3 className="relative inline-block font-['Anton'] text-2xl text-white uppercase tracking-[0.08em] px-4">
              All Set!
            </h3>
          </div>

          <p className="text-white/80 font-['Bebas_Neue'] text-lg tracking-wider mb-1">4 Spots Selected</p>
          <p className="text-white/55 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
            Your route is optimized and ready. Proceed to review your itinerary and confirm your booking.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => { setShowProceedDialog(false); setStep(2); }}
              className="w-full py-3.5 font-['Anton'] text-sm uppercase tracking-[0.12em] rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-black font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] hover:translate-y-[-1px] transition-all duration-200"
            >
              Proceed to Checkout →
            </button>
            <button
              type="button"
              onClick={() => setShowProceedDialog(false)}
              className="w-full py-3 text-sm font-['Anton'] uppercase tracking-[0.12em] rounded-xl glass-btn border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-200"
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