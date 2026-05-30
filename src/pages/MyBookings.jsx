import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function loadBookings() {
  try {
    const saved = localStorage.getItem('sr_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookings(loadBookings());
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen px-5 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-['Anton'] text-4xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-2">My Bookings</h1>
          <p className="text-white/55 text-sm">Your booking history with ShillongRide.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="brut-card p-6 space-y-3">
                  <div className="h-4 skeleton w-1/3" />
                  <div className="h-3 skeleton w-2/3" />
                  <div className="h-3 skeleton w-1/2" />
                </div>
              ))}
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 border-2 border-dashed border-[#2e2e44] rounded-xl"
            >
              <p className="text-white/55 text-lg font-['Anton'] uppercase tracking-wider mb-2">No bookings yet</p>
              <p className="text-white/40 text-sm mb-6">Book your first Shillong adventure to see it here.</p>
              <Link to="/booking" className="brut-btn-primary inline-block px-8 py-3 text-sm tracking-widest uppercase">
                Book Now
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {bookings.map(b => {
                const isCancelled = b.status === 'canceled' || b.status === 'cancelled';
                return (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="brut-card p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">Booking ID</p>
                        <p className="text-orange-500 font-['Anton'] text-sm tracking-wider font-mono">{b.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-['Anton'] uppercase tracking-wider border-2 ${
                        isCancelled
                          ? 'border-red-500/30 bg-red-500/10 text-red-400'
                          : 'border-green-500/30 bg-green-500/10 text-green-400'
                      }`}>
                        {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">Circuit</p>
                        <p className="text-white font-['Bebas_Neue'] text-base tracking-wider">{b.circuitName || b.circuitId}</p>
                      </div>
                      <div>
                        <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">Spots</p>
                        <p className="text-white font-['Bebas_Neue'] text-base tracking-wider">{b.spotNames?.length || b.spots?.length || 0} selected</p>
                      </div>
                      <div>
                        <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">Total</p>
                        <p className="text-orange-500 font-['Anton'] text-base tracking-wider">{fmt((b.priceBreakdown?.groupTotal || b.priceBreakdown?.total) || 0)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
