import { motion } from 'framer-motion';
import PlaceImage from './PlaceImage';

export default function PlaceCardEnhanced({ place, maxSpots, isSelected, onSelect }) {
  const isDisabled = !isSelected && maxSpots > 0 ? false : !isSelected;

  return (
    <motion.button
      onClick={onSelect}
      disabled={isDisabled}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      whileHover={!isDisabled ? { y: -4 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <div className="relative h-48 sm:h-56 bg-slate-800 overflow-hidden">
        <PlaceImage place={place} />

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={!isDisabled ? { opacity: 1 } : {}}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4"
        >
          <p className="text-white text-sm font-medium">{place.description || 'Explore this spot'}</p>
          {place.distance && (
            <p className="text-yellow-300 text-xs mt-1">📍 {place.distance} km away</p>
          )}
        </motion.div>

        {/* Selected Checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}

        {/* Category Badge */}
        {place.category && (
          <div className="absolute top-3 left-3 bg-yellow-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-black">
            {place.category}
          </div>
        )}
      </div>

      {/* Card Title */}
      <div className="p-4 bg-slate-900 border border-slate-800">
        <h3 className="font-bold text-white text-sm sm:text-base truncate">{place.name}</h3>
        <p className="text-slate-400 text-xs mt-1 line-clamp-2">{place.description}</p>
      </div>
    </motion.button>
  );
}
