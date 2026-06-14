import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconUser, IconUsers, IconStar } from '../../components/icons/PixelIcons';

const GROUPS = [
  { id: 'solo', label: 'Solo Explorer', desc: 'Just you and the road', icon: IconUser },
  { id: 'couple', label: 'Couple Escape', desc: 'A journey for two', icon: IconStar },
  { id: 'friends', label: 'Friends Trip', desc: 'Squad goals', icon: IconUsers },
  { id: 'family', label: 'Family Trip', desc: 'Memories for all', icon: IconUsers },
];

export default function GroupType() {
  const navigate = useNavigate();
  const { setGroupType, setBookingType } = useBooking();

  const handleSelect = (id) => {
    setGroupType(id);
    setBookingType('normal');
    navigate(BOOKING_ROUTES.circuit);
  };

  return (
    <BookingPageLayout
      title="SELECT GROUP"
      subtitle="Who's coming along?"
      onBack={() => navigate(BOOKING_ROUTES.type)}
      backLabel="Package"
    >
      <div className="retro-selector-grid">
        {GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className="retro-radio"
              style={{ flexDirection: 'column', textAlign: 'center', padding: 16, gap: 8 }}
            >
              <Icon size={28} />
              <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>{g.label}</div>
              <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>{g.desc}</div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
