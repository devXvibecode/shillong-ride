import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

export default function StayDecision() {
  const { setStep, setBookingType } = useBooking();

  const handleDecision = (needsStay) => {
    if (needsStay) {
      setBookingType('premium');
      setStep(4); // Move to Premium Vehicle Selection
    } else {
      setBookingType('normal');
      setStep(4); // Move to Normal Nodal Picker
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Are you planning to <span className="text-orange-500 text-stroke">Stay Overnight?</span></h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDecision(true)}
          className="neo-card-accent group text-left"
        >
          <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6 rotate-[-5deg]">YES</div>
          <h3 className="text-3xl font-anton mb-4 uppercase">Yes, Show Stays</h3>
          <p className="font-bold text-slate-600 mb-8">
            Unlocks the <span className="text-black">Premium Package</span>: includes curated homestays, meals, 4-wheelers, and personal guides.
          </p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Go Premium <span>→</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDecision(false)}
          className="neo-card group text-left"
        >
          <div className="bg-slate-200 text-black w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6 rotate-[5deg]">NO</div>
          <h3 className="text-3xl font-anton mb-4 uppercase">No, Just Riding</h3>
          <p className="font-bold text-slate-600 mb-8">
            The <span className="text-black">Standard Package</span>: affordable day exploration with nodal pickup and optimized loop routes.
          </p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Continue Standard <span>→</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
