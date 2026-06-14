import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconUser, IconUsers, IconStar } from '../../components/icons/PixelIcons';

const ALL_GROUPS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Just you and the road', icon: IconUser, subtitle: '1 rider, bike only, nodal pickup', color: 'var(--color-navy)' },
  { id: 'couple', label: 'Couple Escape', desc: 'A journey for two', icon: IconStar, subtitle: '2 riders, car, homestay & meals', color: 'var(--color-hotpink)' },
  { id: 'friends', label: 'Friends Trip', desc: 'Adventure with the crew', icon: IconUsers, subtitle: '3-5 riders, car & homestay', color: 'var(--color-hotpink)' },
  { id: 'family', label: 'Family Trip', desc: 'Create memories together', icon: IconUsers, subtitle: '5+ riders, car & homestay', color: 'var(--color-hotpink)' },
];

export default function GroupPackage() {
  const navigate = useNavigate();
  const { bookingType, setGroupType, setVehicleType } = useBooking();

  useEffect(() => {
    if (!bookingType) navigate('/booking', { replace: true });
  }, [bookingType, navigate]);

  const isStandard = bookingType === 'normal';
  const groups = isStandard ? ALL_GROUPS.filter(g => g.id === 'solo') : ALL_GROUPS;

  const handleSelect = (id) => {
    setGroupType(id);
    if (id === 'solo') {
      setVehicleType('bike');
    } else {
      setVehicleType('car');
    }
    navigate(BOOKING_ROUTES.circuit);
  };

  return (
    <BookingPageLayout
      title="WHO'S RIDING?"
      subtitle={isStandard ? 'Who is riding today?' : 'Who is riding with you?'}
      onBack={() => navigate('/booking')}
      backLabel="Package"
    >
      <div className="retro-selector-grid">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className="glass-brutal"
              style={{
                flexDirection: 'column', textAlign: 'center', padding: 16, gap: 8, cursor: 'pointer',
              }}
            >
              <Icon size={28} />
              <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{g.label}</div>
              <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>{g.desc}</div>
              <div style={{
                fontSize: 7, color: 'white', marginTop: 4,
                background: g.color,
                padding: '2px 8px', fontWeight: 700, textTransform: 'uppercase',
                border: '2px solid var(--color-black)',
              }}>
                {g.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
