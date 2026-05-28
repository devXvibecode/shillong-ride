import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import groupTypes from '../data/groupTypes.json';
import QuestionFlow from './QuestionFlow';

const icons = {
  solo: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
  couple: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  friends: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M10 15l3-3 3 3" /></svg>,
  family: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
};

export default function GroupTypeSelector() {
  const { groupType, setGroupType, setStep, isPremium } = useBooking();
  const totalSteps = isPremium ? 9 : 7;

  const select = (id) => {
    setGroupType(id);
    setStep(2);
  };

  return (
    <QuestionFlow
      question="Who are you traveling with?"
      subtext="This helps us personalize your experience"
      step={1}
      totalSteps={totalSteps}
      showBack
      onBack={() => setStep(0)}
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {groupTypes.map((g, i) => (
          <motion.button
            key={g.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => select(g.id)}
            className={`brut-card p-5 sm:p-6 text-left group cursor-pointer transition-all ${
              groupType === g.id ? 'border-orange-500/50 bg-orange-500/5' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
              groupType === g.id
                ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-400'
                : 'bg-[#16161f] border-2 border-[#2e2e44] text-white/50'
            }`}>
              {icons[g.id]}
            </div>
            <h3 className="font-['Bebas_Neue'] text-white text-lg sm:text-xl tracking-wider mb-1">{g.name}</h3>
            <p className="text-white/55 text-xs leading-relaxed mb-2">{g.description}</p>
            <span className="inline-block px-2 py-0.5 bg-[#16161f] border border-[#2e2e44] text-white/40 text-[9px] font-['Anton'] uppercase tracking-wider rounded">
              {g.tag}
            </span>
          </motion.button>
        ))}
      </div>
    </QuestionFlow>
  );
}
