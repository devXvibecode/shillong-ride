import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { BOOKING_ROUTES } from '../../context/BookingContext';

const STEP_ORDER = [
  { route: BOOKING_ROUTES.type, label: 'Type', short: '1' },
  { route: BOOKING_ROUTES.group, label: 'Group', short: '2' },
  { route: BOOKING_ROUTES.circuit, label: 'Route', short: '3' },
  { route: BOOKING_ROUTES.spots, label: 'Spots', short: '4' },
  { route: BOOKING_ROUTES.stay, label: 'Stay', short: '5' },
  { route: BOOKING_ROUTES.time, label: 'Time', short: '6' },
  { route: BOOKING_ROUTES.confirmNormal, label: 'Review', short: '7' },
  { route: BOOKING_ROUTES.confirmPremium, label: 'Review', short: '7' },
  { route: BOOKING_ROUTES.confirmed, label: 'Done', short: '✓' },
];

export default function BookingPageLayout({ children, title, subtitle, onBack, backLabel = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIdx = STEP_ORDER.findIndex(s => location.pathname === s.route);
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / 7) * 100 : 0;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="booking-page">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors min-h-[44px] min-w-[44px]"
            aria-label={backLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="font-anton text-xs uppercase tracking-wider hidden sm:inline">{backLabel}</span>
          </button>
          {currentIdx >= 0 && (
            <span className="text-text-muted font-anton text-xs tracking-wider">
              STEP {currentIdx + 1}/7
            </span>
          )}
          <div className="w-[44px]" />
        </div>

        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="h-1.5 bg-surface-lighter rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {STEP_ORDER.slice(0, 7).map((s, i) => (
              <div
                key={s.route}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-anton transition-all duration-300 ${
                  i <= currentIdx
                    ? 'bg-primary text-black'
                    : 'bg-surface-lighter text-text-muted'
                }`}
              >
                {i === currentIdx && (
                  <motion.div
                    className="absolute w-6 h-6 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {s.short}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content with Slide Animation */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto px-4 py-6 sm:py-10 booking-scroll"
      >
        {title && (
          <div className="text-center mb-8 sm:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-anton text-text-primary uppercase tracking-tight"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-text-secondary text-sm sm:text-base mt-3 max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
}
