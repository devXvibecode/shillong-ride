import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

export default function TimelinePreview() {
  const { selectedSpots, setStep, vehicleType, selectedHomestay } = useBooking();
  const { places } = useData();

  const spots = selectedSpots.map(id => places.find(p => p.id === id)).filter(Boolean);

  const timeline = [
    { time: '08:00 AM', label: 'VIP PICKUP', desc: 'Direct pickup from your location in Shillong' },
    ...spots.map((s, i) => ({
      time: `${9 + i * 2}:00 AM`,
      label: s.name.toUpperCase(),
      desc: s.description || 'Guided exploration with your personal buddy'
    })),
    { time: '01:00 PM', label: 'LOCAL CUISINE', desc: 'Curated lunch at a handpicked local spot' },
    { time: '05:00 PM', label: 'CHECK-IN', desc: `Arrive at your ${selectedHomestay?.label || 'Premium Stay'}` },
  ];

  return (
    <div className="py-12">
      <h2 className="text-4xl sm:text-6xl font-anton mb-12 text-center">Your <span className="text-orange-500">Premium Itinerary</span></h2>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {timeline.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="neo-card flex items-center gap-8 bg-white group hover:bg-slate-50"
          >
            <div className="font-anton text-2xl text-orange-500 shrink-0 border-r-4 border-black pr-6 py-2">
              {item.time}
            </div>
            <div>
              <h3 className="font-anton text-2xl mb-1">{item.label}</h3>
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center space-y-8">
        <button
          onClick={() => setStep(7)}
          className="neo-btn-primary text-3xl px-12 py-6 shadow-[8px_8px_0px_#000000]"
        >
          LOOKS PERFECT →
        </button>
        <br />
        <button 
          onClick={() => setStep(5)}
          className="font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          ← Change Stay
        </button>
      </div>
    </div>
  );
}
