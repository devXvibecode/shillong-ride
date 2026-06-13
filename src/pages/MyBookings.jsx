import { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';

export default function MyBookings() {
  const { bookings, loading, error } = useBooking();

  useEffect(() => {
    // In a real app, this would fetch from localStorage or API
    // For demo, we'll use mock data
    if (!bookings || bookings.length === 0) {
      const mockBookings = [
        {
          id: 1,
          placeName: 'Living Root Bridge Trek',
          date: '2026-06-20',
          travelers: 2,
          specialRequests: 'Vegetarian meals preferred',
          status: 'confirmed',
          price: 4500
        },
        {
          id: 2,
          placeName: 'Dawki Boat Ride',
          date: '2026-07-05',
          travelers: 4,
          specialRequests: '',
          status: 'pending',
          price: 3200
        }
      ];
      // Normally we would set this via context, but for demo we'll just use it directly
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary-transparent rounded-full animate-spin"></div>
            <p className="mt-4 body-md text-text-secondary">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="container py-12">
          <div className="bg-surface rounded-xl shadow-md">
            <div className="p-6">
              <h2 className="h2 font-serif text-text-primary mb-4">
                Something Went Wrong
              </h2>
              <p className="body-md text-text-secondary">
                We're having trouble loading your bookings. Please try again later.
              </p>
              <Link to="/" className="btn btn-outline btn-md mt-6">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="container py-12">
          <div className="text-center">
            <h2 className="h2 font-serif text-text-primary mb-6">
              No Bookings Yet
            </h2>
            <p className="body-lg text-text-secondary max-w-xl mx-auto mb-8">
              You haven't made any bookings yet. Start planning your first adventure to Meghalaya!
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      <div className="container py-12">
        <div className="mb-8">
          <h2 className="h2 font-serif text-text-primary mb-4">
            Your Bookings
          </h2>
          <p className="body-md text-text-secondary">
            Manage your upcoming and past adventures with Shillong Ride.
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-surface rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="h4 font-semibold text-text-primary">{booking.placeName}</h3>
                  <span className={`badge badge-${
                    booking.status === 'confirmed' ? 'success' :
                      booking.status === 'pending' ? 'warning' :
                        'error'
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-text-muted">
                  <div>
                    <span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Travelers:</span> {booking.travelers}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> ₹{booking.price.toLocaleString()}
                  </div>
                </div>
                {booking.specialRequests && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Special Requests:</p>
                    <p className="body-sm text-text-secondary">{booking.specialRequests}</p>
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <Link to={`/booking/${booking.id}`} className="btn btn-outline btn-sm">
                      View Details
                    </Link>
                    {booking.status === 'confirmed' && (
                      <button className="btn btn-secondary btn-sm">
                        Download Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
