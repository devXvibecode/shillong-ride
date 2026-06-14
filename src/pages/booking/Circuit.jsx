import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import BookingPageLayout from './BookingPageLayout';
import PlaceImage from '../../components/PlaceImage';
import { IconMap } from '../../components/icons/PixelIcons';

export default function Circuit() {
  const navigate = useNavigate();
  const { setSelectedCircuit } = useBooking();
  const { circuits, places } = useData();
  const [expanded, setExpanded] = useState(null);

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
      <div className="circuit-grid">
        {circuits?.map((c) => {
          const firstSpotId = c.spots?.[0];
          const firstSpot = places?.find(p => p.id === firstSpotId);
          const isExpanded = expanded === c.id;

          return (
            <div key={c.id} className="circuit-card" onClick={() => handleSelect(c)}>
              {/* Image */}
              <div className="circuit-card-img">
                {firstSpot ? (
                  <PlaceImage placeId={firstSpot.id} alt={c.name} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--color-cream-alt)',
                    fontSize: 24, fontWeight: 700, fontFamily: "'Anton', sans-serif",
                    color: 'var(--color-gray)',
                  }}>
                    {c.shortName || c.name}
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: c.color || 'var(--color-navy)',
                  color: 'white', padding: '4px 8px',
                  fontSize: 9, fontWeight: 700, border: '2px solid var(--color-black)',
                  boxShadow: '2px 2px 0 0 rgba(0,0,0,0.85)',
                }}>
                  {c.spots?.length || 0} SPOTS
                </div>
              </div>

              {/* Body */}
              <div className="circuit-card-body">
                <h3>{c.name}</h3>
                {c.tagline && (
                  <p style={{ fontWeight: 700, color: c.color || 'var(--color-orange)', fontSize: 10, marginBottom: 6 }}>
                    {c.tagline}
                  </p>
                )}
                <p>{c.description}</p>

                {/* Expandable travel reality */}
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : c.id); }}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--color-orange)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {isExpanded ? '▲' : '▼'}
                    {' '}{isExpanded ? 'Show Less' : 'Travel Reality'}
                  </button>
                  {isExpanded && (
                    <p style={{
                      marginTop: 6, padding: 8, background: 'var(--color-cream-alt)',
                      border: '2px solid var(--color-black)',
                      fontSize: 10, lineHeight: 1.4,
                    }}>
                      {c.travelReality}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="circuit-card-footer">
                <IconMap size={14} style={{ color: c.color || 'var(--color-orange)' }} />
                <span>Select this circuit</span>
                <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>
              </div>
            </div>
          );
        })}
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
