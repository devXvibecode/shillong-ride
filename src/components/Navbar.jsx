import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconHome, IconFolder, IconMap, IconUser, IconClock } from './icons/PixelIcons';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/my-bookings', label: 'My Bookings', icon: IconFolder },
  { to: '/contact', label: 'Contact Us', icon: IconUser },
];

export default function Navbar() {
  const location = useLocation();
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState('');

  const isBooking = location.pathname.startsWith('/booking');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  if (isBooking) return null;

  return (
    <div className="retro-taskbar brutal-checker">
      {/* Start Button */}
      <div style={{ position: 'relative' }}>
        <button
          className="retro-start-btn"
          onClick={() => setStartOpen(!startOpen)}
          onBlur={() => setTimeout(() => setStartOpen(false), 150)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          START
        </button>

        <AnimatePresence>
          {startOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                position: 'absolute', bottom: '100%', left: 0,
                background: 'var(--color-cream-light)',
                border: '4px solid var(--color-black)',
                boxShadow: '6px 6px 0 0 rgba(0,0,0,0.85)',
                minWidth: 200, zIndex: 2000,
                marginBottom: 2, padding: 6,
              }}
            >
              {NAV_LINKS.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setStartOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12, textDecoration: 'none',
                      color: isActive ? 'white' : 'var(--color-ink)',
                      background: isActive ? 'var(--color-orange)' : 'transparent',
                      border: isActive ? '2px solid var(--color-black)' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.target.style.background = 'var(--color-cream-alt)'; }}
                    onMouseLeave={e => { if (!isActive) e.target.style.background = 'transparent'; }}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
              <div style={{ borderTop: '3px solid var(--color-black)', margin: '6px 0' }} />
              <Link
                to="/booking"
                onClick={() => setStartOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  color: 'var(--color-ink)', background: 'var(--color-yellow)',
                  border: '3px solid var(--color-black)',
                  boxShadow: '3px 3px 0 0 rgba(0,0,0,0.85)',
                }}
              >
                <IconMap size={18} />
                BOOK NOW
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Open items */}
      <div className="retro-taskbar-divider" />
      {NAV_LINKS.filter(l => location.pathname === l.to).map(link => {
        const Icon = link.icon;
        return (
          <div key={link.to} className="retro-taskbar-item active">
            <Icon size={14} />
            {link.label}
          </div>
        );
      })}

      {/* Right side: clock */}
      <div className="retro-taskbar-right">
        <IconClock size={12} />
        {clock}
      </div>
    </div>
  );
}
