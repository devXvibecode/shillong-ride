import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

const STEPS = [
  { id: 0, label: 'Booking Type', icon: '🎯' },
  { id: 1, label: 'Group Size', icon: '👥' },
  { id: 2, label: 'Region', icon: '🗺️' },
  { id: 3, label: 'Spots', icon: '📍' },
  { id: 4, label: 'Stay', icon: '🏠' },
  { id: 5, label: 'Details', icon: '🚗' },
  { id: 6, label: 'Timing', icon: '⏰' },
  { id: 7, label: 'Review', icon: '✓' },
  { id: 8, label: 'Confirm', icon: '🎉' },
];

export default function ProgressIndicator() {
  const { step, isPremium, setStep } = useBooking();
  const maxStep = isPremium ? 8 : 7;
  const displaySteps = STEPS.slice(0, maxStep + 1);
  const progress = ((step + 1) / (maxStep + 1)) * 100;

  return (
    <div className="sticky top-[88px] sm:top-[96px] z-40 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/80 backdrop-blur-sm border-b border-yellow-500/20 px-5 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4 h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {displaySteps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <motion.button
                key={s.id}
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all whitespace-nowrap text-xs sm:text-sm ${
                  isActive
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                    : isCompleted
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-pointer hover:bg-green-500/20'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                }`}
                whileHover={step > s.id ? { scale: 1.05 } : {}}
                whileTap={step > s.id ? { scale: 0.95 } : {}}
              >
                <span className="text-lg">{s.icon}</span>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Step Counter */}
        <div className="text-center text-xs text-slate-400 mt-2">
          Step {step + 1} of {maxStep + 1}
        </div>
      </div>
    </div>
  );
}
