import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import hubs from '../data/hubs.json';
import QuestionFlow from './QuestionFlow';

const hubIcons = {
  bara_bazar: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>,
  police_bazar: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  laitumkhrah: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3" /></svg>,
  mawlai: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
};

export default function NodalPicker() {
  const { nodalPoint, setNodalPoint, setStep } = useBooking();

  const select = (id) => {
    setNodalPoint(id);
    setStep(6);
  };

  return (
    <QuestionFlow
      question="Choose your pickup point"
      subtext="We'll start and end your journey from here"
      showBack
      onBack={() => setStep(4)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {hubs.map((hub, i) => (
          <motion.button
            key={hub.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => select(hub.id)}
            className={`brut-card p-5 text-left group cursor-pointer transition-all ${
              nodalPoint === hub.id ? 'border-orange-500/50 bg-orange-500/5' : ''
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all ${
              nodalPoint === hub.id
                ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-400'
                : 'bg-[#16161f] border-2 border-[#2e2e44] text-white/50'
            }`}>
              {hubIcons[hub.id] || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /></svg>}
            </div>
            <h3 className="font-['Bebas_Neue'] text-white text-lg tracking-wider">{hub.name}</h3>
            <p className="text-white/55 text-xs mt-1 leading-relaxed">
              Central Shillong location — convenient pickup and drop-off
            </p>
          </motion.button>
        ))}
      </div>
    </QuestionFlow>
  );
}
