import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import timeSlots from '../data/timeSlots.json';
import QuestionFlow from './QuestionFlow';

const slotIcons = {
  morning: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
  afternoon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /><path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9" opacity="0.3" /></svg>,
  evening: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 17a5 5 0 0 0-10 0" /><path d="M12 2v7" /><path d="M4.22 4.22l4.24 4.24" /><path d="M19.78 4.22l-4.24 4.24" /><path d="M2 12h7" /><path d="M15 12h7" /></svg>,
};

export default function TimeSlotPicker() {
  const { timeSlot, setTimeSlot, setStep } = useBooking();

  const select = (id) => {
    setTimeSlot(id);
    setStep(7);
  };

  return (
    <QuestionFlow
      question="Pick your preferred time"
      subtext="When would you like to start your journey?"
      step={6}
      totalSteps={8}
      showBack
      onBack={() => setStep(5)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {timeSlots.map((slot, i) => (
          <motion.button
            key={slot.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => select(slot.id)}
            className={`brut-card p-5 text-left group cursor-pointer transition-all ${
              timeSlot === slot.id ? 'border-orange-500/50 bg-orange-500/5' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
              timeSlot === slot.id
                ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-400'
                : 'bg-[#16161f] border-2 border-[#2e2e44] text-white/50'
            }`}>
              {slotIcons[slot.id]}
            </div>
            <h3 className="font-['Bebas_Neue'] text-white text-lg tracking-wider">{slot.label}</h3>
            <p className="text-orange-400 text-xs font-['Anton'] uppercase tracking-wider mt-1">{slot.timeRange}</p>
            <p className="text-white/55 text-xs mt-2 leading-relaxed">{slot.description}</p>
          </motion.button>
        ))}
      </div>
    </QuestionFlow>
  );
}
