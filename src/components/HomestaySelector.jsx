import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import allHomestays from '../data/homestays.json';
import PlaceImage from './PlaceImage';
import QuestionFlow from './QuestionFlow';

const VIBES = ['All', 'Mountain View', 'Nature & Peace', 'Traditional', 'Cozy Modern', 'Budget Friendly', 'Peaceful Riverside'];

export default function HomestaySelector() {
  const { selectedCircuit, selectedHomestay, setSelectedHomestay, setStep } = useBooking();
  const [vibeFilter, setVibeFilter] = useState('All');

  const filtered = useMemo(() => {
    const circuitHomestays = allHomestays.filter(h => h.circuitId === selectedCircuit?.id);
    if (vibeFilter === 'All') return circuitHomestays;
    return circuitHomestays.filter(h => h.vibe === vibeFilter);
  }, [selectedCircuit, vibeFilter]);

  const select = (homestay) => {
    setSelectedHomestay(homestay);
    setStep(7);
  };

  return (
    <QuestionFlow
      question="What kind of stay matches your vibe?"
      subtext="All stays are curated for comfort and local character"
      showBack
      onBack={() => setStep(5)}
    >
      <div className="mb-5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {VIBES.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVibeFilter(v)}
              className={`px-4 py-2 rounded-lg border-2 font-['Anton'] text-xs uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                vibeFilter === v
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                  : 'bg-[#16161f] border-[#2e2e44] text-white/50 hover:border-white/25'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[50vh] overflow-y-auto pb-4 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filtered.map((h, i) => (
            <motion.button
              key={h.id}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => select(h)}
              className={`brut-card p-4 text-left group cursor-pointer transition-all ${
                selectedHomestay?.id === h.id ? 'border-orange-500/50 bg-orange-500/5' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[#2e2e44]">
                  <PlaceImage
                    placeId={h.id}
                    alt={h.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-['Bebas_Neue'] text-white text-base tracking-wider truncate">{h.name}</h3>
                    <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[8px] font-['Anton'] uppercase tracking-wider rounded flex-shrink-0">
                      {h.vibe}
                    </span>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed line-clamp-2 mb-2">{h.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">
                      ₹{h.priceRange.min} – ₹{h.priceRange.max}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: Math.round(h.rating) }).map((_, j) => (
                        <svg key={j} width="10" height="10" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 border-2 border-dashed border-[#2e2e44] rounded-xl">
            <p className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">No homestays found for this vibe</p>
          </div>
        )}
      </div>
    </QuestionFlow>
  );
}
