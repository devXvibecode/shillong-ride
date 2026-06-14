import { useNavigate, useLocation } from 'react-router-dom';
import { BOOKING_ROUTES } from '../../context/BookingContext';

const STEP_ORDER = [
  { route: BOOKING_ROUTES.type, label: 'Type' },
  { route: BOOKING_ROUTES.group, label: 'Group' },
  { route: BOOKING_ROUTES.circuit, label: 'Route' },
  { route: BOOKING_ROUTES.spots, label: 'Spots' },
  { route: BOOKING_ROUTES.stay, label: 'Stay' },
  { route: BOOKING_ROUTES.vehicle, label: 'Vehicle' },
  { route: BOOKING_ROUTES.homestay, label: 'Home' },
  { route: BOOKING_ROUTES.pickup, label: 'Pickup' },
  { route: BOOKING_ROUTES.time, label: 'Time' },
  { route: BOOKING_ROUTES.confirmNormal, label: 'Review' },
  { route: BOOKING_ROUTES.confirmPremium, label: 'Review' },
  { route: BOOKING_ROUTES.confirmed, label: 'Done' },
];

function getStepIndex(pathname) {
  return STEP_ORDER.findIndex(s => pathname === s.route);
}

export default function BookingPageLayout({ children, title, subtitle, onBack, backLabel = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIdx = getStepIndex(location.pathname);
  const totalSteps = 7;
  const stepNum = currentIdx >= 0 ? Math.min(currentIdx + 1, totalSteps) : 1;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="booking-page">
      {/* Progress bar */}
      <div className="booking-progress">
        <div className="booking-progress-inner">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isDone = i < stepNum - 1;
            const isActive = i === stepNum - 1;
            return (
              <span key={i} style={{ display: 'contents' }}>
                {i > 0 && <span className={`progress-line ${isDone ? 'done' : ''}`} />}
                <span className={`progress-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {isDone ? '✓' : i + 1}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="booking-content">
        {/* Step label */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <div>
            <h1 className="retro-dialog-title" style={{ fontSize: 24, borderLeft: '6px solid var(--color-hotpink)', paddingLeft: 12 }}>
              {title}
            </h1>
            {subtitle && <p className="retro-dialog-subtitle" style={{ marginLeft: 18 }}>{subtitle}</p>}
          </div>
        )}

        {/* Children */}
        {children}
      </div>

      {/* Bottom bar */}
      <div className="booking-bottom">
        <div className="booking-bottom-inner">
          {currentIdx > 0 && (
            <button onClick={handleBack} className="retro-btn retro-btn-sm">
              « {backLabel}
            </button>
          )}
          <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--color-gray)' }}>
            Step {stepNum} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
}
