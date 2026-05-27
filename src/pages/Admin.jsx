import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { fetchAllBookings } from '../engines/bookingSyncService';
import ImageUploader from '../components/ImageUploader';
import places from '../data/places.json';

export default function Admin() {
  const { bookings: localBookings, updateBookingStatus } = useBooking();
  const [sharedBookings, setSharedBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [syncState, setSyncState] = useState('loading');
  const [tab, setTab] = useState('bookings');

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    fetchAllBookings().then(shared => {
      setSharedBookings(shared);
      setSyncState(token ? 'synced' : 'token_missing');
    }).catch(() => {
      setSyncState('error');
    });
  }, []);

  const seen = new Set();
  const allBookings = [...sharedBookings, ...localBookings].filter(b => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  const filtered = filter === 'all' ? allBookings : allBookings.filter(b => b.status === filter);
  const getPlaceName = (id) => places.find(p => p.id === id)?.name || id;

  const tabs = [
    { id: 'bookings', label: 'Bookings' },
    { id: 'images', label: 'Images' },
  ];

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-5xl font-black text-white">Admin Panel</h1>
            <span className={'px-2 py-0.5 text-[10px] font-bold uppercase rounded ' + (
              syncState === 'loading' ? 'bg-yellow-500/20 text-yellow-400' :
              syncState === 'synced' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            )}>
              {syncState === 'loading' ? 'Connecting...' :
               syncState === 'synced' ? `Synced (${sharedBookings.length} remote)` :
               syncState === 'token_missing' ? 'Token not set' :
               'Sync error'}
            </span>
          </div>
          <p className="text-white/60 mb-6">
            {syncState === 'synced'
              ? `Showing ${allBookings.length} booking(s) across all devices`
              : syncState === 'token_missing'
                ? 'VITE_GITHUB_TOKEN not set — only local. Add to .env or deploy secrets.'
                : syncState === 'loading'
                  ? 'Fetching shared bookings...'
                  : 'Failed to fetch shared bookings. Check token and network.'}
          </p>
        </motion.div>

        <div className="flex gap-1 mb-8 border-b border-white/10">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={'px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-[1px] ' + (
                tab === t.id
                  ? 'text-amber-400 border-amber-400'
                  : 'text-white/40 border-transparent hover:text-white/70'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['all', 'pending', 'assigned', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={'px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ' + (
                    filter === status
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 text-lg">No bookings found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                      className="w-full p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-amber-400 font-bold text-sm">{booking.id}</span>
                          <span className={'px-2 py-0.5 rounded text-xs font-bold capitalize ' + (
                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-white font-semibold">{booking.name}</p>
                        <p className="text-white/50 text-sm">{booking.phone}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-amber-400 font-bold">₹{booking.priceBreakdown.total}</p>
                        <p className="text-white/40 text-xs">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </button>

                    {expandedId === booking.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="border-t border-white/10 px-4 sm:px-6 py-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div><p className="text-white/50 text-xs mb-1">Circuit</p><p className="text-white font-semibold">{booking.circuitName || booking.circuitId}</p></div>
                          <div><p className="text-white/50 text-xs mb-1">Pickup Time</p><p className="text-white font-semibold">{booking.timeSlot || 'Scheduled post-booking'}</p></div>
                          <div><p className="text-white/50 text-xs mb-1">Pickup Location</p><p className="text-white font-semibold">{booking.pickupLocation || 'Shillong'}</p></div>
                          <div><p className="text-white/50 text-xs mb-1">Spots</p><p className="text-white font-semibold">{booking.spots.map(getPlaceName).join(', ')}</p></div>
                          <div><p className="text-white/50 text-xs mb-1">Route Distance</p><p className="text-white font-semibold">{booking.priceBreakdown.routeDistance} km</p></div>
                          <div><p className="text-white/50 text-xs mb-1">Vehicle</p><p className="text-white font-semibold uppercase">{booking.vehicleType || 'bike'}</p></div>
                        </div>
                        <div className="mb-4"><p className="text-white/50 text-xs mb-1">Full Route</p><p className="text-white/80 text-sm">{booking.route.map(id => getPlaceName(id) || id).join(' → ')}</p></div>
                        <div className="space-y-2 pb-3 border-b border-amber-400/20 mb-3">
                          <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Breakdown</p>
                          <div className="flex justify-between text-xs"><span className="text-white/60">Platform Fee</span><span className="text-amber-400 font-extrabold">₹{booking.priceBreakdown.ownerFee}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-white/60">Rider Cost</span><span className="text-white font-bold">₹{booking.priceBreakdown.riderFee}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-white/60">Fuel Cost</span><span className="text-white font-bold">₹{booking.priceBreakdown.fuelCost}</span></div>
                        </div>
                        <div className="flex justify-between items-center"><span className="text-white font-extrabold">Total</span><span className="text-amber-400 font-extrabold">₹{booking.priceBreakdown.total}</span></div>
                        {booking.notes && <div className="mb-4 mt-3"><p className="text-white/50 text-xs mb-1">Notes</p><p className="text-white/70 text-sm">{booking.notes}</p></div>}
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-white/50 text-xs mb-2">Update Status</p>
                          <div className="flex flex-wrap gap-2">
                            {['pending', 'assigned', 'completed'].map(status => (
                              <button key={status} onClick={() => updateBookingStatus(booking.id, status)}
                                className={'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ' + (booking.status === status ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20')}>
                                {status}
                              </button>
                            ))}
                          </div>
                          {booking.status !== 'completed' && (
                            <div className="mt-3">
                              <p className="text-white/50 text-xs mb-2">Assign Rider</p>
                              <input type="text" placeholder="Rider name..."
                                className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.target.value.trim()) {
                                    updateBookingStatus(booking.id, 'assigned', e.target.value.trim());
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'images' && <ImageUploader />}
      </div>
    </div>
  );
}
