import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

export default function StayDecision() {
  const { setStep, isPremium } = useBooking();

  const handleDecision = (needsStay) => {
    if (needsStay) {
      setStep(5);
    } else {
      setStep(isPremium ? 7 : 5);
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-4xl sm:text-6xl font-anton mb-12 text-center">Need a <span className="text-orange-500 text-stroke">Place to Stay?</span></h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDecision(true)}
          className="neo-card-accent group text-left"
        >
          <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6">YES</div>
          <h3 className="text-3xl font-anton mb-4">Book a Homestay</h3>
          <p className="font-bold text-slate-600 mb-8">Authentic local stays handpicked for quality and comfort.</p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Browse Stays <span>→</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDecision(false)}
          className="neo-card group text-left"
        >
          <div className="bg-slate-200 text-black w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6">NO</div>
          <h3 className="text-3xl font-anton mb-4">I Have My Own</h3>
          <p className="font-bold text-slate-600 mb-8">Already sorted? No problem. We'll focus on the ride.</p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Skip to Details <span>→</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
