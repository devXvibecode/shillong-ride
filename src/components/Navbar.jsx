import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isBooking = location.pathname === '/booking';

  return (
    <nav className="bg-surface border-b shadow-sm">
      <div className="container px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-transparent text-primary text-2xl font-bold px-3 py-1 rounded-md group-hover:bg-primary-dark/20 transition-all">
              SR
            </div>
            <span className="font-serif text-xl tracking-tighter">SHILLONG RIDE</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/my-bookings" 
              className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}
            >
              Bookings
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Help
            </Link>
          </div>
          
          {!isBooking && (
            <Link to="/booking" className="btn btn-primary btn-md hidden md:block">
              Book Now
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button id="mobile-menu-button" className="md:hidden p-2 rounded-md text-text-secondary hover:bg-text-muted/20">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
