import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';

function getSteps(bookingType, groupType) {
  if (bookingType === 'normal') {
    return [
      { route: '/booking', label: 'Package' },
      { route: BOOKING_ROUTES.group, label: 'Group' },
      { route: BOOKING_ROUTES.circuit, label: 'Route' },
      { route: BOOKING_ROUTES.spots, label: 'Spots' },
      { route: BOOKING_ROUTES.pickup, label: 'Pickup' },
      { route: BOOKING_ROUTES.time, label: 'Time' },
      { route: BOOKING_ROUTES.confirmNormal, label: 'Review' },
    ];
  }
  return [
    { route: '/booking', label: 'Package' },
    { route: BOOKING_ROUTES.group, label: 'Group' },
    { route: BOOKING_ROUTES.circuit, label: 'Route' },
    { route: BOOKING_ROUTES.spots, label: 'Spots' },
    { route: BOOKING_ROUTES.vehicle, label: 'Vehicle' },
    { route: BOOKING_ROUTES.homestay, label: 'Homestay' },
    { route: BOOKING_ROUTES.time, label: 'Time' },
    { route: BOOKING_ROUTES.confirmPremium, label: 'Review' },
  ];
}

export default function BookingPageLayout({ children, title, subtitle, onBack, backLabel = 'Back' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPremium, groupType } = useBooking();

  const bookingType = isPremium ? 'premium' : 'normal';
  const steps = getSteps(bookingType, groupType);
  const totalSteps = steps.length;
  const currentIdx = steps.findIndex(s => location.pathname === s.route);
  const stepNum = currentIdx >= 0 ? currentIdx + 1 : 1;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="booking-page">
      {/* Progress bar */}
      <div className="booking-progress">
        <div className="booking-progress-inner">
          {steps.map((step, i) => {
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <span key={step.route} style={{ display: 'contents' }}>
                {i > 0 && <span className={`progress-line glass ${isDone ? 'done' : ''}`} />}
                <span
                  className={`progress-dot glass ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  onClick={() => { if (isDone) navigate(step.route); }}
                  style={{ cursor: isDone ? 'pointer' : 'default', position: 'relative' }}
                  title={step.label}
                >
                  {isDone ? '✓' : i + 1}
                  <span style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    fontSize: 7, fontWeight: 700, textTransform: 'uppercase',
                    color: isActive ? 'var(--color-hotpink)' : 'var(--color-gray)',
                    marginTop: 4, whiteSpace: 'nowrap',
                  }}>
                    {step.label}
                  </span>
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
            {currentIdx >= 0 ? steps[currentIdx].label : ''}
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
