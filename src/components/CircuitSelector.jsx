import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import circuits from '../data/circuits.json';

export default function CircuitSelector() {
  const { setSelectedCircuit, setStep, selectedSpots } = useBooking();

  return (
    <div className="flex flex-col gap-6">
      {selectedSpots.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-accent p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <p className="text-orange-400 text-xs font-semibold">
            You have {selectedSpots.length} spot{selectedSpots.length > 1 ? 's' : ''} selected — pick a route to continue booking.
          </p>
        </motion.div>
      )}

      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
        <div>
          <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-[0.2em]">Step 1 of 4</p>
          <h2 className="font-['Anton'] text-white text-3xl sm:text-4xl uppercase tracking-[0.02em] mt-1">
            Choose Your Route
          </h2>
          <p className="text-white/55 text-sm mt-1">Select the circuit that matches your adventure style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {circuits.map((circuit, i) => {
          const spotCount = circuit.spots.length;
          return (
            <motion.button
              key={circuit.id}
              type="button"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedCircuit(circuit); setStep(1); }}
              className="glass-card-accent p-5 sm:p-6 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: circuit.color }}
                />
                <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-[0.15em]">
                  {circuit.tagline}
                </span>
              </div>

              <h3 className="font-['Bebas_Neue'] text-white text-2xl sm:text-3xl tracking-wider mb-2 group-hover:text-orange-500 transition-colors">
                {circuit.shortName}
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-2">
                {circuit.description}
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-white/55 text-[11px] font-['Anton'] uppercase tracking-wider">
                  {spotCount} {spotCount === 1 ? 'Spot' : 'Spots'} Available
                </span>
                <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">
                  Up to 4 per tour
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="glass-card p-5 sm:p-6">
        <h4 className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-3">How it works</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Pick a Route', desc: 'Choose your circuit — each covers a distinct region of Meghalaya.' },
            { step: '2', title: 'Select Spots', desc: 'Tap up to 4 must-see destinations along your chosen route.' },
            { step: '3', title: 'Confirm & Ride', desc: 'Fill in your details and confirm. Pay after the ride.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-['Anton'] text-orange-500 text-sm">{item.step}</span>
              </div>
              <div>
                <p className="text-white font-['Bebas_Neue'] tracking-wider text-base">{item.title}</p>
                <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}