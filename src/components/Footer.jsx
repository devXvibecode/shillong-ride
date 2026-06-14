import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isBooking = location.pathname.startsWith('/booking');
  const isHome = location.pathname === '/';

  if (isBooking || isHome) return null;

  return (
    <div style={{
      background: 'var(--color-cream)',
      borderTop: '2px solid var(--color-black)',
      padding: '6px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
      color: 'var(--color-gray)',
    }}>
      <span>© {new Date().getFullYear()} Shillong Ride</span>
      <span style={{ display: 'flex', gap: 16 }}>
        <Link to="/booking" style={{ color: 'var(--color-gray)', textDecoration: 'none' }}>Book Now</Link>
        <Link to="/contact" style={{ color: 'var(--color-gray)', textDecoration: 'none' }}>Help</Link>
      </span>
      <span>System Ready</span>
    </div>
  );
}
