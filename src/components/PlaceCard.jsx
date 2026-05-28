import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import PlaceImage from './PlaceImage';

const cardRotations = [-0.5, 0.3, -0.8, 0.6, -0.3, 0.5, -0.7, 0.4, -0.6, 0.8, -0.4, 0.7];

export default function PlaceCard({ place, index }) {
  const { selectedSpots, addSpot } = useBooking();
  const isSelected = selectedSpots.includes(place.id);
  const isMaxedOut = selectedSpots.length >= 4 && !isSelected;
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => { if (!isMaxedOut) addSpot(place.id); };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
      layout
      role="button"
      tabIndex={isMaxedOut ? -1 : 0}
      aria-disabled={isMaxedOut}
      aria-pressed={isSelected}
      aria-label={isMaxedOut ? `${place.name} - maximum 4 spots selected` : `${place.name} - ${isSelected ? 'selected' : 'tap to select'}`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={{ transform: `rotate(${cardRotations[index % cardRotations.length]}deg)` }}
      className={`group transition-all duration-300 cursor-pointer rounded-xl overflow-hidden border-2 ${
        isSelected
          ? 'bg-[#16161f] border-[#f97316]'
          : isMaxedOut
          ? 'bg-[#16161f] border-[#2e2e44]/30 opacity-30 cursor-not-allowed'
          : 'bg-[#16161f] border-[#2e2e44] hover:border-[#f97316]'
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <motion.div
          className="w-full h-full overflow-hidden"
          whileHover={!isMaxedOut ? { scale: 1.05 } : {}}
          transition={{ duration: 0.5 }}
        >
          {!loaded && (
            <div className="w-full h-full skeleton" />
          )}
          <PlaceImage
            placeId={place.id}
            alt={place.name}
            className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
        </motion.div>

        <span className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-[#0b0b12]/80 border-2 border-[#2e2e44] text-white/80 text-[11px] font-['Anton'] uppercase tracking-wider rounded-lg">
          {place.category}
        </span>

        {isSelected && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-7 h-7 bg-[#f97316] border-2 border-[#c2410c] flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-[#2e2e44]">
        <h3 className="font-['Bebas_Neue'] text-white text-xl tracking-wider mb-1.5">{place.name}</h3>
        <p className="text-white/55 text-sm leading-[1.4] line-clamp-2">{place.description}</p>
      </div>
    </motion.div>
  );
}
