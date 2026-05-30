import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import QuestionFlow from './QuestionFlow';

export default function StayDecision() {
  const { setStep, isPremium } = useBooking();

  const handleNo = () => setStep(5);
  const handleYes = () => setStep(5);

  return (
    <QuestionFlow
      question="Are you planning to stay overnight?"
      subtext="This decides whether we arrange a homestay for you"
      showBack
      onBack={() => setStep(3)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNo}
          className="brut-card p-6 sm:p-8 text-left group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-[#16161f] border-2 border-[#2e2e44] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2 group-hover:text-green-400 transition-colors">
            No, Just Riding
          </h3>
          <p className="text-white/55 text-sm leading-relaxed">
            A day trip with nodal pickup and return. Simple, affordable, and covers all the must-see spots.
          </p>
          <div className="mt-4 pt-3 border-t border-[#2e2e44]">
            <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">Starting ₹3,500</span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleYes}
          className="brut-card p-6 sm:p-8 text-left group cursor-pointer border-orange-500/30"
        >
          <div className="w-14 h-14 rounded-xl bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2 group-hover:text-orange-500 transition-colors">
            Yes, I Want Stays
          </h3>
          <p className="text-white/55 text-sm leading-relaxed">
            A full premium experience with homestay, meals, and a curated itinerary. Everything included.
          </p>
          <div className="mt-4 pt-3 border-t border-orange-500/20">
            <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">Fixed price</span>
            <span className="font-['Anton'] text-orange-500 text-lg ml-3">₹12,500</span>
          </div>
        </motion.button>
      </div>
    </QuestionFlow>
  );
}
