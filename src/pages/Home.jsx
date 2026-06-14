import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMyComputer, IconMotorcycle, IconFolder, IconUser } from '../components/icons/PixelIcons';

const DESKTOP_ICONS = [
  { to: '/booking', label: 'Booking\nWizard', icon: IconMotorcycle, color: '#E8633C' },
  { to: '/my-bookings', label: 'My\nBookings', icon: IconFolder, color: '#FFD700' },
  { to: '/contact', label: 'Contact\nUs', icon: IconUser, color: '#5A7FFF' },
];

export default function Home() {
  return (
    <div className="retro-desktop">
      {/* Desktop Icons */}
      <div className="retro-desktop-icons">
        {/* My Computer icon */}
        <Link to="/booking" className="retro-desktop-icon">
          <IconMyComputer size={40} />
          <span>My<br />Computer</span>
        </Link>

        {DESKTOP_ICONS.map(icon => {
          const IconComponent = icon.icon;
          return (
            <Link key={icon.to} to={icon.to} className="retro-desktop-icon">
              <IconComponent size={40} />
              <span>{icon.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Welcome overlay — shown only on first visit */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="retro-desktop-bg" style={{ zIndex: -1 }}
      />

      {/* Desktop context menu area — right click reserved for future */}
      <div style={{ flex: 1 }} />
    </div>
  );
}
