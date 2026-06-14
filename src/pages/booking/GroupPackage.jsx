import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconUser, IconUsers, IconStar, IconMotorcycle, IconCheck } from '../../components/icons/PixelIcons';

const GROUP_OPTIONS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Just you and the road', icon: IconUser },
  { id: 'couple', label: 'Couple Escape', desc: 'A journey for two', icon: IconStar },
  { id: 'friends', label: 'Friends Trip', desc: '3-5 riders, squad goals', icon: IconUsers },
  { id: 'family', label: 'Family Trip', desc: '5+ riders, memories for all', icon: IconUsers },
];

const PACKAGES = [
  {
    id: 'normal',
    label: 'Standard Ride',
    desc: 'Essential exploration on two wheels, nodal pickup',
    badge: 'BIKE ONLY',
    badgeBg: 'var(--color-navy)',
    features: ['Nodal pickup points', 'Up to 3 spots', 'Local rider guide', 'Pay after ride'],
    icon: IconMotorcycle,
  },
  {
    id: 'premium',
    label: 'Premium Journey',
    desc: 'Curated excellence with homestay, meals, doorstep pickup',
    badge: 'BEST VALUE',
    badgeBg: 'var(--color-hotpink)',
    features: ['Doorstep pickup', 'Up to 4 spots', 'Homestay & meals', 'Personal guide'],
    icon: IconStar,
  },
];

export default function GroupPackage() {
  const navigate = useNavigate();
  const { bookingType, setBookingType, groupType, setGroupType, setVehicleType, reset } = useBooking();
  const [selectedGroup, setSelectedGroup] = useState(groupType || null);

  const handleGroupSelect = (id) => {
    setSelectedGroup(id);
  };

  const handlePackageSelect = (pkgId) => {
    const isSolo = selectedGroup === 'solo';
    setGroupType(selectedGroup);
    setBookingType(pkgId);

    if (pkgId === 'normal') {
      setVehicleType('bike');
    } else if (!isSolo) {
      setVehicleType('car');
    }

    navigate(BOOKING_ROUTES.circuit);
  };

  const availablePackages = selectedGroup === 'solo'
    ? PACKAGES
    : PACKAGES.filter(p => p.id === 'premium');

  return (
    <BookingPageLayout title="SELECT GROUP" subtitle="Who's riding?">
      {/* Group selection */}
      <div className="retro-selector-grid">
        {GROUP_OPTIONS.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => handleGroupSelect(g.id)}
              className={`glass-brutal ${isSelected ? 'glass-selected' : ''}`}
              style={{
                flexDirection: 'column', textAlign: 'center', padding: 16, gap: 8, cursor: 'pointer',
                border: isSelected ? '4px solid var(--color-orange)' : '4px solid var(--color-black)',
              }}
            >
              <Icon size={28} />
              <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{g.label}</div>
              <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>{g.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Package selection */}
      {selectedGroup && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            borderBottom: '2px solid var(--color-black)', paddingBottom: 6, marginBottom: 10,
          }}>
            {selectedGroup === 'solo' ? 'Select Your Package' : 'Premium Required for Groups'}
          </div>
          <div className="retro-radio-group" style={{ gap: 12 }}>
            {availablePackages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <button
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className="glass-brutal"
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer',
                  }}
                >
                  <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
                    <span className="brutal-stamp" style={{
                      top: -10, right: -8,
                      background: pkg.badgeBg,
                      fontSize: 7, padding: '3px 8px',
                    }}>
                      {pkg.badge}
                    </span>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 48, height: 48, flexShrink: 0,
                        border: '4px solid var(--color-black)',
                        background: pkg.id === 'premium' ? 'var(--color-yellow)' : 'var(--color-cream-alt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '3px 3px 0 0 rgba(0,0,0,0.85)',
                      }}>
                        <Icon size={26} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase' }}>
                          {pkg.label}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-gray)', marginBottom: 6 }}>
                          {pkg.desc}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {pkg.features.map((f, i) => (
                            <span key={i} className={`retro-badge ${i % 2 === 0 ? 'retro-badge-outline' : 'retro-badge-navy'}`} style={{ fontSize: 7 }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BookingPageLayout>
  );
}
