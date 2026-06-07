import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isBooking = location.pathname === '/booking';

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-20 items-center">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="bg-yellow-500 border-3 sm:border-4 border-black p-0.5 sm:p-1 group-hover:rotate-12 transition-transform">
              <span className="text-lg sm:text-2xl font-black text-black leading-none">SR</span>
            </div>
            <span className="font-anton text-xl sm:text-2xl tracking-tighter">SHILLONG RIDE</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-8">
            <Link 
              to="/" 
              className={`font-black text-sm uppercase tracking-widest hover:text-yellow-500 transition-colors hidden sm:block ${location.pathname === '/' ? 'text-yellow-500 underline decoration-4' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/my-bookings" 
              className={`font-black text-xs sm:text-sm uppercase tracking-widest hover:text-yellow-500 transition-colors ${location.pathname === '/my-bookings' ? 'text-yellow-500 underline decoration-4' : ''}`}
            >
              Bookings
            </Link>
            <Link 
              to="/contact" 
              className={`font-black text-xs sm:text-sm uppercase tracking-widest hover:text-yellow-500 transition-colors ${location.pathname === '/contact' ? 'text-yellow-500 underline decoration-4' : ''}`}
            >
              Help
            </Link>
            
            {!isBooking && (
              <Link to="/booking" className="neo-btn bg-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm whitespace-nowrap">
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}