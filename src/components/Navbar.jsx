import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isBooking = location.pathname === '/booking';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 border-4 border-black p-1 group-hover:rotate-12 transition-transform">
              <span className="text-2xl font-black text-black">SR</span>
            </div>
            <span className="font-anton text-2xl tracking-tighter hidden sm:block">SHILLONG RIDE</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link 
              to="/" 
              className={`font-black text-sm uppercase tracking-widest hover:text-orange-500 transition-colors ${location.pathname === '/' ? 'text-orange-500 underline decoration-4' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/my-bookings" 
              className={`font-black text-sm uppercase tracking-widest hover:text-orange-500 transition-colors ${location.pathname === '/my-bookings' ? 'text-orange-500 underline decoration-4' : ''}`}
            >
              Bookings
            </Link>
            <Link 
              to="/contact" 
              className={`font-black text-sm uppercase tracking-widest hover:text-orange-500 transition-colors ${location.pathname === '/contact' ? 'text-orange-500 underline decoration-4' : ''}`}
            >
              Help
            </Link>
            
            {!isBooking && (
              <Link to="/booking" className="neo-btn bg-orange-500 text-black px-4 py-2 text-xs sm:text-sm">
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
