import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

const circuitIcons = {
  sohra: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  dawki_mawlynnong: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="m19.07 4.93-14.14 14.14" />
    </svg>
  ),
  jaintia_hills: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M4 20l3-16h10l3 16" />
      <path d="M9 20l1-8h4l1 8" />
    </svg>
  ),
  shillong_local: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 12v6" />
    </svg>
  ),
};

const spotCounts = {
  sohra: 15,
  dawki_mawlynnong: 7,
  jaintia_hills: 6,
  shillong_local: 9,
};

export default function CircuitSelector() {
  const { setSelectedCircuit, setStep } = useBooking();
  const { circuits, places } = useData();

  if (circuits.length === 0) {
    return (
      <div>
        <div className="h-12" />
        <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em] mb-2">Choose Tourist Spots</h2>
        <p className="text-white/40 mb-8">Loading circuits...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-6 border-2 border-white/10 bg-[#1a1a1a] animate-pulse">
              <div className="h-5 bg-white/10 w-2/3 mb-2" />
              <div className="h-3 bg-white/10 w-1/2 mb-2" />
              <div className="h-3 bg-white/10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-12" />
      <div className="mb-8">
        <h2 className="font-['Anton'] text-2xl sm:text-3xl text-white uppercase tracking-[0.02em] mb-1">Choose Tourist Spots</h2>
        <p className="text-white/40 text-sm">Pick a direction and explore up to 3 destinations within it.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {circuits.map((circuit, i) => (
          <motion.button
            key={circuit.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => { setSelectedCircuit(circuit); setStep(1); }}
            className="group bg-[#1a1a1a] border-2 border-white/10 hover:border-orange-500/40 grunt-border text-left transition-all duration-300 p-5 sm:p-6 shadow-[0_3px_0_0_rgba(0,0,0,0.3)]"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div
                className="w-14 h-14 flex items-center justify-center flex-shrink-0 border-2 border-black"
                style={{ backgroundColor: `${circuit.color}22`, borderColor: `${circuit.color}50` }}
              >
                <span style={{ color: circuit.color }}>{circuitIcons[circuit.id]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-['Anton'] text-white text-base sm:text-lg uppercase tracking-wider leading-tight">{circuit.shortName}</h3>
                <p className="font-['Anton'] text-white/35 text-[10px] uppercase tracking-[0.15em] mt-0.5">{circuit.tagline}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            <p className="text-white/40 text-sm leading-relaxed mb-3 line-clamp-2">{circuit.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-[#2a2a2a] text-white/60 text-[10px] font-['Anton'] uppercase tracking-wider border border-white/10">
                {circuit.spots.length} SPOTS
              </span>
              <span className="text-white/20 text-[10px] font-mono">up to 3 per tour</span>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1a1a] border-2 border-black grunt-border p-4 sm:p-5 mt-6 shadow-[0_3px_0_0_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <p className="font-['Anton'] text-white text-sm uppercase tracking-wider mb-1">How it works</p>
            <p className="text-white/40 text-xs leading-relaxed">
              Each direction covers a different region from Shillong. Pick the one
              that matches your mood. You can choose up to 3 spots to visit on the next screen.
              All tours start and end in Shillong.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
