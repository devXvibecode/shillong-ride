import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMap, IconCheck } from '../../components/icons/PixelIcons';
import imageManifest from '../../data/images-manifest.json';

const BASE = import.meta.env.BASE_URL || '/';
function spotImg(placeId) {
  const paths = imageManifest[placeId];
  if (paths && paths.length > 0) {
    const p = paths[0];
    if (p.startsWith('/')) return BASE.replace(/\/$/, '') + p;
    return p;
  }
  return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop';
}

export default function Spots() {
  const navigate = useNavigate();
  const { selectedCircuit, selectedSpots, addSpot, isPremium } = useBooking();
  const { places } = useData();
  const [imgLoaded, setImgLoaded] = useState({});
  const prevLengthRef = useRef(selectedSpots.length);

  const maxSpots = isPremium ? 4 : 3;
  const circuitSpotIds = selectedCircuit?.spots || [];
  const spots = places?.filter(p => circuitSpotIds.includes(p.id)) || [];

  useEffect(() => {
    const prev = prevLengthRef.current;
    if (prev < selectedSpots.length && selectedSpots.length >= maxSpots) {
      navigate(isPremium ? BOOKING_ROUTES.vehicle : BOOKING_ROUTES.pickup);
    }
    prevLengthRef.current = selectedSpots.length;
  }, [selectedSpots.length, maxSpots, isPremium, navigate]);

  return (
    <BookingPageLayout
      title="SELECT SPOTS"
      subtitle={`Pick up to ${maxSpots} spots`}
      onBack={() => navigate(BOOKING_ROUTES.circuit)}
      backLabel="Route"
    >
      {/* Status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', border: '4px solid var(--color-black)',
        background: 'repeating-linear-gradient(-45deg, var(--color-cream-alt) 0px, var(--color-cream-alt) 4px, var(--color-cream) 4px, var(--color-cream) 8px)',
        marginBottom: 16, boxShadow: '4px 4px 0 0 rgba(0,0,0,0.85)',
      }}>
        <span className="retro-badge retro-badge-navy" style={{ fontSize: 9 }}>
          {selectedCircuit?.shortName || 'Route'}
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
              className={`glass-brutal ${isSelected ? 'glass-selected' : ''}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                textAlign: 'left', padding: 0,
                opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transform: `rotate(${(idx % 3 - 1) * 0.8}deg)`,
                border: isSelected ? '4px solid var(--color-orange)' : '4px solid var(--color-black)',
                boxShadow: isSelected ? '5px 5px 0 0 rgba(0,0,0,0.85)' : '4px 4px 0 0 rgba(0,0,0,0.85)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Full-bleed background image */}
              <div className="glass-bg">
                <img
                  src={spotImg(place.id)}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={() => setImgLoaded(prev => ({ ...prev, [place.id]: true }))}
                  style={{ position: 'absolute', inset: 0 }}
                />
                {!imgLoaded[place.id] && (
                  <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} className="skeleton" />
                )}
              </div>

              {/* Spacer to show image behind glass */}
              <div style={{ height: 100 }} />

              {/* Checkmark (sits on glass) */}
              {isSelected && (
                <div className="glass-inner" style={{
                  position: 'absolute', top: 8, right: 8, zIndex: 2,
                  width: 28, height: 28, background: 'var(--color-orange)',
                  border: '3px solid var(--color-black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '2px 2px 0 0 rgba(0,0,0,0.85)',
                }}>
                  <IconCheck size={16} />
                </div>
              )}

              {/* Info area (on glass surface) */}
              <div className="glass-inner glass-heavy" style={{ padding: 10, borderTop: '2px solid var(--color-black)' }}>
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
    </BookingPageLayout>
  );
}
