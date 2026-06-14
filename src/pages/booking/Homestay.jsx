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
        <div className="retro-card" style={{ textAlign: 'center', padding: 24 }}>
          <IconHome size={32} style={{ margin: '0 auto 8px', display: 'block', color: 'var(--color-orange)' }} />
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>No homestays available</div>
          <div style={{ fontSize: 10, color: 'var(--color-gray)' }}>
            No homestays found for {selectedCircuit?.name || 'this circuit'}. Please go back and select a different circuit.
          </div>
        </div>
      )}

      <div className="retro-selector-grid">
        {filtered.map((h, idx) => (
          <button
            key={h.id}
            onClick={() => handleSelect(h)}
            className="retro-checkbox"
            style={{
              flexDirection: 'column', alignItems: 'stretch', padding: 0,
              textAlign: 'left',
              transform: `rotate(${(idx % 2 === 0 ? -0.5 : 0.5)}deg)`,
              border: '3px solid var(--color-black)',
              boxShadow: '4px 4px 0 0 rgba(0,0,0,0.85)',
            }}
          >
            {/* Image */}
            <div style={{
              height: 130, background: 'var(--color-cream-alt)',
              borderBottom: '3px solid var(--color-black)',
              position: 'relative', overflow: 'hidden',
            }}>
              <PlaceImage
                placeId={h.imageRef}
                alt={h.name}
                className="w-full h-full"
              />
              {/* Vibe badge */}
              <div style={{
                position: 'absolute', top: 6, left: 6,
                background: 'var(--color-navy)', color: 'white',
                padding: '2px 6px', fontSize: 7, fontWeight: 700,
                border: '2px solid var(--color-black)',
                textTransform: 'uppercase',
              }}>
                {h.vibe}
              </div>
              {/* Rating badge */}
              <div style={{
                position: 'absolute', bottom: 6, right: 6,
                background: 'var(--color-cream-light)',
                padding: '2px 6px', fontSize: 8, fontWeight: 700,
                border: '2px solid var(--color-black)',
                display: 'flex', alignItems: 'center', gap: 2,
              }}>
                {h.rating}
                <IconStar size={9} style={{ color: 'var(--color-yellow)' }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
                {h.name}
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
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 12px', borderTop: '2px solid var(--color-black)',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              color: 'var(--color-orange)',
            }}>
              <IconMap size={12} />
              <span>Select this stay</span>
              <span style={{ marginLeft: 'auto' }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </BookingPageLayout>
  );
}
