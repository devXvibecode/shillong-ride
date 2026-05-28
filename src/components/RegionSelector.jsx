import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import circuits from '../data/circuits.json';
import QuestionFlow from './QuestionFlow';

const circuitIcons = {
  sohra: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  dawki_mawlynnong: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20" /><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m19.07 4.93-14.14 14.14" /></svg>,
  jaintia_hills: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16" /><path d="M4 20l3-16h10l3 16" /><path d="M9 20l1-8h4l1 8" /></svg>,
  shillong_local: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="2" /><path d="M12 12v6" /></svg>,
};

export default function RegionSelector() {
  const { selectedCircuit, setSelectedCircuit, setStep, isPremium } = useBooking();
  const totalSteps = isPremium ? 9 : 7;

  const select = (circuit) => {
    setSelectedCircuit(circuit);
    setStep(3);
  };

  return (
    <QuestionFlow
      question="Where do you want to explore?"
      subtext="Each region has its own rhythm and beauty"
      step={2}
      totalSteps={totalSteps}
      showBack
      onBack={() => setStep(1)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {circuits.map((circuit, i) => (
          <motion.button
            key={circuit.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => select(circuit)}
            className={`brut-card p-5 sm:p-6 text-left group cursor-pointer transition-all ${
              selectedCircuit?.id === circuit.id ? 'border-orange-500/50' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${circuit.color}22`, color: circuit.color }}
              >
                {circuitIcons[circuit.id]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-['Bebas_Neue'] text-white text-lg tracking-wider truncate">{circuit.shortName}</h3>
                <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">{circuit.tagline}</p>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-3">{circuit.description}</p>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#16161f] border border-[#2e2e44] text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider rounded">
                {circuit.spots.length} spots
              </span>
              <span className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider">
                {isPremium ? 'Up to 4 per tour' : 'Up to 3 per tour'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </QuestionFlow>
  );
}
