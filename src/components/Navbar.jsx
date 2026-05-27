import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/my-bookings', label: 'Bookings' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 shadow-[0_2px_0_rgba(255,255,255,0.1)]" />
        <div
          style={{
            background: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="font-['Anton'] text-lg sm:text-xl text-white tracking-[0.08em] uppercase group-hover:text-orange-500 transition-colors">
                  Shillong<span className="text-orange-500 group-hover:text-white transition-colors">Ride</span>
                </span>
              </Link>

              <div className="flex items-center gap-8">
                {links.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`text-sm font-semibold uppercase tracking-[0.15em] px-5 py-3 transition-all duration-200 rounded-lg ${
                      location.pathname === l.to
                        ? 'text-orange-500 bg-orange-500/10 border border-orange-500/30'
                        : 'text-white/60 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}