import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconHome, IconMotorcycle } from '../../components/icons/PixelIcons';

const OPTIONS = [
  {
    value: true,
    title: 'Yes, Include Stay',
    desc: 'Unlocks the Premium Package: curated homestays, meals, 4-wheelers, and personal guides.',
    features: ['Curated homestays', 'Local meals', '4-wheeler option', 'Personal guide'],
    icon: IconHome,
  },
  {
    value: false,
    title: 'No, Just Riding',
    desc: 'Standard Package: affordable day exploration with nodal pickup and optimized routes.',
    features: ['Nodal point pickup', 'Optimized routes', 'Affordable pricing', 'Pay after ride'],
    icon: IconMotorcycle,
  },
];

export default function Stay() {
  const navigate = useNavigate();
  const { setBookingType } = useBooking();

  const handleDecision = (needsStay) => {
    if (needsStay) {
      setBookingType('premium');
      navigate(BOOKING_ROUTES.vehicle);
    } else {
      setBookingType('normal');
      navigate(BOOKING_ROUTES.pickup);
    }
  };

  return (
    <BookingPageLayout
      title="OVERNIGHT STAY?"
      subtitle="Do you need accommodation for your trip?"
      onBack={() => navigate(BOOKING_ROUTES.spots)}
      backLabel="Spots"
    >
      <div className="retro-radio-group">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={String(opt.value)}
              onClick={() => handleDecision(opt.value)}
              className="retro-radio"
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: 16 }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  border: '3px solid var(--color-black)',
                  background: opt.value ? 'var(--color-orange)' : 'var(--color-cream-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: opt.value ? 'white' : 'var(--color-ink)',
                }}>
                  <Icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase' }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-gray)', marginBottom: 6 }}>
                    {opt.desc}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {opt.features.map((f, i) => (
                      <span key={i} className="retro-badge retro-badge-outline" style={{ fontSize: 7 }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
