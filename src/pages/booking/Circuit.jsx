import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMap, IconFolder } from '../../components/icons/PixelIcons';

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
      title="SELECT CIRCUIT"
      subtitle="Pick your path through Meghalaya"
      onBack={() => navigate(BOOKING_ROUTES.group)}
      backLabel="Group"
    >
      <div className="retro-radio-group">
        {circuits?.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelect(c)}
            className="retro-radio"
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: 12 }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <IconFolder size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                  {c.name}
                </div>
                {c.tagline && (
                  <div style={{ fontSize: 10, color: 'var(--color-gray)', marginTop: 2 }}>
                    {c.tagline}
                  </div>
                )}
              </div>
              <span className="retro-badge retro-badge-outline" style={{ fontSize: 7 }}>
                {c.spots?.length || 0} SPOTS
              </span>
              <IconMap size={16} style={{ color: 'var(--color-orange)' }} />
            </div>
          </button>
        ))}
      </div>

      {(!circuits || circuits.length === 0) && (
        <div className="retro-card" style={{ textAlign: 'center', padding: 24 }}>
          <div className="retro-spinner" style={{ margin: '0 auto 8px' }} />
          <span style={{ fontSize: 11 }}>Loading circuits...</span>
        </div>
      )}
    </BookingPageLayout>
  );
}
