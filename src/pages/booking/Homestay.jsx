import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import PlaceImage from '../../components/PlaceImage';
import { IconHome, IconStar, IconMap } from '../../components/icons/PixelIcons';

function ratingStars(rating) {
  const full = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <IconStar key={i} size={10} style={{ color: i < full ? 'var(--color-yellow)' : 'var(--color-gray)' }} />
  ));
}

export default function Homestay() {
  const navigate = useNavigate();
  const { selectedCircuit, setSelectedHomestay } = useBooking();
  const { homestays } = useData();

  const filtered = homestays?.filter(h => h.circuitId === selectedCircuit?.id) || [];

  const handleSelect = (stay) => {
    setSelectedHomestay(stay);
    navigate(BOOKING_ROUTES.time);
  };

  return (
    <BookingPageLayout
      title="SELECT HOMESTAY"
      subtitle="Where will you rest your helmet?"
      onBack={() => navigate(BOOKING_ROUTES.vehicle)}
      backLabel="Vehicle"
    >
      {filtered.length === 0 && (
        <div className="retro-card glass-brutal" style={{ textAlign: 'center', padding: 24 }}>
          <div className="glass-inner">
            <IconHome size={32} style={{ margin: '0 auto 8px', display: 'block', color: 'var(--color-orange)' }} />
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>No homestays available</div>
            <div style={{ fontSize: 10, color: 'var(--color-gray)' }}>
              No homestays found for {selectedCircuit?.name || 'this circuit'}. Please go back and select a different circuit.
            </div>
          </div>
        </div>
      )}

      <div className="retro-selector-grid">
        {filtered.map((h, idx) => (
          <button
            key={h.id}
            onClick={() => handleSelect(h)}
            className="glass-brutal"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'stretch',
              textAlign: 'left', padding: 0, cursor: 'pointer',
              border: '4px solid var(--color-black)',
              transform: `rotate(${(idx % 2 === 0 ? -0.5 : 0.5)}deg)`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Full-bleed background image */}
            <div className="glass-bg">
              <PlaceImage placeId={h.imageRef} alt={h.name} />
            </div>

            {/* Vibe badge (sits on glass, not behind it) */}
            <div className="glass-inner" style={{
              position: 'absolute', top: 8, left: 8, zIndex: 2,
              background: 'var(--color-navy)', color: 'white',
              padding: '2px 8px', fontSize: 7, fontWeight: 700,
              border: '2px solid var(--color-black)',
              textTransform: 'uppercase',
            }}>
              {h.vibe}
            </div>

            {/* Spacer to show image behind glass */}
            <div style={{ height: 100 }} />

            {/* Info (on glass surface) */}
            <div className="glass-inner glass-heavy" style={{ padding: 12, borderTop: '2px solid var(--color-black)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', flex: 1 }}>
                  {h.name}
                </div>
                <div style={{
                  background: 'var(--color-cream-light)',
                  padding: '2px 6px', fontSize: 8, fontWeight: 700,
                  border: '2px solid var(--color-black)',
                  display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0,
                }}>
                  {h.rating}
                  <IconStar size={9} style={{ color: 'var(--color-yellow)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 1, marginBottom: 6 }}>
                {ratingStars(h.rating)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-gray)', marginBottom: 8, lineHeight: 1.3 }}>
                {h.description?.slice(0, 80)}{h.description?.length > 80 ? '...' : ''}
              </div>

              {/* Price */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Anton', sans-serif" }}>
                  ₹{h.priceRange?.min}
                </span>
                <span style={{ fontSize: 10, color: 'var(--color-gray)' }}>
                  - ₹{h.priceRange?.max} / night
                </span>
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {h.amenities?.slice(0, 4).map((a, i) => (
                  <span key={i} className="retro-badge retro-badge-outline" style={{ fontSize: 6 }}>
                    {a}
                  </span>
                ))}
                {h.amenities?.length > 4 && (
                  <span className="retro-badge retro-badge-navy" style={{ fontSize: 6 }}>
                    +{h.amenities.length - 4}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 8, paddingTop: 8, borderTop: '2px solid var(--color-black)',
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                color: 'var(--color-orange)',
              }}>
                <IconMap size={12} />
                <span>Select this stay</span>
                <span style={{ marginLeft: 'auto' }}>→</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
