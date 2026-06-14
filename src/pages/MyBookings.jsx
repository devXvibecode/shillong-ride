import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import RetroWindow from '../components/RetroWindow';
import { IconFolder } from '../components/icons/PixelIcons';

const MOCK_BOOKINGS = [
  { id: 'MOCK-001', placeName: 'Living Root Bridge Trek', date: '2026-06-20', travelers: 2, specialRequests: 'Vegetarian meals preferred', status: 'confirmed', price: 4500 },
  { id: 'MOCK-002', placeName: 'Dawki Boat Ride', date: '2026-07-05', travelers: 4, specialRequests: '', status: 'pending', price: 3200 },
  { id: 'MOCK-003', placeName: 'Sohra Waterfalls', date: '2026-05-10', travelers: 1, specialRequests: 'Early morning pickup', status: 'cancelled', price: 2800 },
];

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

  const statusColor = (status) => {
    const colors = { confirmed: 'var(--color-pine)', pending: '#CC8800', cancelled: 'var(--color-error)' };
    return colors[status] || 'var(--color-gray)';
  };

  return (
    <div className="booking-page">
      <RetroWindow
        title="Booking Manager"
        icon={<IconFolder size={16} />}
        footer={<span style={{ fontSize: 10 }}>Total: {bookings.length} booking(s)</span>}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Anton', sans-serif" }}>
            Your Bookings
          </h2>
          <Link to="/booking" className="retro-btn retro-btn-sm">+ New Booking</Link>
        </div>

        {(!bookings || bookings.length === 0) ? (
          <div className="retro-card" style={{ textAlign: 'center', padding: 32 }}>
            <IconFolder size={36} style={{ margin: '0 auto 8px', display: 'block', color: 'var(--color-gray-light)' }} />
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No Bookings Yet</div>
            <div style={{ fontSize: 10, color: 'var(--color-gray)', marginBottom: 12 }}>
              Start planning your first adventure to Meghalaya!
            </div>
            <Link to="/" className="retro-btn retro-btn-primary">Explore Destinations</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="retro-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id || i}>
                    <td style={{ fontSize: 9 }}>{b.id}</td>
                    <td style={{ fontWeight: 700 }}>{b.placeName || b.circuitName || 'Adventure'}</td>
                    <td style={{ fontSize: 10 }}>{new Date(b.date || Date.now()).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontWeight: 700 }}>₹{(b.price || b.total || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className="retro-badge" style={{
                        background: statusColor(b.status),
                        color: 'white', fontSize: 6,
                        borderColor: 'var(--color-black)',
                      }}>
                        {b.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <button className="retro-btn retro-btn-sm" style={{ fontSize: 8, padding: '2px 6px' }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </RetroWindow>
    </div>
  );
}
