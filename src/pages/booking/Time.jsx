import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconClock, IconSun } from '../../components/icons/PixelIcons';

const SLOTS = [
  { id: 'morning', label: 'Early Morning', time: '07:00 - 09:00', icon: IconClock },
  { id: 'midmorning', label: 'Mid Morning', time: '09:00 - 11:00', icon: IconSun },
  { id: 'noon', label: 'Afternoon', time: '12:00 - 14:00', icon: IconSun },
];

export default function Time() {
  const navigate = useNavigate();
  const { setTimeSlot, isPremium } = useBooking();

  const handleSelect = (id) => {
    setTimeSlot(id);
    navigate(isPremium ? BOOKING_ROUTES.confirmPremium : BOOKING_ROUTES.confirmNormal);
  };

  return (
    <BookingPageLayout
      title="SELECT TIME"
      subtitle="Pick your start time"
      onBack={() => {
        if (isPremium) navigate(BOOKING_ROUTES.homestay);
        else navigate(BOOKING_ROUTES.pickup);
      }}
      backLabel={isPremium ? 'Homestay' : 'Pickup'}
    >
      <div className="retro-radio-group">
        {SLOTS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className="retro-radio"
              style={{ display: 'flex', width: '100%', textAlign: 'left', padding: 12, gap: 12, alignItems: 'center' }}
            >
              <Icon size={22} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
              <span className="retro-badge retro-badge-orange" style={{ fontSize: 8 }}>
                {s.time}
              </span>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
