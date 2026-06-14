import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMotorcycle, IconStar, IconMap, IconHome, IconClock, IconHelmet, IconMountain, IconSun } from '../../components/icons/PixelIcons';

const PACKAGES = [
  {
    id: 'normal',
    label: 'Standard Ride',
    tagline: 'For solo explorers',
    color: 'var(--color-navy)',
    features: [
      { icon: IconMotorcycle, text: 'Bike adventure — 1 rider' },
      { icon: IconMap, text: 'Nodal pickup & drop' },
      { icon: IconHelmet, text: 'Personal guide included' },
      { icon: IconMountain, text: 'Up to 3 scenic spots' },
    ],
  },
  {
    id: 'premium',
    label: 'Elite Experience',
    tagline: 'For groups & solo adventurers',
    color: 'var(--color-hotpink)',
    features: [
      { icon: IconHome, text: 'Homestay + meals included' },
      { icon: IconStar, text: 'Door-to-door pickup & drop' },
      { icon: IconMountain, text: 'Up to 4 destinations' },
      { icon: IconSun, text: '24/7 support' },
    ],
  },
];

export default function PackageSelect() {
  const navigate = useNavigate();
  const { setBookingType } = useBooking();

  const handleSelect = (id) => {
    setBookingType(id);
    navigate(BOOKING_ROUTES.group);
  };

  return (
    <BookingPageLayout title="CHOOSE YOUR PACKAGE" subtitle="Select how you want to explore Meghalaya">
      <div className="retro-selector-grid">
        {PACKAGES.map((pkg) => {
          return (
            <button
              key={pkg.id}
              onClick={() => handleSelect(pkg.id)}
              className="glass-brutal"
              style={{
                display: 'flex', flexDirection: 'column', textAlign: 'left',
                padding: 0, cursor: 'pointer', overflow: 'hidden',
              }}
            >
              {/* Package header */}
              <div style={{
                background: pkg.color, color: 'white', padding: '14px 16px',
                borderBottom: '4px solid var(--color-black)',
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {pkg.label}
                </div>
                <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>
                  {pkg.tagline}
                </div>
              </div>

              {/* Feature list */}
              <div className="glass-inner glass-heavy" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pkg.features.map((f, i) => {
                  const FIcon = f.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, flexShrink: 0,
                        border: '2px solid var(--color-black)',
                        background: 'var(--color-cream-alt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FIcon size={14} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                        {f.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA footer */}
              <div className="glass-inner" style={{
                padding: '10px 16px', borderTop: '2px solid var(--color-black)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--color-glass-heavy)',
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  color: pkg.color,
                }}>
                  {pkg.id === 'normal' ? 'Start with Standard' : 'Start Elite Experience'}
                </span>
                <span style={{ fontSize: 14 }}>→</span>
              </div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
