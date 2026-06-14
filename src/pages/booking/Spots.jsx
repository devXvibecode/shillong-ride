import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import PlaceImage from '../../components/PlaceImage';
import { IconMap, IconCheck } from '../../components/icons/PixelIcons';

export default function Spots() {
  const navigate = useNavigate();
  const { selectedCircuit, selectedSpots, addSpot, isPremium } = useBooking();
  const { places } = useData();
  const [imgLoaded, setImgLoaded] = useState({});

  const maxSpots = isPremium ? 4 : 3;
  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places?.filter(p => circuitSpotIds.includes(p.id)) || [];

  const handleContinue = () => {
    if (selectedSpots.length > 0) navigate(BOOKING_ROUTES.stay);
  };

  return (
    <BookingPageLayout
      title="SELECT SPOTS"
      subtitle={`Pick up to ${maxSpots} destinations`}
      onBack={() => navigate(BOOKING_ROUTES.circuit)}
      backLabel="Circuit"
    >
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', border: '4px solid var(--color-black)',
        background: 'repeating-linear-gradient(-45deg, var(--color-cream-alt) 0px, var(--color-cream-alt) 4px, var(--color-cream) 4px, var(--color-cream) 8px)',
        marginBottom: 16, boxShadow: '4px 4px 0 0 rgba(0,0,0,0.85)',
      }}>
        <span className="retro-badge retro-badge-navy" style={{ fontSize: 9 }}>
          {selectedCircuit?.shortName || 'Circuit'}
        </span>
        <span className="brutal-number" style={{ fontSize: 12 }}>
          {selectedSpots.length}/{maxSpots}
        </span>
      </div>

      {/* Spots grid */}
      <div className="retro-selector-grid">
        {spots.map((place, idx) => {
          const isSelected = selectedSpots.includes(place.id);
          const isDisabled = !isSelected && selectedSpots.length >= maxSpots;

          return (
            <button
              key={place.id}
              onClick={() => !isDisabled && addSpot(place.id)}
              disabled={isDisabled}
              className={`retro-checkbox ${isSelected ? 'checked' : ''}`}
              style={{
                flexDirection: 'column', alignItems: 'stretch', padding: 0,
                textAlign: 'left', opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transform: `rotate(${(idx % 3 - 1) * 0.8}deg)`,
                border: isSelected ? '4px solid var(--color-orange)' : '3px solid var(--color-black)',
                boxShadow: isSelected ? '5px 5px 0 0 rgba(0,0,0,0.85)' : '3px 3px 0 0 rgba(0,0,0,0.85)',
              }}
            >
              {/* Image area */}
              <div style={{
                height: 120, background: 'var(--color-cream-alt)',
                borderBottom: '3px solid var(--color-black)',
                position: 'relative', overflow: 'hidden',
              }}>
                <PlaceImage
                  placeId={place.id}
                  alt={place.name}
                  onLoad={() => setImgLoaded(prev => ({ ...prev, [place.id]: true }))}
                  className="w-full h-full"
                />
                {!imgLoaded[place.id] && (
                  <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} className="skeleton" />
                )}
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 28, height: 28, background: 'var(--color-orange)',
                    border: '3px solid var(--color-black)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '2px 2px 0 0 rgba(0,0,0,0.85)',
                  }}>
                    <IconCheck size={16} />
                  </div>
                )}
              </div>

              {/* Info area */}
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                  {place.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-gray)', marginTop: 2 }}>
                  {place.description?.slice(0, 60) || 'Discover the beauty.'}
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {place.vibe && (
                    <span className="retro-badge retro-badge-outline" style={{ fontSize: 6 }}>{place.vibe}</span>
                  )}
                  {place.distance && (
                    <span className="retro-badge retro-badge-outline" style={{ fontSize: 6 }}>
                      {place.distance}km
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating bottom bar */}
      {selectedSpots.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: 'var(--color-cream-light)',
          borderTop: '5px solid var(--color-black)',
          padding: '12px 16px',
          boxShadow: '0 -6px 0 0 rgba(0,0,0,0.85)',
        }}>
          <div style={{
            maxWidth: 800, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 6, overflow: 'auto', flex: 1 }}>
              {selectedSpots.map((spotId, idx) => {
                const spot = places.find(p => p.id === spotId);
                return (
                  <div key={spotId} className="retro-badge retro-badge-navy" style={{ fontSize: 7, whiteSpace: 'nowrap' }}>
                    {idx + 1}. {spot?.name}
                  </div>
                );
              })}
            </div>
            <button onClick={handleContinue} className="retro-btn retro-btn-brutal retro-btn-primary">
              CONTINUE →
            </button>
          </div>
        </div>
      )}
      {selectedSpots.length > 0 && <div style={{ height: 60 }} />}
    </BookingPageLayout>
  );
}
