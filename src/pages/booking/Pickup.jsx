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
            className="retro-radio"
            style={{ display: 'flex', width: '100%', textAlign: 'left', padding: 12 }}
          >
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
          </button>
        ))}
      </div>

      {/* Info tip */}
      <div className="retro-card" style={{ marginTop: 16, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <IconWarning size={20} style={{ flexShrink: 0, color: 'var(--color-orange)' }} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
            How Nodal Pickup Works
          </div>
          <div style={{ fontSize: 10, color: 'var(--color-gray)' }}>
            Standard packages use nodal points to keep pricing predictable. Our riders will meet you at the selected hub.
          </div>
        </div>
      </div>
    </BookingPageLayout>
  );
}
