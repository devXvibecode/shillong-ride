import { Link, useLocation } from 'react-router-dom';
import { IconMotorcycle } from './icons/PixelIcons';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const isBooking = location.pathname.startsWith('/booking');

  if (isBooking) return null;

  return (
    <nav className="top-nav">
      <Link to="/" className="top-nav-logo">
        SHILLONG RIDE
      </Link>
      <div className="top-nav-links">
        {NAV_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`top-nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link to="/booking" className="top-nav-cta">
        <IconMotorcycle size={14} />
        BOOK NOW
      </Link>
    </nav>
  );
}
