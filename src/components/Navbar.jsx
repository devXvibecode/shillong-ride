import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
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
        <div className="h-3 bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 border-b-2 border-black shadow-[0_2px_0_rgba(255,255,255,0.1)]" />
        <div className="bg-[#1a1a1a] border-b-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
                <span className="font-['Anton'] text-lg sm:text-xl text-white tracking-[0.08em] uppercase group-hover:text-orange-500 transition-colors">
                  Shillong<span className="text-orange-500 group-hover:text-white transition-colors">Ride</span>
                </span>
              </Link>

              <div className="hidden sm:flex items-center gap-1">
                {links.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-all duration-200 ${
                      location.pathname === l.to
                        ? 'text-orange-500 bg-orange-500/10 border border-orange-500/30'
                        : 'text-white/60 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                    style={{ transform: `rotate(${l.to === '/' ? '-0.5deg' : '0.5deg'})` }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                aria-label="Toggle menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="20" y2="12" />
                      <line x1="4" y1="18" x2="20" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden overflow-hidden border-b-2 border-black bg-[#1a1a1a]"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-bold uppercase tracking-wider px-4 py-3 rounded-lg transition-all ${
                    location.pathname === l.to
                      ? 'text-orange-500 bg-orange-500/10 border border-orange-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
