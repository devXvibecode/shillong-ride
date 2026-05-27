import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function Confirmation() {
  const navigate = useNavigate();
  const { booking, reset } = useBooking();

  if (!booking) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
        <p className="text-white/55 text-lg font-['Anton'] uppercase tracking-wider">No booking found.</p>
        <button onClick={reset} className="text-orange-500 font-['Anton'] mt-4 inline-block hover:underline uppercase tracking-wider cursor-pointer">
          Book Another Tour
        </button>
      </div>
    );
  }

  const p = booking.priceBreakdown;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: -3 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-24 h-24 mx-auto mb-6"
      >
        <div className="w-full h-full flex items-center justify-center border-4 border-green-700/50 rounded-xl bg-green-900/10" style={{ borderStyle: 'double' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="inline-flex items-center px-6 py-3 mx-auto mb-6 border-4 border-green-700/50 rounded-xl bg-green-900/10"
        style={{ borderStyle: 'double' }}
      >
        <span className="font-['Anton'] text-green-600 text-xl sm:text-2xl uppercase tracking-[0.15em]">APPROVED</span>
      </motion.div>

      <h2 className="font-['Anton'] text-3xl sm:text-4xl text-white uppercase tracking-[0.02em] mb-2">Booking Confirmed!</h2>
      <p className="text-white/55 text-sm mb-8 font-['Anton'] uppercase tracking-wider">Your Shillong adventure is booked</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 sm:p-6 text-left mb-4"
      >
        <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-3 border-b border-white/5 pb-2">Booking Details</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Booking ID</span>
            <span className="text-orange-500 font-['Anton'] text-sm tracking-wider font-mono">{booking.id}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Circuit</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.circuitName || booking.circuitId}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Name</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.name}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Phone</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Status</span>
            <span className="text-yellow-400 font-['Anton'] text-sm uppercase tracking-wider">{booking.status}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-5 sm:p-6 text-left mb-8"
      >
        <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-4 border-b border-orange-500/20 pb-2">PAYMENT RECEIPT</p>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-orange-500/15">
            <div>
              <p className="text-white font-['Anton'] text-sm tracking-wider">
                  <span className="text-orange-500 mr-1">1.</span>Booking Fee
                  </p>
                  <p className="text-white/40 text-[11px] font-mono">Platform, booking system &amp; support</p>
            </div>
            <span className="text-orange-500 font-['Anton']">{fmt(p.ownerFee)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <p className="text-white font-['Anton'] text-sm tracking-wider">
                <span className="text-white/40 mr-1">2.</span>Rider Cost
              </p>
              <p className="text-white/40 text-[11px] font-mono">Your personal guide</p>
            </div>
            <span className="text-white font-['Anton']">{fmt(p.riderFee)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div>
              <p className="text-white font-['Anton'] text-sm tracking-wider">
                <span className="text-white/40 mr-1">3.</span>Fuel Cost
              </p>
              <p className="text-white/40 text-[11px] font-mono">{p.routeDistance} km travelled</p>
            </div>
            <span className="text-white font-['Anton']">{fmt(p.fuelCost)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 mt-3 border-t-2 border-orange-500/20">
          <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
          <span className="font-['Anton'] text-orange-500 text-lg tracking-wider">{fmt(p.total)}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-white/10 text-center">
          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">THANK YOU — RIDE SAFE</p>
        </div>
      </motion.div>

      <p className="text-white/55 text-sm mb-8 max-w-sm mx-auto leading-relaxed font-['Anton'] uppercase tracking-wider text-xs">
        A confirmation has been sent to our team. Your guide will be assigned shortly.
        Payment is collected after the ride.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => { reset(); navigate('/'); }}
          className="glass-btn-primary px-10 sm:px-12 py-4 sm:py-5 text-base tracking-widest inline-block"
        >
          Book Another Tour
        </button>
        <button
          onClick={() => navigate('/my-bookings')}
          className="px-10 sm:px-12 py-4 sm:py-5 text-base tracking-widest inline-block glass-btn"
        >
          View My Bookings
        </button>
      </div>
    </motion.div>
  );
}