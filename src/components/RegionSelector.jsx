import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import PlaceImage from './PlaceImage';

export default function RegionSelector() {
  const { setSelectedCircuit, setStep } = useBooking();
  const { circuits } = useData();

  const handleSelect = (circuit) => {
    setSelectedCircuit(circuit);
    setStep(2);
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Where do you want to <span className="bg-yellow-500 text-black px-4 py-1 inline-block -rotate-1 shadow-neo">Explore?</span></h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {circuits?.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => handleSelect(c)}
            className="neo-card-accent p-0 overflow-hidden group text-left bg-white"
          >
            <div className="relative h-64 overflow-hidden border-b-4 border-black">
              <PlaceImage 
                placeId={c.id}
                alt={c.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white border-4 border-black px-4 py-1 font-anton text-xl rotate-[-2deg]">
                {c.shortName}
              </div>
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-4xl font-anton leading-none">{c.name}</h3>
                <span className="neo-badge">Scenic</span>
              </div>
              <p className="font-bold text-slate-600 mb-8 text-lg">
                {c.tagline || 'Experience the breathtaking landscapes and hidden gems of this region.'}
              </p>
              <div className="flex items-center justify-between border-t-4 border-black pt-6">
                <div className="flex gap-2">
                  <span className="neo-badge-accent">{c.spots?.length || 0} SPOTS</span>
                </div>
                <span className="font-black uppercase text-sm group-hover:text-yellow-500 transition-colors">
                  CHOOSE PATH →
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
