import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';

export default function Circuit() {
  const navigate = useNavigate();
  const { setSelectedCircuit } = useBooking();
  const { circuits } = useData();

  const handleSelect = (circuit) => {
    setSelectedCircuit(circuit);
    navigate(BOOKING_ROUTES.spots);
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.group)}
      backLabel="Group Size"
    >
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        {circuits?.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 90, damping: 18 }}
            whileHover={{ scale: 1.02, y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(c)}
            className="neo-card-accent p-0 overflow-hidden group text-left"
          >
            {/* Hero Image Area */}
            <div className={`relative h-52 sm:h-64 overflow-hidden border-b-3 border-border bg-gradient-to-br ${i === 0 ? 'from-emerald-900 to-emerald-800' : i === 1 ? 'from-blue-900 to-blue-800' : i === 2 ? 'from-purple-900 to-purple-800' : 'from-amber-900 to-amber-800'}`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
              </div>
              <div className="absolute top-4 left-4 bg-surface border-2 border-border px-4 py-1 font-anton text-xl shadow-neo-sm">
                <span style={{ color: c.color }}>●</span> {c.shortName}
              </div>
              <div className="absolute bottom-4 right-4 neo-badge text-xs">
                {c.spots?.length || 0} SPOTS
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-3xl sm:text-4xl font-anton text-text-primary leading-none mb-3">{c.name}</h3>
              <p className="text-text-secondary text-sm font-bold leading-relaxed mb-5">
                {c.tagline || 'Experience the breathtaking landscapes and hidden gems of this region.'}
              </p>

              {/* Spot preview chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {c.spots?.slice(0, 4).map((spotId, si) => (
                  <span key={spotId} className="px-3 py-1 bg-surface-lighter border border-border rounded-lg text-[10px] font-anton text-text-muted uppercase tracking-wider">
                    {spotId.replace(/_/g, ' ')}
                  </span>
                ))}
                {(c.spots?.length || 0) > 4 && (
                  <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg text-[10px] font-anton text-primary uppercase tracking-wider">
                    +{c.spots.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t-3 border-border pt-4">
                <span className="text-text-muted text-[10px] font-anton uppercase tracking-wider">
                  Up to {c.id === 'premium' ? 4 : 3} per tour
                </span>
                <span className="font-anton text-sm text-primary group-hover:translate-x-1 transition-transform">
                  SELECT PATH →
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {(!circuits || circuits.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="neo-card p-8 text-center"
        >
          <p className="text-text-muted font-anton text-xl">Loading circuits...</p>
        </motion.div>
      )}
    </BookingPageLayout>
  );
}
