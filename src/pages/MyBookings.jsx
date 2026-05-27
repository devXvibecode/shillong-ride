import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import places from '../data/places.json';
import { fetchAllBookings, updateSingleBooking } from '../engines/bookingSyncService';
import EditSpotModal from '../components/EditSpotModal';

function loadBookings() {
  try {
    const saved = localStorage.getItem('sr_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem('sr_bookings', JSON.stringify(bookings));
}

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  approved: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  assigned: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
  completed: 'bg-green-500/20 border-green-500/30 text-green-400',
  rejected: 'bg-red-500/20 border-red-500/30 text-red-400',
  cancel_requested: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
  cancelled: 'bg-red-500/20 border-red-500/30 text-red-400',
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [localBookings, setLocalBookings] = useState(loadBookings);
  const [sharedBookings, setSharedBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    fetchAllBookings().then(shared => {
      setSharedBookings(shared);
    }).catch(() => {});
  }, []);

  const seen = new Set();
  const bookings = [...sharedBookings, ...localBookings].filter(b => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  const getPlaceName = (id) => places.find(p => p.id === id)?.name || id;

  const handleCancelRequest = async (bookingId) => {
    if (!window.confirm('Cancel this booking? An admin will review your request.')) return;
    const local = loadBookings();
    const updated = local.map(b => {
      if (b.id === bookingId) return { ...b, status: 'cancel_requested' };
      return b;
    });
    saveBookings(updated);
    setLocalBookings(updated);
    await updateSingleBooking(bookingId, { status: 'cancel_requested' });
  };

  const handleEditSave = async (updatedBooking) => {
    const local = loadBookings();
    const updated = local.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    saveBookings(updated);
    setLocalBookings(updated);
    setEditingBooking(null);
    await updateSingleBooking(updatedBooking.id, {
      spots: updatedBooking.spots,
      route: updatedBooking.route,
      priceBreakdown: updatedBooking.priceBreakdown,
    });
  };

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 mb-3">
            <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.15em]">BULLETIN BOARD</span>
          </div>
          <h1 className="font-['Anton'] text-4xl sm:text-6xl text-white uppercase tracking-[0.02em] mb-2">My Bookings</h1>
          <p className="text-white/40 text-sm mb-8 font-['Anton'] uppercase tracking-wider">View all your ShillongRide tours</p>
        </motion.div>

        {bookings.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'pending', 'approved', 'assigned', 'completed', 'rejected', 'cancel_requested', 'cancelled'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-['Anton'] uppercase tracking-wider transition-all border-2 flex-shrink-0 ${
                  statusFilter === status
                    ? 'bg-orange-500 text-black border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border-2 border-dashed border-white/10">
            <p className="text-white/40 text-lg mb-2 font-['Anton'] uppercase tracking-wider">
              {bookings.length === 0 ? 'No bookings yet' : 'No bookings match this filter.'}
            </p>
            <p className="text-white/30 text-sm mb-6 font-['Anton'] uppercase tracking-wider">
              {bookings.length === 0 ? 'Start planning your Shillong adventure!' : 'Try a different filter.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="industrial-btn inline-block px-8 py-3 text-sm tracking-widest"
            >
              Go to Home
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[#1a1a1a] border-2 border-black grunt-border overflow-hidden shadow-[0_2px_0_0_rgba(0,0,0,0.3)]"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                  className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-orange-500 font-['Anton'] text-xs sm:text-sm tracking-wider">{booking.id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-['Anton'] uppercase tracking-wider border-2 ${STATUS_COLORS[booking.status] || 'border-white/10 text-white/50'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{booking.name}</p>
                    <p className="text-white/40 text-xs font-['Anton'] uppercase tracking-wider">
                      {booking.circuitName || 'TOUR'} · {booking.spotNames ? booking.spotNames.join(', ') : `${booking.spots.length} SPOT(S)`}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex sm:block items-center gap-4 sm:gap-0">
                    {booking.rider && (
                      <p className="text-white/40 text-xs font-['Anton'] uppercase tracking-wider sm:mb-1">
                        RIDER: <span className="text-white">{booking.rider}</span>
                      </p>
                    )}
                    <p className="text-orange-500 font-['Anton']">₹{booking.priceBreakdown.total}</p>
                    <p className="text-white/20 text-[10px] font-mono">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>

                {expandedId === booking.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t-2 border-black px-4 sm:px-5 py-4 bg-[#141414]"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Circuit</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{booking.circuitName || booking.circuitId}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Pickup Time</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{booking.timeSlot ? booking.timeSlot : 'Pending — will be scheduled after booking'}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Pickup Location</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{booking.pickupLocation || 'Shillong'}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Route Distance</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{booking.priceBreakdown.routeDistance} KM</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Spots</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider">{(booking.spotNames || booking.spots.map(getPlaceName)).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-0.5">Vehicle</p>
                        <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider uppercase">{(booking.vehicleType || 'bike')}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pb-3 border-b-2 border-orange-500/20 mb-3">
                      <p className="text-orange-500 text-[10px] font-['Anton'] uppercase tracking-wider mb-2">BREAKDOWN</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-white/50 font-['Anton'] uppercase tracking-wider">Processing &amp; Platform Fee</span>
                          <p className="text-white/25 text-[10px] font-mono">Platform, booking system &amp; support</p>
                        </div>
                        <span className="text-orange-500 font-['Anton']">₹{booking.priceBreakdown.ownerFee || booking.priceBreakdown.processingCharge}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50 font-['Anton'] uppercase tracking-wider">Rider Cost</span>
                        <span className="text-white font-['Anton']">₹{booking.priceBreakdown.riderFee || booking.priceBreakdown.spotCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50 font-['Anton'] uppercase tracking-wider">Fuel Cost</span>
                        <span className="text-white font-['Anton']">₹{booking.priceBreakdown.fuelCost}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-['Anton'] tracking-wider">TOTAL</span>
                      <span className="text-orange-500 font-['Anton']">₹{booking.priceBreakdown.total}</span>
                    </div>

                    {booking.route && (
                      <div className="mt-4 pt-3 border-t-2 border-white/5">
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Full Route</p>
                        <p className="text-white/60 text-xs font-mono">
                          {(booking.routeNames || booking.route.map(id => getPlaceName(id) || id)).join(' → ')}
                        </p>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="mt-3">
                        <p className="text-white/30 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-white/50 text-xs">{booking.notes}</p>
                      </div>
                    )}

                    {booking.status === 'rejected' && (
                      <div className="mt-3 px-3 py-2 bg-red-500/10 border-2 border-red-500/20">
                        <p className="text-red-400 text-[11px] font-['Anton'] uppercase tracking-wider">This booking was not approved.</p>
                      </div>
                    )}

                    {booking.status === 'cancel_requested' && (
                      <div className="mt-3 px-3 py-2 bg-orange-500/10 border-2 border-orange-500/20">
                        <p className="text-orange-400 text-[11px] font-['Anton'] uppercase tracking-wider">Cancellation requested — awaiting admin approval.</p>
                      </div>
                    )}

                    {booking.status === 'cancelled' && (
                      <div className="mt-3 px-3 py-2 bg-red-500/10 border-2 border-red-500/20">
                        <p className="text-red-400 text-[11px] font-['Anton'] uppercase tracking-wider">This booking has been cancelled.</p>
                      </div>
                    )}

                    {(booking.status === 'pending' || booking.status === 'approved') && (
                      <div className="mt-4 pt-3 border-t-2 border-white/5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingBooking(booking)}
                          className="px-4 py-2 text-[11px] font-['Anton'] uppercase tracking-wider bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all"
                        >
                          Edit Spots
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(booking.id)}
                          className="px-4 py-2 text-[11px] font-['Anton'] uppercase tracking-wider bg-red-500/20 border-2 border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          Request Cancellation
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {editingBooking && (
        <EditSpotModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
