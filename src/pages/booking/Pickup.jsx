import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMap, IconWarning } from '../../components/icons/PixelIcons';

export default function Pickup() {
  const navigate = useNavigate();
  const { setNodalPoint } = useBooking();
  const { hubs } = useData();

  const handleSelect = (hubId) => {
    setNodalPoint(hubId);
    navigate(BOOKING_ROUTES.time);
  };

  return (
    <BookingPageLayout
      title="SELECT PICKUP POINT"
      subtitle="Where should we meet you?"
      onBack={() => navigate(BOOKING_ROUTES.spots)}
      backLabel="Spots"
    >
      <div className="retro-radio-group">
        {hubs?.map((hub) => (
          <button
            key={hub.id}
            onClick={() => handleSelect(hub.id)}
            className="glass-brutal"
            style={{ display: 'flex', width: '100%', textAlign: 'left', padding: 12, gap: 10, cursor: 'pointer' }}
          >
            <div className="glass-inner glass-heavy" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: 1 }}>
            <IconMap size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                {hub.name}
              </div>
              {hub.description && (
                <div style={{ fontSize: 10, color: 'var(--color-gray)', marginTop: 1 }}>
                  {hub.description}
                </div>
              )}
            </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info tip */}
      <div className="retro-card glass-brutal" style={{ marginTop: 16, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <IconWarning size={20} style={{ flexShrink: 0, color: 'var(--color-orange)' }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
            How Pickup Works
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-gray)' }}>
            Pick a meeting point and our rider will meet you there. Nodal points keep pricing predictable and routes efficient.
          </div>
        </div>
      </div>
    </BookingPageLayout>
  );
}
