import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconMotorcycle, IconStar } from '../../components/icons/PixelIcons';

const CARDS = [
  {
    id: 'normal',
    title: 'Standard Ride',
    desc: 'Essential exploration. Flexible routes, local riders, and the raw beauty of Meghalaya.',
    features: ['Nodal pickup points', 'Up to 3 spots', 'Local rider guide', 'Pay after ride'],
    icon: IconMotorcycle,
  },
  {
    id: 'premium',
    title: 'Premium Journey',
    desc: 'Curated excellence with homestays, meals, medical cover, and a personal local buddy.',
    features: ['Doorstep pickup', 'Up to 4 spots', 'Homestay & meals', 'Personal guide'],
    icon: IconStar,
  },
];

export default function BookingType() {
  const navigate = useNavigate();
  const { setBookingType, setGroupType } = useBooking();

  const handleSelect = (type) => {
    setBookingType(type);
    if (type === 'normal') setGroupType('solo');
    navigate(BOOKING_ROUTES.group);
  };

  return (
    <BookingPageLayout title="SELECT PACKAGE" subtitle="Choose your adventure style">
      <div className="retro-radio-group">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              className="retro-radio"
              style={{ display: 'block', textAlign: 'left', width: '100%', padding: 16 }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  border: '3px solid var(--color-black)',
                  background: 'var(--color-cream-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2, textTransform: 'uppercase' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-gray)', marginBottom: 8 }}>
                    {card.desc}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {card.features.map((f, i) => (
                      <span key={i} className="retro-badge retro-badge-outline" style={{ fontSize: 8 }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </BookingPageLayout>
  );
}
