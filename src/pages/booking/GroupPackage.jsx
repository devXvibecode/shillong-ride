import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconUser, IconUsers, IconStar, IconMotorcycle, IconCheck } from '../../components/icons/PixelIcons';

const GROUPS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Just you and the road', icon: IconUser, subtitle: '1 rider, bike only, nodal pickup' },
  { id: 'couple', label: 'Couple Escape', desc: 'A journey for two', icon: IconStar, subtitle: '2 riders, car, homestay & meals' },
  { id: 'friends', label: 'Friends Trip', desc: '3-5 riders, squad goals', icon: IconUsers, subtitle: 'Car, homestay & meals' },
  { id: 'family', label: 'Family Trip', desc: '5+ riders, memories for all', icon: IconUsers, subtitle: 'Car, homestay & meals' },
];

export default function GroupPackage() {
  const navigate = useNavigate();
  const { setGroupType, setBookingType, setVehicleType } = useBooking();

  const handleSelect = (id) => {
    setGroupType(id);
    if (id === 'solo') {
      setBookingType('normal');
      setVehicleType('bike');
    } else {
      setBookingType('premium');
      setVehicleType('car');
    }
    navigate(BOOKING_ROUTES.circuit);
  };

  return (
    <BookingPageLayout title="WHO'S RIDING?" subtitle="Choose your group size">
      <div className="retro-selector-grid">
        {GROUPS.map((g) => {
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
                background: g.id === 'solo' ? 'var(--color-navy)' : 'var(--color-hotpink)',
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
