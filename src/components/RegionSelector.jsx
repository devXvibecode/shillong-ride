import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';

export default function RegionSelector() {
  const { setSelectedCircuit, setStep } = useBooking();
  const { circuits } = useData();

  const handleSelect = (circuit) => {
    setSelectedCircuit(circuit);
    setStep(3);
  };

  return (
    <div className="py-12">
      <h2 className="text-4xl sm:text-6xl font-anton mb-12 text-center">Pick Your <span className="text-orange-500">Path</span></h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {circuits?.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelect(c)}
            className="neo-card-accent p-0 overflow-hidden group text-left"
          >
            <div className="relative h-64 overflow-hidden border-b-4 border-black">
              <img 
                src={`https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=600&id=${c.id}`} 
                alt={c.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white border-2 border-black px-4 py-1 font-anton text-lg">
                {c.shortName}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-3xl font-anton mb-2">{c.name}</h3>
              <p className="font-bold text-slate-600 mb-6">{c.description || 'Explore the beauty of this region with our curated routes.'}</p>
              <div className="flex items-center justify-between">
                <span className="neo-badge-accent">Popular</span>
                <span className="font-black uppercase text-sm group-hover:text-orange-500 transition-colors">Choose Path →</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
