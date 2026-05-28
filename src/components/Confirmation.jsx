import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function AnimatedPrice({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (display === value) return;
    const duration = 800;
    const start = performance.now();
    let frame;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{fmt(display)}</span>;
}

function RevealId({ id }) {
  const [revealed, setRevealed] = useState('');
  useEffect(() => {
    if (!id) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealed(id.slice(0, i));
      if (i >= id.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <span className="text-orange-500 font-['Anton'] text-sm tracking-wider font-mono">
      {revealed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-orange-500/50"
      >|</motion.span>
    </span>
  );
}

export default function Confirmation() {
  const navigate = useNavigate();
  const { booking, reset } = useBooking();

  if (!booking) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-[#2e2e44] rounded-xl">
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
      className="max-w-lg mx-auto text-center px-4 sm:px-0"
      role="status"
      aria-live="polite"
    >
      <div className="h-10" />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
        className="w-28 h-28 mx-auto mb-6"
      >
        <div className="w-full h-full flex items-center justify-center border-4 border-green-600/60 rounded-xl bg-green-900/15">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        className="inline-flex items-center px-5 py-2 mx-auto mb-4 border-2 border-green-500/30 rounded-lg bg-green-500/10"
      >
        <span className="font-['Anton'] text-green-400 text-sm uppercase tracking-[0.15em]">ADVENTURE CONFIRMED</span>
      </motion.div>

      <h2 className="font-['Anton'] text-3xl sm:text-4xl text-white uppercase tracking-[0.02em] mb-3">Your Adventure Is Set!</h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 text-sm mb-6 max-w-sm mx-auto leading-relaxed"
      >
        Pack your bags — your ShillongRide adventure awaits. Your spots are locked in and we will reach out shortly to coordinate your pickup.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="brut-card p-6 sm:p-7 text-left mb-4"
      >
        <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-3 border-b-2 border-[#2e2e44] pb-2">Booking Details</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Booking ID</span>
            <RevealId id={booking.id} />
          </div>
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Circuit</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.circuitName || booking.circuitId}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Name</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.name}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Phone</span>
            <span className="text-white font-['Anton'] text-sm tracking-wider">{booking.phone}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="brut-card p-6 sm:p-7 text-left mb-8"
      >
        <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-4 border-b-2 border-orange-500/20 pb-2">PAYMENT RECEIPT</p>

        <div className="space-y-3">
          {/* Service Cost section */}
          <div className="pb-1">
            <div className="flex justify-between items-center py-1 mb-1">
              <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em]">SERVICE COST</p>
              <span className="font-['Anton'] text-orange-500 text-sm">{fmt(p.serviceTotal)}</span>
            </div>
            {Object.entries(p.serviceBreakdown).map(([key, svc], i) => (
              <div key={key} className="flex justify-between items-center py-1 border-b-2 border-[#2e2e44]">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Anton'] text-white/50 text-xs italic">{['i', 'ii', 'iii', 'iv'][i]}.</span>
                  <div>
                    <p className="font-['Anton'] text-xs sm:text-sm tracking-wider text-white/80">{svc.label}</p>
                    <p className="text-white/35 text-[9px] sm:text-[10px] font-mono">{svc.desc}</p>
                  </div>
                </div>
                <span className="font-['Anton'] text-xs sm:text-base text-white">{fmt(svc.amount)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <div>
              <p className="font-['Anton'] text-sm tracking-wider text-white/90">Rider Cost</p>
              <p className="text-white/40 text-[11px] font-mono">Your personal guide — accompanies you throughout the trip</p>
            </div>
            <span className="font-['Anton'] text-base text-orange-500">{fmt(p.riderFee)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <div>
              <p className="font-['Anton'] text-sm tracking-wider text-white/90">Fuel Cost</p>
              <p className="text-white/40 text-[11px] font-mono">Calculated at ₹10/km for {p.routeDistance} km round trip</p>
            </div>
            <span className="font-['Anton'] text-base text-orange-500">{fmt(p.fuelCost)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 mt-3 border-t-2 border-orange-500/20">
          <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
          <span className="font-['Anton'] text-white text-2xl tracking-wider">
            <AnimatedPrice value={p.total} />
          </span>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#2e2e44] text-center">
          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">PACK YOUR BAGS — YOUR ADVENTURE AWAITS</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/50 text-xs mb-8 max-w-sm mx-auto leading-relaxed"
      >
        Payment is collected after the ride — cash or UPI. A confirmation has been sent to our team and your guide will be assigned shortly. We are a small Shillong startup, and every booking means the world to us.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => { reset(); navigate('/'); }}
          className="brut-btn-primary px-10 sm:px-12 py-4 sm:py-5 text-base tracking-widest inline-block btn-bounce"
        >
          Book Another Tour
        </button>
        <button
          onClick={() => navigate('/my-bookings')}
          className="px-10 sm:px-12 py-4 sm:py-5 text-base tracking-widest inline-block brut-btn"
        >
          View My Bookings
        </button>
      </div>
    </motion.div>
  );
}
