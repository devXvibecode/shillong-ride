import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconHome, IconTree, IconMountain, IconStar } from '../../components/icons/PixelIcons';

const STAYS = [
  { id: 'mountain', label: 'Mountain View', desc: 'Wake up in the clouds', icon: IconMountain },
  { id: 'nature', label: 'Nature & Peace', desc: 'Deep in the green heart', icon: IconTree },
  { id: 'traditional', label: 'Traditional Homestay', desc: 'Authentic local life', icon: IconHome },
  { id: 'modern', label: 'Cozy Modern Stay', desc: 'Modern comfort, local vibe', icon: IconStar },
  { id: 'budget', label: 'Budget Friendly', desc: 'Simple, clean, affordable', icon: IconHome },
];

export default function Homestay() {
  const navigate = useNavigate();
  const { setSelectedHomestay } = useBooking();

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
      <div className="retro-selector-grid">
        {STAYS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              className="retro-radio"
              style={{ flexDirection: 'column', textAlign: 'center', padding: 14, gap: 8 }}
            >
              <Icon size={24} />
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>{s.desc}</div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
