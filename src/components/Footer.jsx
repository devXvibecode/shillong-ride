import { Link, useLocation } from 'react-router-dom';
import { IconMap, IconMotorcycle } from './icons/PixelIcons';

export default function Footer() {
  const location = useLocation();
  const isBooking = location.pathname.startsWith('/booking');

  if (isBooking) return null;

  return (
    <div style={{
      background: 'var(--color-navy)',
      color: 'white',
      borderTop: '5px solid var(--color-hotpink)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: 32, padding: '40px 32px',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 24, textTransform: 'uppercase',
            letterSpacing: 1, marginBottom: 10,
          }}>
            Shillong Ride
          </div>
          <p style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.6, maxWidth: 320 }}>
            Private pillion tours across Meghalaya. No driving, no planning — just pure exploration with a local rider.
          </p>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7, opacity: 0.5, marginTop: 16,
          }}>
            SINCE 2024
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            borderBottom: '2px solid var(--color-hotpink)',
            paddingBottom: 6, marginBottom: 12,
          }}>
            Navigate
          </div>
          {[
            { to: '/', label: 'Home' },
            { to: '/booking', label: 'Book a Tour' },
            { to: '/my-bookings', label: 'My Bookings' },
            { to: '/contact', label: 'Contact Us' },
          ].map(link => (
            <Link key={link.to} to={link.to}
              style={{
                display: 'block', color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none', fontSize: 11, padding: '4px 0',
                fontFamily: "'JetBrains Mono', monospace",
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            borderBottom: '2px solid var(--color-hotpink)',
            paddingBottom: 6, marginBottom: 12,
          }}>
            Reach Us
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconMap size={12} style={{ flexShrink: 0 }} />
              Police Bazaar, Shillong
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              +91 12345 67890
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@shillongride.com
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '2px solid rgba(255,255,255,0.1)',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, opacity: 0.5,
        maxWidth: 1200, margin: '0 auto',
      }}>
        <span>© {new Date().getFullYear()} Shillong Ride</span>
        <span>Made in Meghalaya</span>
      </div>
    </div>
  );
}
