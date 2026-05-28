import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaces } from '../engines/dataService';
import { fetchAllBookings, updateSingleBooking, deleteBooking } from '../engines/bookingSyncService';
import { fetchFileFromGitHub } from '../engines/adminSyncService';
import ImageUploader from '../components/ImageUploader';
import CircuitEditor from '../components/CircuitEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import circuitsData from '../data/circuits.json';
import placesData from '../data/places.json';

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ── Toast ── */

function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onDone(), 3500);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-[100] max-w-sm px-5 py-3 rounded-xl border-2 shadow-xl flex items-center gap-3 ${
        toast.type === 'success' ? 'bg-green-900/90 border-green-500/40 text-green-300' :
        toast.type === 'error' ? 'bg-red-900/90 border-red-500/40 text-red-300' :
        'bg-[#1e1e2b] border-white/20 text-white'
      }`}
    >
      {toast.type === 'success' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      )}
      {toast.type === 'error' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
      )}
      <p className="text-sm font-medium">{toast.message}</p>
    </motion.div>
  );
}

/* ── Animated counter ── */

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (display === value) return;
    const duration = 600;
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
  return <span>{display}</span>;
}

/* ── BookingsView with filters & sort ── */

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const DATE_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'today', label: 'Today' },
];

function BookingsView({ bookings, places, exportCSV, onUpdateStatus, onDeleteBooking }) {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    let result = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const now = Date.now();
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      result = result.filter(b => new Date(b.createdAt).toDateString() === today);
    } else if (dateFilter === '7days') {
      const cutoff = now - 7 * 86400000;
      result = result.filter(b => new Date(b.createdAt).getTime() >= cutoff);
    } else if (dateFilter === '30days') {
      const cutoff = now - 30 * 86400000;
      result = result.filter(b => new Date(b.createdAt).getTime() >= cutoff);
    }
    result.sort((a, b) =>
      sortBy === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return result;
  }, [bookings, filter, dateFilter, sortBy]);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    assigned: bookings.filter(b => b.status === 'assigned').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    cancel_requested: bookings.filter(b => b.status === 'cancel_requested').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  const statList = useMemo(() => [
    { label: 'Total', value: stats.total, color: 'text-white' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
    { label: 'Approved', value: stats.approved, color: 'text-blue-400' },
    { label: 'Assigned', value: stats.assigned, color: 'text-purple-400' },
    { label: 'Completed', value: stats.completed, color: 'text-green-400' },
    { label: 'Cancellation', value: stats.cancel_requested, color: 'text-orange-400' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
    { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
  ], [stats]);

  const updateStatus = useCallback((bookingId, newStatus, rider) => {
    const stored = loadBookings();
    const updated = stored.map(b => {
      if (b.id === bookingId) return { ...b, status: newStatus, rider: rider || b.rider };
      return b;
    });
    saveBookings(updated);
    if (onUpdateStatus) onUpdateStatus(bookingId, newStatus, rider);
  }, [onUpdateStatus]);

  const getPlaceName = useCallback((id) => places.find(p => p.id === id)?.name || id, [places]);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mb-6">
          {statList.map(s => (
            <div key={s.label} className="brut-card p-3 sm:p-4 text-center">
              <p className={`text-xl sm:text-3xl font-black ${s.color}`}>
                <AnimatedCount value={s.value} />
              </p>
              <p className="text-white/55 text-[10px] sm:text-xs mt-0.5 capitalize">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-2 overflow-x-auto flex-1 min-w-0">
          {['all', 'pending', 'approved', 'assigned', 'completed', 'cancel_requested', 'cancelled', 'rejected'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all flex-shrink-0 ${
                filter === status ? 'bg-amber-400 text-black' : 'brut-btn'
              }`}
            >
              {status.replace('_', ' ')} {status !== 'all' && `(${stats[status] || 0})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {DATE_FILTERS.map(d => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDateFilter(d.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              dateFilter === d.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:text-white/70'
            }`}
          >
            {d.label}
          </button>
        ))}
        <div className="w-px h-5 bg-white/10 mx-1" />
        {SORT_OPTIONS.map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSortBy(s.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              sortBy === s.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:text-white/70'
            }`}
          >
            {s.label}
          </button>
        ))}
        <span className="text-white/30 text-[10px] font-mono ml-auto">
          {filtered.length} of {bookings.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/55 text-lg">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="brut-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 font-bold text-xs sm:text-sm">{booking.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'assigned' ? 'bg-purple-500/20 text-purple-400' :
                      booking.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      booking.status === 'cancel_requested' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm">{booking.name}</p>
                  <p className="text-white/55 text-xs">{booking.phone}</p>
                </div>
                <div className="text-left sm:text-right flex sm:block items-center gap-4 sm:gap-0">
                  {booking.rider && (
                    <p className="text-white/55 text-xs sm:mb-1">
                      Rider: <span className="text-white font-semibold">{booking.rider}</span>
                    </p>
                  )}
                  <p className="text-amber-400 font-bold">{fmt(booking.priceBreakdown.total)}</p>
                  <p className="text-white/40 text-[10px]">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </button>

              {expandedId === booking.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-white/10 px-4 sm:px-5 py-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Circuit</p>
                      <p className="text-white font-semibold text-sm">{booking.circuitName || booking.circuitId || '\u2014'}</p>
                    </div>
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Pickup Time</p>
                      <p className="text-white font-semibold text-sm">{booking.timeSlot || 'Scheduled post-booking'}</p>
                    </div>
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Pickup Location</p>
                      <p className="text-white font-semibold text-sm">{booking.pickupLocation || 'Shillong'}</p>
                    </div>
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Spots</p>
                      <p className="text-white font-semibold text-sm">{booking.spots.map(getPlaceName).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Route Distance</p>
                      <p className="text-white font-semibold text-sm">{booking.priceBreakdown.routeDistance} km</p>
                    </div>
                    <div>
                      <p className="text-white/55 text-[10px] mb-0.5">Vehicle</p>
                      <p className="text-white font-semibold text-sm uppercase">{booking.vehicleType || 'bike'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/55 text-[10px] mb-0.5">Full Route</p>
                    <p className="text-white/70 text-xs">
                      {booking.route.map(id => getPlaceName(id) || id).join(' \u2192 ')}
                    </p>
                  </div>

                  <div className="space-y-2 pb-3 border-b border-amber-400/20 mb-3">
                    <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Breakdown</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-white/55">Booking Fee</span>
                        <p className="text-white/40 text-[9px] font-mono">Platform, booking system &amp; support</p>
                      </div>
                      <span className="text-amber-400 font-extrabold">{fmt(booking.priceBreakdown.ownerFee || booking.priceBreakdown.processingCharge || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/55">Rider Cost</span>
                      <span className="text-white font-bold">{fmt(booking.priceBreakdown.riderFee || booking.priceBreakdown.spotCost || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/55">Fuel Cost</span>
                      <span className="text-white font-bold">{fmt(booking.priceBreakdown.fuelCost || 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-extrabold text-sm">Total</span>
                    <span className="text-amber-400 font-extrabold">{fmt(booking.priceBreakdown.total || 0)}</span>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 mt-3">
                      <p className="text-white/55 text-[10px] mb-0.5">Notes</p>
                      <p className="text-white/55 text-xs">{booking.notes}</p>
                    </div>
                  )}

                  {booking.emailSent === false && (
                    <div className="mb-4 mt-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-[11px] font-medium">{'\u26A0'} Email not sent — EmailJS not configured</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-white/40 text-[10px] mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateStatus(booking.id, 'approved')}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(booking.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {['approved', 'assigned', 'completed', 'cancel_requested', 'cancelled', 'rejected'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(booking.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                            booking.status === s ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    {booking.status === 'approved' && (
                      <div>
                        <p className="text-white/40 text-[10px] mb-1.5">Assign Rider</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Rider name..."
                            defaultValue={booking.rider || ''}
                            className="brut-input flex-1 max-w-xs px-3 py-1.5 text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                const target = e.target;
                                updateStatus(booking.id, 'assigned', target.value.trim());
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {booking.status === 'cancel_requested' && (
                      <div className="mt-3 pt-3 border-t border-orange-500/20">
                        <p className="text-white/40 text-[10px] mb-2">Cancellation Request</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => updateStatus(booking.id, 'cancelled')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                            Approve Cancellation
                          </button>
                          <button type="button" onClick={() => updateStatus(booking.id, 'pending')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all">
                            Deny Cancellation
                          </button>
                        </div>
                      </div>
                    )}
                    {booking.status === 'assigned' && booking.rider && (
                      <p className="text-white/50 text-[11px] mt-2">Rider: <span className="text-white font-semibold">{booking.rider}</span></p>
                    )}
                    <div className="pt-3 mt-3 border-t border-red-500/20">
                      <button
                        type="button"
                        onClick={() => onDeleteBooking(booking.id)}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                      >
                        Delete from server
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Circuit View (replaces PlacesView) ── */

function CircuitsView({ places, onCircuitEdit, onToast }) {
  const [currentPlaces, setCurrentPlaces] = useState(places);

  useEffect(() => {
    fetchFileFromGitHub('data/places.json')
      .then(data => { if (data) setCurrentPlaces(data); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-white/55 text-xs mb-6">{currentPlaces.length} places across {circuitsData.length} circuits</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circuitsData.map((circuit, i) => {
            const spotCount = circuit.spots.length;
            const totalDistance = circuit.spots.reduce((sum, id) => {
              const p = currentPlaces.find(pl => pl.id === id);
              return sum + (p?.distanceWeight || 0);
            }, 0);
            return (
              <motion.button
                key={circuit.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onCircuitEdit(circuit)}
                className="brut-card p-5 text-left group hover:border-amber-400/40 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: circuit.color }} />
                  <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-[0.15em]">{circuit.tagline}</span>
                </div>
                <h3 className="font-['Anton'] text-white text-xl tracking-wider mb-1 group-hover:text-orange-500 transition-colors">{circuit.shortName}</h3>
                <p className="text-white/55 text-xs leading-relaxed mb-4 line-clamp-2">{circuit.description}</p>
                <div className="flex items-center justify-between border-t-2 border-[#2e2e44] pt-3">
                  <span className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">
                    {spotCount} spots · {totalDistance} km
                  </span>
                  <span className="text-orange-500 font-['Anton'] text-xs uppercase tracking-wider group-hover:underline">Edit Circuit →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="brut-card p-4 mt-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-white/55 text-xs flex-1">
            Editing saves directly to GitHub and auto-deploys. Changes appear on the live site within ~2 minutes.
          </p>
          <button
            type="button"
            onClick={() => {
              fetchFileFromGitHub('data/places.json')
                .then(data => { if (data) setCurrentPlaces(data); if (onToast) onToast('Places refreshed from GitHub', 'success'); })
                .catch(() => { if (onToast) onToast('Failed to fetch latest places', 'error'); });
            }}
            className="px-3 py-1.5 brut-btn text-[10px] uppercase tracking-wider"
          >
            Refresh
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Helpers ── */

function loadBookings() {
  try {
    const saved = localStorage.getItem('sr_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveBookings(bookings) {
  localStorage.setItem('sr_bookings', JSON.stringify(bookings));
}

/* ── AdminPanel ── */

export default function AdminPanel() {
  const [tab, setTab] = useState('bookings');
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookings, setBookings] = useState(() => loadBookings());
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sharedBookings, setSharedBookings] = useState([]);
  const [syncState, setSyncState] = useState('loading');
  const [syncTimestamp, setSyncTimestamp] = useState(null);
  const [places, setPlaces] = useState(placesData);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const refreshBookings = useCallback(() => {
    setBookings(loadBookings());
    setRefreshKey(k => k + 1);
  }, []);

  const categories = useMemo(() => [...new Set(places.map(p => p.category))], [places]);

  useEffect(() => {
    getPlaces().then(setPlaces).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAllBookings().then(shared => {
      setSharedBookings(shared);
      setSyncState(import.meta.env.VITE_GITHUB_TOKEN ? 'synced' : 'token_missing');
      setSyncTimestamp(new Date().toLocaleTimeString());
    }).catch(() => {
      setSyncState('error');
      setSyncTimestamp(new Date().toLocaleTimeString());
    });
  }, [refreshKey]);

  const seen = new Set();
  const allBookings = useMemo(() =>
    [...sharedBookings, ...bookings].filter(b => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    }),
    [sharedBookings, bookings]
  );

  const handleStatusUpdate = useCallback(async (bookingId, newStatus, rider) => {
    try {
      await updateSingleBooking(bookingId, { status: newStatus, rider });
      refreshBookings();
      showToast(`Booking ${bookingId} updated to ${newStatus}`, 'success');
    } catch {
      showToast(`Failed to update ${bookingId}`, 'error');
    }
  }, [refreshBookings, showToast]);

  const handleDeleteBooking = useCallback(async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      refreshBookings();
      showToast(`Booking ${bookingId} deleted`, 'success');
    } catch {
      showToast(`Failed to delete ${bookingId}`, 'error');
    }
  }, [refreshBookings, showToast]);

  const handleManualSync = useCallback(() => {
    setSyncState('loading');
    fetchAllBookings().then(shared => {
      setSharedBookings(shared);
      setSyncState('synced');
      setSyncTimestamp(new Date().toLocaleTimeString());
      showToast('Bookings synced', 'success');
    }).catch(() => {
      setSyncState('error');
      showToast('Sync failed', 'error');
    });
  }, [showToast]);

  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Name', 'Phone', 'Circuit', 'Vehicle', 'Pickup Location', 'Spots', 'Pickup Time', 'Status', 'Rider', 'Booking Fee', 'Rider Cost', 'Fuel Cost', 'Total', 'Route Distance', 'Notes', 'Created At'];
    const rows = bookings.map(b => [
      b.id, b.name, b.phone, b.circuitName || b.circuitId || '', b.vehicleType || 'bike', b.pickupLocation || 'Shillong',
      (b.spots || []).map(id => places.find(p => p.id === id)?.name || id).join('; '),
      b.timeSlot, b.status, b.rider || '',
      String(b.priceBreakdown.ownerFee || b.priceBreakdown.processingCharge || 0),
      String(b.priceBreakdown.riderFee || b.priceBreakdown.spotCost || 0),
      String(b.priceBreakdown.fuelCost || 0),
      String(b.priceBreakdown.total || 0),
      String(b.priceBreakdown.routeDistance || 0),
      b.notes || '', b.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shillong-ride-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported', 'success');
  }, [bookings, places, showToast]);

  return (
    <div className="min-h-screen bg-[#0b0b12]">
      <AnimatePresence>
        <Toast toast={toast} onDone={() => setToast(null)} />
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
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
            <p className="text-white/55 text-sm sm:text-base mt-1">
              Manage bookings, circuits, spots, and images
              {syncTimestamp && <span className="text-white/30 ml-2 text-xs font-mono">Last synced: {syncTimestamp}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualSync}
              className="px-3 py-2 brut-btn text-xs flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              Sync
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm rounded-lg hover:bg-green-500/30 transition-all whitespace-nowrap"
            >
              Export CSV
            </button>
            <span className="text-amber-400 font-black text-xl sm:text-2xl">Shillong<span className="text-white">Ride</span></span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['bookings', 'circuits', 'images'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                tab === t ? 'bg-amber-400 text-black' : 'brut-btn'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <BookingsView
            key={refreshKey}
            bookings={allBookings}
            places={places}
            exportCSV={exportCSV}
            onUpdateStatus={handleStatusUpdate}
            onDeleteBooking={(id) => setDeleteConfirmId(id)}
          />
        )}

        {tab === 'circuits' && (
          <CircuitsView
            places={places}
            onCircuitEdit={(circuit) => setEditingCircuit(circuit)}
            onToast={(msg, type) => showToast(msg, type)}
          />
        )}

        {tab === 'images' && <ImageUploader />}
      </div>

      <ConfirmDialog
        open={!!deleteConfirmId}
        title="Delete Booking?"
        message="This will permanently remove this booking from the server. The customer's local copy will not be affected."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={async () => {
          if (deleteConfirmId) await handleDeleteBooking(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {editingCircuit && (
        <CircuitEditor
          circuit={editingCircuit}
          allPlaces={places}
          onClose={() => setEditingCircuit(null)}
          onSaved={() => showToast('Circuit saved and deployed!', 'success')}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}
    </div>
  );
}
