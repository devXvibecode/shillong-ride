import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { BOOKING_ROUTES } from '../../context/BookingContext';
import RetroWindow from '../../components/RetroWindow';
import { IconMotorcycle } from '../../components/icons/PixelIcons';

const STEP_ORDER = [
  { route: BOOKING_ROUTES.type, label: 'Type' },
  { route: BOOKING_ROUTES.group, label: 'Group' },
  { route: BOOKING_ROUTES.circuit, label: 'Route' },
  { route: BOOKING_ROUTES.spots, label: 'Spots' },
  { route: BOOKING_ROUTES.stay, label: 'Stay' },
  { route: BOOKING_ROUTES.vehicle, label: 'Vehicle' },
  { route: BOOKING_ROUTES.homestay, label: 'Homestay' },
  { route: BOOKING_ROUTES.pickup, label: 'Pickup' },
  { route: BOOKING_ROUTES.time, label: 'Time' },
  { route: BOOKING_ROUTES.confirmNormal, label: 'Review' },
  { route: BOOKING_ROUTES.confirmPremium, label: 'Review' },
  { route: BOOKING_ROUTES.confirmed, label: 'Done' },
];

export default function BookingPageLayout({ children, title, subtitle, onBack, backLabel = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIdx = STEP_ORDER.findIndex(s => location.pathname === s.route);
  const totalSteps = 7;
  const stepNum = currentIdx >= 0 ? Math.min(currentIdx + 1, totalSteps) : 1;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="booking-page">
      <RetroWindow
        title={`Step ${stepNum} of ${totalSteps}`}
        showMenu
        titleVariant="split"
        zigzag
        onClose={() => navigate('/')}
        icon={<IconMotorcycle size={16} />}
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            {currentIdx > 0 && (
              <button onClick={handleBack} className="retro-btn retro-btn-sm" style={{ marginRight: 'auto' }}>
                « {backLabel}
              </button>
            )}
            <div className="retro-progress" style={{ marginLeft: 'auto', gap: 4 }}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`retro-progress-block ${i < stepNum - 1 ? 'filled' : ''} ${i === stepNum - 1 ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        }
      >
        {/* Step Status — brutalist counter */}
        <div className="retro-statusbar-top" style={{ borderBottom: '4px solid var(--color-black)', marginBottom: 16 }}>
          <div className="flex items-center gap-3">
            <span className="brutal-number" style={{ fontSize: 11 }}>
              {String(stepNum).padStart(2, '0')}
            </span>
            <span className="retro-badge retro-badge-navy" style={{ fontSize: 8 }}>
              OF {totalSteps}
            </span>
          </div>
          <span className="brutal-underline" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
            {currentIdx >= 0 ? STEP_ORDER[currentIdx].label : ''}
          </span>
        </div>

        {/* Title */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
          >
            <h1 className="retro-dialog-title" style={{ fontSize: 24, borderLeft: '6px solid var(--color-hotpink)', paddingLeft: 12 }}>{title}</h1>
            {subtitle && <p className="retro-dialog-subtitle" style={{ marginLeft: 18 }}>{subtitle}</p>}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.div>
      </RetroWindow>
    </div>
  );
}
