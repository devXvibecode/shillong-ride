import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMotorcycle } from '../../components/icons/PixelIcons';

const VEHICLES = [
  {
    id: 'bike',
    label: '2-Wheeler',
    desc: 'Designed for solo explorers & backpackers. Lightweight adventure through narrow mountain roads.',
    features: ['Navigate narrow roads', 'Park anywhere', 'Feel the wind', 'Budget friendly'],
  },
  {
    id: 'car',
    label: '4-Wheeler',
    desc: 'Designed for couples & families. Scenic comfort and relaxed travel with extra space.',
    features: ['Comfortable seating', 'Weather protection', 'Extra luggage space', 'Smooth ride'],
  },
];

export default function Vehicle() {
  const navigate = useNavigate();
  const { setVehicleType, groupType } = useBooking();
  const isGroup = groupType !== 'solo';
  const vehicles = isGroup ? VEHICLES.filter(v => v.id === 'car') : VEHICLES;

  const handleSelect = (id) => {
    setVehicleType(id);
    navigate(BOOKING_ROUTES.homestay);
  };

  return (
    <BookingPageLayout
      title="SELECT VEHICLE"
      subtitle={isGroup ? 'Comfortable car for your group' : 'Choose your ride'}
      onBack={() => navigate(BOOKING_ROUTES.spots)}
      backLabel="Spots"
    >
      <div className="retro-radio-group">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelect(v.id)}
            className="glass-brutal"
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer' }}
          >
            <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                border: '3px solid var(--color-black)',
                background: 'var(--color-cream-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconMotorcycle size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                  {v.label}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-gray)', marginTop: 4, marginBottom: 6 }}>
                  {v.desc}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {v.features.map((f, i) => (
                    <span key={i} className="retro-badge retro-badge-outline" style={{ fontSize: 7 }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </button>
        ))}
        {isGroup && (
          <div className="retro-card glass-brutal" style={{ marginTop: 8, padding: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>
              Your group will enjoy a spacious 4-wheeler with room for everyone.
            </div>
          </div>
        )}
      </div>
    </BookingPageLayout>
  );
}
