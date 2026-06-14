import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';

function AnimatedPriceDisplay({ value }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useState(() => {
    if (!started) {
      setStarted(true);
      const duration = 800;
      const start = performance.now();
      const frame = requestAnimationFrame(function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      });
    }
  });

  return <span>₹{display.toLocaleString('en-IN')}</span>;
}

function RevealId({ id }) {
  const [revealed, setRevealed] = useState('');
  useState(() => {
    if (!id) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealed(id.slice(0, i));
      if (i >= id.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  });

  return (
    <span className="text-primary font-anton text-sm tracking-wider">
      {revealed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-primary/50"
      >|</motion.span>
    </span>
  );
}

export default function Confirmed() {
  const navigate = useNavigate();
  const { booking, reset } = useBooking();

  if (!booking) {
    return (
      <BookingPageLayout>
        <div className="neo-card p-12 text-center max-w-lg mx-auto">
          <p className="text-text-muted font-anton text-xl mb-6">No booking found.</p>
          <button
            onClick={() => { reset(); navigate('/'); }}
            className="neo-btn-primary px-8 py-4"
          >
            Book a Tour
          </button>
        </div>
      </BookingPageLayout>
    );
  }

  const isPremium = booking.bookingType === 'premium';
  const p = booking.priceBreakdown;

  return (
    <BookingPageLayout>
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="w-28 h-28 mx-auto mb-6"
        >
          <div className="w-full h-full flex items-center justify-center border-4 border-success bg-success/10 shadow-neo">
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          </div>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
          className="inline-flex items-center px-6 py-2 mx-auto mb-4 neo-card bg-primary"
        >
          <span className="font-anton text-black text-sm uppercase tracking-[0.15em]">
            {isPremium ? 'PREMIUM CONFIRMED' : 'ADVENTURE CONFIRMED'}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-anton text-3xl sm:text-4xl text-text-primary uppercase mb-3"
        >
          {isPremium ? 'Your Premium Experience Is Set!' : 'Your Adventure Is Set!'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-text-secondary text-sm mb-6 max-w-sm mx-auto leading-relaxed"
        >
          {isPremium
            ? 'Pack your bags — your premium Meghalaya experience awaits.'
            : 'Pack your bags — your ShillongRide adventure awaits.'}
        </motion.p>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="neo-card p-6 sm:p-7 text-left mb-4"
        >
          <p className="font-anton text-text-muted text-[10px] uppercase tracking-wider mb-3 border-b-3 border-border pb-2">
            Booking Details
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-text-muted font-anton text-xs uppercase tracking-wider">Booking ID</span>
              <RevealId id={booking.id} />
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-text-muted font-anton text-xs uppercase tracking-wider">Package</span>
              <span className="text-text-primary font-anton text-sm tracking-wider">{isPremium ? 'Premium' : 'Standard'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-text-muted font-anton text-xs uppercase tracking-wider">Circuit</span>
              <span className="text-text-primary font-anton text-sm tracking-wider">{booking.circuitName}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-text-muted font-anton text-xs uppercase tracking-wider">Name</span>
              <span className="text-text-primary font-anton text-sm tracking-wider">{booking.name}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-text-muted font-anton text-xs uppercase tracking-wider">Phone</span>
              <span className="text-text-primary font-anton text-sm tracking-wider">{booking.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="neo-card p-6 sm:p-7 text-left mb-8"
        >
          <p className="font-anton text-text-muted text-[10px] uppercase tracking-wider mb-4 border-b-3 border-primary/20 pb-2">
            {isPremium ? 'PREMIUM RECEIPT' : 'PAYMENT RECEIPT'}
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1.5 border-b border-border/50">
              <span className="text-text-muted font-anton text-xs">Total</span>
              <span className="font-anton text-2xl text-primary">
                <AnimatedPriceDisplay value={p?.total || p?.groupTotal || 0} />
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t-3 border-dashed border-border text-center">
            <p className="text-text-muted/50 text-[10px] font-anton uppercase tracking-widest">
              PACK YOUR BAGS — YOUR ADVENTURE AWAITS
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-text-muted text-xs mb-8 max-w-sm mx-auto leading-relaxed"
        >
          Payment is collected after the ride — cash or UPI. A confirmation has been sent to our team. 
          We are a small Shillong startup, and every booking means the world to us.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { reset(); navigate('/'); }}
            className="neo-btn-primary px-8 sm:px-12 py-4 text-base tracking-widest"
          >
            Book Another Tour
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/my-bookings')}
            className="neo-btn px-8 sm:px-12 py-4 text-base tracking-widest"
          >
            View My Bookings
          </motion.button>
        </div>
      </div>
    </BookingPageLayout>
  );
}
