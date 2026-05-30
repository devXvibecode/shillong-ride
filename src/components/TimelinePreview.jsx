import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import QuestionFlow from './QuestionFlow';

const iconMap = {
  pickup: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  spot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  travel: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  food: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
  stay: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  return: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>,
};

export default function TimelinePreview() {
  const { selectedCircuit, selectedSpots, selectedHomestay, vehicleType, setStep } = useBooking();
  const { places } = useData();

  const allSpotNames = selectedSpots.map(id => places.find(p => p.id === id)?.name || id);
  const timeline = [
    { time: '8:00 AM', label: 'Pickup from your location in Shillong', icon: 'pickup' },
    ...(allSpotNames.map((name, i) => ({
      time: `${9 + i}:00 ${9 + i < 12 ? 'AM' : 'PM'}`,
      label: name,
      icon: 'spot',
    }))),
    { time: '12:00 PM', label: 'Café / Lunch stop', icon: 'food' },
  ];

  const travelHrs = Math.max(1, selectedSpots.length - 1);
  timeline.splice(2, 0, { time: `${9 + travelHrs}:00 AM`, label: `Travel between spots (est. ${travelHrs}h)`, icon: 'travel' });

  if (selectedHomestay) {
    const checkInHour = 10 + Math.min(selectedSpots.length, 4);
    timeline.push({ time: `${checkInHour > 12 ? checkInHour - 12 : checkInHour}:00 ${checkInHour >= 12 ? 'PM' : 'AM'}`, label: `Check-in at ${selectedHomestay.name}`, icon: 'stay' });
  } else {
    timeline.push({ time: '5:00 PM', label: 'Return to Shillong', icon: 'return' });
  }

  return (
    <QuestionFlow
      question="Your day, at a glance"
      subtext="A preview of how your premium experience unfolds"
      showBack
      onBack={() => setStep(6)}
    >
      <div className="max-w-lg mx-auto">
        <div className="relative pl-8 border-l-2 border-orange-500/30 space-y-0">
          {timeline.map((entry, i) => (
            <motion.div
              key={`${entry.time}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
              className="relative pb-5 last:pb-0"
            >
              <div className="absolute -left-[25px] w-10 h-10 rounded-full bg-[#16161f] border-2 border-orange-500/40 flex items-center justify-center">
                {iconMap[entry.icon]}
              </div>
              <div className="pt-0.5 pl-3">
                <p className="text-orange-400 text-[10px] font-['Anton'] uppercase tracking-wider">{entry.time}</p>
                <p className="text-white text-sm tracking-wider">{entry.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="brut-card p-4 mt-6"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/55 font-['Anton'] uppercase tracking-wider text-[10px]">Route</span>
            <span className="text-white font-['Bebas_Neue'] tracking-wider">{selectedCircuit?.shortName}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-white/55 font-['Anton'] uppercase tracking-wider text-[10px]">Spots</span>
            <span className="text-white font-['Bebas_Neue'] tracking-wider">{selectedSpots.length} destinations</span>
          </div>
          {selectedHomestay && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-white/55 font-['Anton'] uppercase tracking-wider text-[10px]">Stay</span>
              <span className="text-white font-['Bebas_Neue'] tracking-wider">{selectedHomestay.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-white/55 font-['Anton'] uppercase tracking-wider text-[10px]">Vehicle</span>
            <span className="text-white font-['Bebas_Neue'] tracking-wider">{vehicleType === 'bike' ? '2-Wheeler' : '4-Wheeler'}</span>
          </div>
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(8)}
          className="brut-btn-primary w-full mt-6 py-4 text-base tracking-widest font-['Anton'] uppercase btn-bounce cursor-pointer"
        >
          Looks Good — Continue →
        </motion.button>
      </div>
    </QuestionFlow>
  );
}
