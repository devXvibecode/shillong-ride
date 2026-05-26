import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import CircuitSelector from '../components/CircuitSelector';
import SpotSelector from '../components/SpotSelector';
import Checkout from '../components/Checkout';
import Confirmation from '../components/Confirmation';

const steps = [
  { label: 'ROUTE' },
  { label: 'SPOTS' },
  { label: 'CHECKOUT' },
  { label: 'DONE' },
];

export default function Booking() {
  const { step, setStep, selectedCircuit, selectedSpots } = useBooking();
  const canGoBack = (i) => i < step && i < 2 && (i === 0 || (i === 1 && selectedCircuit));

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#1a1a1a] border-2 border-black grunt-border p-4 sm:p-5 mb-10 shadow-[0_4px_0_0_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-1 sm:gap-3">
                <button
                  onClick={() => canGoBack(i) && setStep(i)}
                  disabled={!canGoBack(i)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`diamond w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300 ${
                      i === step
                        ? 'bg-orange-500 border-2 border-black shadow-[0_0_15px_rgba(230,81,0,0.4)]'
                        : i < step
                        ? 'bg-orange-500/30 border-2 border-orange-500/50 cursor-pointer'
                        : 'bg-[#2a2a2a] border-2 border-white/10'
                    }`}
                    title={canGoBack(i) ? `Go to ${s.label}` : ''}
                  >
                    <span className="font-['Anton'] text-sm sm:text-base">
                      {i < step ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className={i === step ? 'text-black' : 'text-white/40'}>{i + 1}</span>
                      )}
                    </span>
                  </div>
                  <span className={`font-['Anton'] text-[9px] sm:text-[10px] tracking-[0.15em] ${
                    i === step ? 'text-orange-500' : 'text-white/30'
                  }`}>
                    {s.label}
                  </span>
                </button>

                {i < steps.length - 1 && (
                  <div className="flex flex-col items-center justify-center w-6 sm:w-10">
                    <div className={`w-full h-0.5 ${i < step ? 'bg-orange-500/60' : 'bg-white/10'}`} />
                    <div className={`w-1 h-1 rounded-full mt-0.5 ${i < step ? 'bg-orange-500/40' : 'bg-white/5'}`} />
                    <div className={`w-full h-0.5 mt-0.5 ${i < step ? 'bg-orange-500/60' : 'bg-white/10'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && <CircuitSelector />}
            {step === 1 && <SpotSelector />}
            {step === 2 && <Checkout />}
            {step === 3 && <Confirmation />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
