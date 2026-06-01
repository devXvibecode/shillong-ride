import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/my-bookings', label: 'Bookings' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700" aria-hidden="true" />
        <div className="bg-[#1e1e2b]/95 backdrop-blur-sm border-b-2 border-[#f97316]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <span className="font-['Anton'] text-lg sm:text-xl text-white tracking-[0.08em] uppercase group-hover:text-orange-500 transition-colors">
                  Shillong<span className="text-orange-500 group-hover:text-white transition-colors">Ride</span>
                </span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4">
                {links.map(l => (
                  <Link key={l.to} to={l.to} aria-current={location.pathname === l.to ? 'page' : undefined}
                    className={`text-xs font-semibold uppercase tracking-[0.12em] px-3 sm:px-5 py-2 sm:py-2.5 transition-all duration-200 rounded-lg ${
                      location.pathname === l.to ? 'text-black bg-[#f97316] border-2 border-[#c2410c]' : 'text-white/55 hover:text-white border-2 border-transparent hover:border-[#404060]'
                    }`}>
                    {l.label}
                  </Link>
                ))}
                {location.pathname !== '/booking' && (
                  <Link to="/booking" className="hidden sm:inline-block brut-btn-primary text-xs px-5 py-2 sm:py-2.5 tracking-wider uppercase whitespace-nowrap">Start Booking</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}