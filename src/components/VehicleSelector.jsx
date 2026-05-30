import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import QuestionFlow from './QuestionFlow';

export default function VehicleSelector() {
  const { vehicleType, setVehicleType, setStep } = useBooking();

  const select = (type) => {
    setVehicleType(type);
    setStep(6);
  };

  return (
    <QuestionFlow
      question="Choose your ride"
      subtext="Both options come with a personal buddy/guide"
      showBack
      onBack={() => setStep(4)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => select('bike')}
          className={`brut-card p-6 sm:p-8 text-left group cursor-pointer transition-all ${
            vehicleType === 'bike' ? 'border-orange-500/50 bg-orange-500/5' : ''
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
            vehicleType === 'bike'
              ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-400'
              : 'bg-[#16161f] border-2 border-[#2e2e44] text-white/50'
          }`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" />
              <path d="M15 6L13 10h4" /><path d="M8 17l3-9h4" /><path d="M5.5 17l-2-4h2" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2">2-Wheeler Premium</h3>
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            Immersive, wind-in-your-hair adventure. Perfect for solo travelers and couples who want the full sensory experience of Meghalaya's landscapes.
          </p>
          <div className="space-y-1.5">
            {['Closer to nature — feel every turn', 'Easy to navigate narrow mountain roads', 'Park anywhere, stop anytime'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-white/60 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => select('car')}
          className={`brut-card p-6 sm:p-8 text-left group cursor-pointer transition-all ${
            vehicleType === 'car' ? 'border-orange-500/50 bg-orange-500/5' : ''
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
            vehicleType === 'car'
              ? 'bg-orange-500/20 border-2 border-orange-500/40 text-orange-400'
              : 'bg-[#16161f] border-2 border-[#2e2e44] text-white/50'
          }`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="9" width="22" height="10" rx="2" /><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" />
              <path d="M5 9l2-4h10l2 4" />
            </svg>
          </div>
          <h3 className="font-['Anton'] text-white text-xl sm:text-2xl uppercase tracking-wider mb-2">4-Wheeler Premium</h3>
          <p className="text-white/55 text-sm leading-relaxed mb-4">
            Scenic comfort travel. Perfect for families, groups, or anyone who wants a relaxed, insulated experience with panoramic views.
          </p>
          <div className="space-y-1.5">
            {['Climate-controlled comfort', 'Spacious seating for groups', 'Smooth ride on all road conditions'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-white/60 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </motion.button>
      </div>
    </QuestionFlow>
  );
}
