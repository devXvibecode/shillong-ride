import { Link } from 'react-router-dom';
import { IconMyComputer, IconMotorcycle, IconFolder, IconUser } from '../components/icons/PixelIcons';

const ROTATIONS = ['-1.5deg', '2deg', '-0.5deg', '1deg', '-2deg', '0.8deg', '-1.2deg'];

const DESKTOP_ICONS = [
  { to: '/booking', label: 'Booking\nWizard', icon: IconMotorcycle, color: '#E8633C', rotate: 2 },
  { to: '/my-bookings', label: 'My\nBookings', icon: IconFolder, color: '#FFD700', rotate: -1.5 },
  { to: '/contact', label: 'Contact\nUs', icon: IconUser, color: '#5A7FFF', rotate: 1.8 },
];

export default function Home() {
  return (
    <div className="retro-desktop" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Diagonal stripe belt across desktop */}
      <div className="brutal-stripe-white" style={{
        position: 'absolute', top: '30%', left: 0, right: 0, height: 40,
        transform: 'rotate(-2deg)', zIndex: 0,
      }} />

      {/* Desktop background watermark */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(32px, 8vw, 80px)',
          color: 'rgba(255,255,255,0.06)',
          textTransform: 'uppercase',
          lineHeight: 1.2,
          textAlign: 'center',
          letterSpacing: '8px',
          userSelect: 'none',
          transform: 'rotate(-3deg)',
        }}>
          SHILLONG<br />RIDE
        </span>
      </div>

      {/* Desktop Icons */}
      <div className="retro-desktop-icons" style={{ position: 'relative', zIndex: 1 }}>
        {/* My Computer icon — deliberately larger */}
        <Link to="/booking" className="retro-desktop-icon" style={{ transform: 'rotate(-1deg)', width: 96 }}>
          <IconMyComputer size={52} />
          <span>My<br />Computer</span>
        </Link>

        {DESKTOP_ICONS.map((icon, idx) => {
          const IconComponent = icon.icon;
          return (
            <Link
              key={icon.to}
              to={icon.to}
              className="retro-desktop-icon"
              style={{ transform: `rotate(${icon.rotate}deg)` }}
            >
              <IconComponent size={40} />
              <span>{icon.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop context menu area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }} />
    </div>
  );
}
