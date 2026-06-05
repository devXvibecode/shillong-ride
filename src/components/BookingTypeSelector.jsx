import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';

export default function BookingTypeSelector() {
  const { setBookingType, setGroupType, setStep } = useBooking();

  const handleSelect = (type) => {
    setBookingType(type);
    if (type === 'normal') {
      setGroupType('solo');
      setStep(2);
    } else {
      setStep(1);
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Choose Your <span className="text-orange-500">Vibe</span></h2>
      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('normal')}
          className="neo-card-accent group text-left"
        >
          <div className="bg-black text-white w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6">01</div>
          <h3 className="text-3xl font-anton mb-4">Standard Ride</h3>
          <p className="font-bold text-slate-600 mb-8">Essential exploration. Flexible routes, local riders, and the raw beauty of Meghalaya.</p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Select Standard <span>→</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelect('premium')}
          className="neo-card group text-left border-orange-500"
        >
          <div className="bg-orange-500 text-black w-12 h-12 flex items-center justify-center font-anton text-2xl mb-6">02</div>
          <h3 className="text-3xl font-anton mb-4">Premium Journey</h3>
          <p className="font-bold text-slate-600 mb-8">Curated excellence. Includes homestays, meals, medical cover, and a personal local buddy.</p>
          <div className="flex items-center gap-2 font-black uppercase text-sm group-hover:text-orange-500 transition-colors">
            Go Premium <span>→</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
