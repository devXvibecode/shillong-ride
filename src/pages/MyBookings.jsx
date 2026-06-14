import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

const MOCK_BOOKINGS = [
  {
    id: 'MOCK-001',
    placeName: 'Living Root Bridge Trek',
    date: '2026-06-20',
    travelers: 2,
    specialRequests: 'Vegetarian meals preferred',
    status: 'confirmed',
    price: 4500,
  },
  {
    id: 'MOCK-002',
    placeName: 'Dawki Boat Ride',
    date: '2026-07-05',
    travelers: 4,
    specialRequests: '',
    status: 'pending',
    price: 3200,
  },
];

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-success/10 border-success/30 text-success',
    pending: 'bg-primary/10 border-primary/30 text-primary',
    cancelled: 'bg-error/10 border-error/30 text-error',
  };

  return (
    <span className={`px-3 py-1 rounded-lg border-2 text-[10px] font-anton uppercase tracking-wider ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

export default function MyBookings() {
  const { bookings: contextBookings, loading, error } = useBooking();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (contextBookings && contextBookings.length > 0) {
      setBookings(contextBookings);
    } else {
      setBookings(MOCK_BOOKINGS);
    }
  }, [contextBookings]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted font-anton text-sm tracking-wider">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="neo-card p-8 text-center max-w-lg mx-auto">
            <h2 className="font-anton text-2xl text-text-primary mb-4">Something Went Wrong</h2>
            <p className="text-text-muted text-sm mb-6">We're having trouble loading your bookings. Please try again later.</p>
            <Link to="/" className="neo-btn-primary px-8 py-3 text-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="neo-card p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-lighter border-2 border-border flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h2 className="font-anton text-2xl text-text-primary mb-3">No Bookings Yet</h2>
            <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
              You haven't made any bookings yet. Start planning your first adventure to Meghalaya!
            </p>
            <Link to="/" className="neo-btn-primary px-8 py-3 text-sm">
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-anton text-4xl sm:text-5xl text-text-primary mb-3 uppercase">
            Your Bookings
          </h2>
          <p className="text-text-muted text-sm">
            Manage your upcoming and past adventures with Shillong Ride.
          </p>
        </motion.div>

        <div className="space-y-5">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="neo-card overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                  <div>
                    <h3 className="font-anton text-2xl text-text-primary">{booking.placeName || booking.circuitName || 'Adventure'}</h3>
                    <p className="text-text-muted text-xs font-anton uppercase tracking-wider mt-1">
                      ID: {booking.id}
                    </p>
                  </div>
                  <StatusBadge status={booking.status || 'pending'} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  <div>
                    <p className="text-text-muted text-[10px] font-anton uppercase tracking-wider mb-1">Date</p>
                    <p className="text-text-primary font-anton text-sm">{new Date(booking.date || Date.now()).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] font-anton uppercase tracking-wider mb-1">Travelers</p>
                    <p className="text-text-primary font-anton text-sm">{booking.travelers || booking.groupSize || 1}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] font-anton uppercase tracking-wider mb-1">Price</p>
                    <p className="text-text-primary font-anton text-sm">₹{(booking.price || booking.total || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] font-anton uppercase tracking-wider mb-1">Type</p>
                    <p className="text-text-primary font-anton text-sm uppercase">{booking.bookingType || 'Standard'}</p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mb-5 p-4 bg-surface-lighter rounded-lg border border-border">
                    <p className="text-text-muted text-[10px] font-anton uppercase tracking-wider mb-1">Special Requests</p>
                    <p className="text-text-secondary text-sm">{booking.specialRequests}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t-3 border-border">
                  <button className="neo-btn px-5 py-2.5 text-xs">
                    View Details
                  </button>
                  {booking.status === 'confirmed' && (
                    <button className="neo-btn-primary px-5 py-2.5 text-xs">
                      Download Ticket
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
