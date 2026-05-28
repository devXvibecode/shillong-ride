import { AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import CircuitSelector from '../components/CircuitSelector';
import SpotSelector from '../components/SpotSelector';
import JourneyBuilder from '../components/JourneyBuilder';
import Confirmation from '../components/Confirmation';

export default function Booking() {
  const { step } = useBooking();

  return (
    <div className={`pb-20 min-h-screen ${step === 2 ? '' : 'px-5'}`}>
      <div className={step === 2 ? '' : 'max-w-6xl mx-auto'}>
        {step !== 2 && (
          <div className="brut-card p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between">
              {['Route', 'Spots', 'Review', 'Done'].map((label, i) => (
                <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-['Anton'] text-xs sm:text-sm border-2 transition-all ${
                    i <= step
                      ? 'bg-[#f97316] border-[#c2410c] text-black shadow-[3px_3px_0_#c2410c]'
                      : 'bg-[#16161f] border-[#2e2e44] text-white/55'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-['Anton'] uppercase tracking-wider hidden sm:block ${
                    i <= step ? 'text-white' : 'text-white/40'
                  }`}>
                    {label}
                  </span>
                  {i < 3 && <div className="h-0.5 flex-1 bg-[#2e2e44] mx-1 sm:mx-2" />}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && <CircuitSelector key="circuit" />}
          {step === 1 && <SpotSelector key="spots" />}
          {step === 2 && <JourneyBuilder key="journey" />}
          {step === 3 && <Confirmation key="confirm" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
