import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';

export default function Spots() {
  const navigate = useNavigate();
  const { selectedCircuit, selectedSpots, addSpot } = useBooking();
  const { places } = useData();
  const [imgLoaded, setImgLoaded] = useState({});

  const maxSpots = 3;
  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places?.filter(p => circuitSpotIds.includes(p.id)) || [];

  const handleContinue = () => {
    if (selectedSpots.length > 0) {
      navigate(BOOKING_ROUTES.stay);
    }
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.circuit)}
      backLabel="Circuit"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="neo-badge bg-primary text-black text-xs">
            {selectedCircuit?.shortName || 'Circuit'}
          </div>
          <span className="text-text-muted font-anton text-xs tracking-wider uppercase">
            Pick up to {maxSpots} spots
          </span>
        </div>
        <div className="neo-card py-2 px-6 bg-primary text-black font-anton text-2xl shadow-neo-sm">
          {selectedSpots.length} / {maxSpots}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {spots.map((place, i) => {
          const isSelected = selectedSpots.includes(place.id);
          const isDisabled = !isSelected && selectedSpots.length >= maxSpots;

          return (
            <motion.button
              key={place.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 80, damping: 15 }}
              whileHover={!isDisabled ? { y: -8, scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => !isDisabled && addSpot(place.id)}
              className={`neo-card p-0 overflow-hidden text-left group transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-primary shadow-neo'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="relative h-44 overflow-hidden bg-surface-lighter">
                {!imgLoaded[place.id] && (
                  <div className="w-full h-full skeleton" />
                )}
                <img
                  src={`https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop&sig=${place.id}`}
                  alt={place.name}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded[place.id] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(prev => ({ ...prev, [place.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-primary border-2 border-black flex items-center justify-center shadow-neo-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                )}

                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="neo-badge bg-surface/90 text-[10px]">
                    {place.vibe || 'Nature'}
                  </span>
                  {place.popularity && (
                    <span className="neo-badge bg-primary/90 text-black text-[10px]">
                      {place.popularity}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-anton text-2xl text-text-primary mb-1.5">{place.name}</h3>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                  {place.description || 'Discover the breathtaking views and serene atmosphere of this spot.'}
                </p>
                {place.distance && (
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] font-anton text-text-muted uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {place.distance}km from hub
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Floating Bottom Bar */}
      <AnimatePresence>
        {selectedSpots.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t-3 border-primary p-4"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
                <span className="font-anton text-sm text-primary uppercase tracking-wider shrink-0">Your picks:</span>
                {selectedSpots.map((spotId, idx) => {
                  const spot = places.find(p => p.id === spotId);
                  return (
                    <motion.div
                      key={spotId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="neo-card py-1.5 px-3 flex items-center gap-2 shrink-0"
                    >
                      <span className="w-5 h-5 bg-primary text-black flex items-center justify-center font-anton text-[10px]">{idx + 1}</span>
                      <span className="font-anton text-xs text-text-primary">{spot?.name}</span>
                    </motion.div>
                  );
                })}
              </div>
              <button
                onClick={handleContinue}
                className="neo-btn-primary px-8 py-3 text-sm whitespace-nowrap"
              >
                CONTINUE →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom padding for fixed bar */}
      {selectedSpots.length > 0 && <div className="h-24" />}
    </BookingPageLayout>
  );
}
