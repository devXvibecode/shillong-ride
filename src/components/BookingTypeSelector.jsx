import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import QuestionFlow from './QuestionFlow';

export default function BookingTypeSelector() {
  const { setBookingType, setStep } = useBooking();

  const select = (type) => {
    setBookingType(type);
    setStep(1);
  };

  return (
    <QuestionFlow
      question="Choose Your Experience"
      subtext="Two ways to explore Meghalaya — pick your style"
      step={0}
      totalSteps={0}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => select('normal')}
          className="brut-card p-6 sm:p-8 text-left group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-[#1565c0]/15 border-2 border-[#1565c0]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2 group-hover:text-[#1565c0] transition-colors">
            Normal Tour
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            Explore at your own pace. Up to 3 handpicked spots, nodal pickup, and a personal local guide.
          </p>
          <div className="space-y-1.5 text-left">
            {['Up to 3 destinations', 'Nodal point pickup', 'Personal local buddy', 'Optimized loop route', 'Pay after the ride'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-white/60 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t-2 border-[#2e2e44] flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">Starting from</span>
            <span className="font-['Anton'] text-orange-500 text-lg">₹3,500</span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => select('premium')}
          className="brut-card p-6 sm:p-8 text-left group cursor-pointer border-orange-500/30"
        >
          <div className="w-14 h-14 rounded-xl bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2 group-hover:text-orange-500 transition-colors">
            Tour Package
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            The complete Meghalaya experience. Homestay, meals, guide, and curated itinerary — everything included.
          </p>
          <div className="space-y-1.5 text-left">
            {['Up to 4 destinations', 'Premium homestay stay', 'Veg & Non-Veg meals', 'Personal buddy/guide', 'Pickup from anywhere in Shillong', 'Emergency support coordination'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-white/60 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t-2 border-orange-500/20 flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">Fixed price</span>
            <span className="font-['Anton'] text-orange-500 text-xl">₹12,500</span>
          </div>
        </motion.button>
      </div>
    </QuestionFlow>
  );
}
