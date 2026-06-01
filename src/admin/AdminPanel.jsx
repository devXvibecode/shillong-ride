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
import { loadBookings, saveBookings, loadActivityLog, addActivity, loadRiders, saveRiders, loadStats, saveStats } from '../engines/storageService';

function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function fmtShort(n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }

function getRevenue(booking) {
  const pb = booking.priceBreakdown || {};
  return pb.total || pb.groupTotal || 0;
}

function getRouteDistance(booking) {
  return booking.priceBreakdown?.routeDistance || booking.routeDistance || 0;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/* ── Toast ── */
function Toast({ toast, onDone }) {
  useEffect(() => { if (!toast) return; const t = setTimeout(() => onDone(), 3500); return () => clearTimeout(t); }, [toast, onDone]);
  if (!toast) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-[100] max-w-sm px-5 py-3 rounded-xl border-2 shadow-xl flex items-center gap-3 ${
        toast.type === 'success' ? 'bg-green-900/90 border-green-500/40 text-green-300' :
        toast.type === 'error' ? 'bg-red-900/90 border-red-500/40 text-red-300' :
        'bg-[#1e1e2b] border-white/20 text-white'
      }`}
    >
      {toast.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
      {toast.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
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

/* ── Dashboard Tab ── */
function DashboardView({ bookings }) {
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const active = bookings.filter(b => b.status === 'approved' || b.status === 'assigned').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + getRevenue(b), 0);
    const paidRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + getRevenue(b), 0);
    const totalDistance = bookings.reduce((sum, b) => sum + getRouteDistance(b), 0);
    return { total, pending, active, completed, cancelled, totalRevenue, paidRevenue, totalDistance };
  }, [bookings]);

  const monthlyData = useMemo(() => {
    const months = {};
    bookings.forEach(b => {
      if (!b.createdAt) return;
      const m = new Date(b.createdAt).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      months[m] = (months[m] || 0) + getRevenue(b);
    });
    return Object.entries(months).slice(-6);
  }, [bookings]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-white' },
          { label: 'Total Revenue', value: fmtShort(stats.totalRevenue), color: 'text-green-400' },
          { label: 'Completed Trips', value: stats.completed, color: 'text-blue-400' },
          { label: 'Active/Pending', value: stats.pending + stats.active, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="brut-card p-4 text-center">
            <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="brut-card p-5">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Revenue Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Total Revenue</span>
              <span className="text-green-400 font-bold">{fmtShort(stats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Collected (completed)</span>
              <span className="text-green-400 font-bold">{fmtShort(stats.paidRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Pending Collection</span>
              <span className="text-yellow-400 font-bold">{fmtShort(stats.totalRevenue - stats.paidRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-white/60">Avg. per Booking</span>
              <span className="text-white font-bold">{stats.total > 0 ? fmtShort(Math.round(stats.totalRevenue / stats.total)) : '₹0'}</span>
            </div>
          </div>
        </div>
        <div className="brut-card p-5">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Booking Status</p>
          <div className="space-y-2">
            {[
              { label: 'Pending', value: stats.pending, color: 'text-yellow-400', pct: stats.total > 0 ? Math.round(stats.pending/stats.total*100) : 0 },
              { label: 'Approved/Active', value: stats.active, color: 'text-blue-400', pct: stats.total > 0 ? Math.round(stats.active/stats.total*100) : 0 },
              { label: 'Completed', value: stats.completed, color: 'text-green-400', pct: stats.total > 0 ? Math.round(stats.completed/stats.total*100) : 0 },
              { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400', pct: stats.total > 0 ? Math.round(stats.cancelled/stats.total*100) : 0 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={s.color}>{s.label}</span>
                  <span className="text-white/60">{s.value} ({s.pct}%)</span>
                </div>
                <div className="h-1.5 bg-[#1e1e2b] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${s.color.replace('text-', 'bg-')}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <div className="brut-card p-5">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Monthly Revenue (Last 6)</p>
          <div className="flex items-end gap-3 h-32">
            {monthlyData.map(([month, amount]) => {
              const max = Math.max(...monthlyData.map(([, a]) => a));
              const height = max > 0 ? (amount / max) * 100 : 0;
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-green-400 font-bold">{fmtShort(amount)}</span>
                  <div className="w-full rounded-t-md" style={{ height: `${height}%`, minHeight: '8px', backgroundColor: '#f97316' }} />
                  <span className="text-[9px] text-white/40">{month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Riders Tab ── */
function RidersView({ onToast }) {
  const [riders, setRiders] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => { setRiders(loadRiders()); }, []);

  const addRider = () => {
    if (!newName.trim()) return;
    const rider = { id: Date.now().toString(36), name: newName.trim(), phone: newPhone.trim(), active: true, createdAt: new Date().toISOString() };
    const updated = [...riders, rider];
    setRiders(updated);
    saveRiders(updated);
    addActivity('Rider Added', rider.name);
    setNewName(''); setNewPhone('');
    onToast?.('Rider added', 'success');
  };

  const toggleRider = (id) => {
    const updated = riders.map(r => r.id === id ? { ...r, active: !r.active } : r);
    setRiders(updated); saveRiders(updated);
    const rider = updated.find(r => r.id === id);
    addActivity(rider.active ? 'Rider Activated' : 'Rider Deactivated', rider.name);
  };

  const removeRider = (id) => {
    const updated = riders.filter(r => r.id !== id);
    const rider = riders.find(r => r.id === id);
    setRiders(updated); saveRiders(updated);
    addActivity('Rider Removed', rider?.name);
    onToast?.('Rider removed', 'success');
  };

  return (
    <div>
      <div className="brut-card p-5 mb-6">
        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Add Rider</p>
        <div className="flex gap-2">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Rider name" className="brut-input flex-1 px-3 py-2 text-sm"
            onKeyDown={e => { if (e.key === 'Enter') addRider(); }} />
          <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone (opt)" className="brut-input w-36 px-3 py-2 text-sm"
            onKeyDown={e => { if (e.key === 'Enter') addRider(); }} />
          <button type="button" onClick={addRider} className="brut-btn-primary px-4 py-2 text-xs">Add</button>
        </div>
      </div>

      <div className="space-y-2">
        {riders.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No riders yet.</div>
        ) : riders.map(r => (
          <div key={r.id} className="brut-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${r.active ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-white font-semibold text-sm">{r.name}</p>
                {r.phone && <p className="text-white/40 text-xs">{r.phone}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => toggleRider(r.id)} className={`px-3 py-1 text-[10px] rounded-lg font-bold ${r.active ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                {r.active ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" onClick={() => removeRider(r.id)} className="px-3 py-1 text-[10px] rounded-lg bg-red-500/20 text-red-400 font-bold">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Activity Log Tab ── */
function ActivityLogView() {
  const [log, setLog] = useState([]);
  useEffect(() => { setLog(loadActivityLog()); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-xs">{log.length} entries</p>
        <button type="button" onClick={() => { setLog([]); try { localStorage.removeItem('sr_activity_log'); } catch {} }}
          className="px-3 py-1 text-[10px] brut-btn font-bold">Clear Log</button>
      </div>
      <div className="space-y-1">
        {log.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No activity recorded yet.</div>
        ) : log.map(entry => (
          <div key={entry.id} className="brut-card p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                entry.action.includes('Added') || entry.action.includes('Activated') ? 'bg-green-500' :
                entry.action.includes('Removed') || entry.action.includes('Deactivated') ? 'bg-red-500' :
                entry.action.includes('Updated') || entry.action.includes('Approved') ? 'bg-blue-500' : 'bg-yellow-500'
              }`} />
              <span className="text-white/70 font-medium">{entry.action}</span>
              {entry.details && <span className="text-white/40">{entry.details}</span>}
            </div>
            <span className="text-white/30 text-[10px]">{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BookingsView with filters & sort ── */
const SORT_OPTIONS = [{ value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }];
const DATE_FILTERS = [{ value: 'all', label: 'All Time' }, { value: '7days', label: '7 Days' }, { value: '30days', label: '30 Days' }, { value: 'today', label: 'Today' }];

function BookingsView({ bookings, places, exportCSV, onUpdateStatus, onDeleteBooking }) {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const now = Date.now();
    if (dateFilter === 'today') { const today = new Date().toDateString(); result = result.filter(b => new Date(b.createdAt).toDateString() === today); }
    else if (dateFilter === '7days') { const cutoff = now - 7 * 86400000; result = result.filter(b => new Date(b.createdAt).getTime() >= cutoff); }
    else if (dateFilter === '30days') { const cutoff = now - 30 * 86400000; result = result.filter(b => new Date(b.createdAt).getTime() >= cutoff); }
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter(b => b.name?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q) || b.phone?.includes(q)); }
    result.sort((a, b) => sortBy === 'newest' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return result;
  }, [bookings, filter, dateFilter, sortBy, search]);

  const stats = useMemo(() => ({
    total: bookings.length, pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length, assigned: bookings.filter(b => b.status === 'assigned').length,
    completed: bookings.filter(b => b.status === 'completed').length, cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings]);

  const updateStatus = useCallback((bookingId, newStatus, rider) => {
    const stored = loadBookings();
    const updated = stored.map(b => b.id === bookingId ? { ...b, status: newStatus, rider: rider || b.rider } : b);
    saveBookings(updated);
    addActivity(`Booking ${newStatus}`, bookingId);
    if (onUpdateStatus) onUpdateStatus(bookingId, newStatus, rider);
  }, [onUpdateStatus]);

  const getPlaceName = useCallback((id) => places.find(p => p.id === id)?.name || id, [places]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Approved', value: stats.approved, color: 'text-blue-400' },
          { label: 'Assigned', value: stats.assigned, color: 'text-purple-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="brut-card p-3 text-center">
            <p className={`text-lg sm:text-xl font-black ${s.color}`}><AnimatedCount value={s.value} /></p>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex gap-1 overflow-x-auto flex-1 min-w-0">
          {['all', 'pending', 'approved', 'assigned', 'completed', 'cancelled'].map(status => (
            <button key={status} type="button" onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all flex-shrink-0 ${
                filter === status ? 'bg-amber-400 text-black' : 'brut-btn'
              }`}>
              {status.replace('_', ' ')} {status !== 'all' && `(${stats[status] || 0})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name/ID/phone..." className="brut-input flex-1 min-w-[160px] max-w-xs px-3 py-1.5 text-xs" />
        {DATE_FILTERS.map(d => (
          <button key={d.value} type="button" onClick={() => setDateFilter(d.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${dateFilter === d.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:text-white/70'}`}>
            {d.label}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {SORT_OPTIONS.map(s => (
          <button key={s.value} type="button" onClick={() => setSortBy(s.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${sortBy === s.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:text-white/70'}`}>
            {s.label}
          </button>
        ))}
        <span className="text-white/30 text-[10px] font-mono ml-auto">{filtered.length} of {bookings.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16"><p className="text-white/30 text-sm">No bookings found.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="brut-card overflow-hidden">
              <button type="button" onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center gap-2 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-amber-400 font-bold text-xs">{booking.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold capitalize ${
                      booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'assigned' ? 'bg-purple-500/20 text-purple-400' :
                      booking.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      booking.status === 'cancel_requested' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>{booking.status.replace('_', ' ')}</span>
                    <span className="text-white/30 text-[9px]">{formatDate(booking.createdAt)}</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{booking.name}</p>
                  <p className="text-white/40 text-xs">{booking.phone}</p>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  {booking.rider && <p className="text-white/40 text-[10px]">Rider: <span className="text-white">{booking.rider}</span></p>}
                  <p className="text-amber-400 font-bold text-sm">{fmt(getRevenue(booking))}</p>
                </div>
              </button>

              {expandedId === booking.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/10 px-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div><p className="text-white/40 text-[10px] mb-0.5">Circuit</p><p className="text-white text-sm font-semibold">{booking.circuitName || booking.circuitId || '—'}</p></div>
                    <div><p className="text-white/40 text-[10px] mb-0.5">Pickup</p><p className="text-white text-sm font-semibold">{booking.timeSlot || 'TBD'} {booking.nodalPoint ? `@ ${booking.nodalPoint}` : ''}</p></div>
                    <div><p className="text-white/40 text-[10px] mb-0.5">Places</p><p className="text-white text-sm font-semibold">{(booking.spotIds || booking.spots || []).map(getPlaceName).join(', ') || '—'}</p></div>
                    <div><p className="text-white/40 text-[10px] mb-0.5">Distance</p><p className="text-white text-sm font-semibold">{getRouteDistance(booking)} km</p></div>
                    <div><p className="text-white/40 text-[10px] mb-0.5">Group</p><p className="text-white text-sm font-semibold capitalize">{booking.groupType || 'Solo'}</p></div>
                    <div><p className="text-white/40 text-[10px] mb-0.5">Vehicle</p><p className="text-white text-sm font-semibold uppercase">{booking.vehicleType || 'Bike'}</p></div>
                  </div>

                  {booking.homestay && (
                    <div className="mb-4"><p className="text-white/40 text-[10px] mb-0.5">Homestay</p><p className="text-white text-sm">{booking.homestay.name} — {booking.homestay.vibe}</p></div>
                  )}

                  <div className="border-t border-amber-400/20 pt-3 mb-3">
                    <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Price Breakdown</p>
                    {booking.priceBreakdown?.breakdown?.map(item => (
                      <div key={item.id} className="flex justify-between text-xs py-1"><span className="text-white/50">{item.label}</span><span className="text-white font-bold">{fmt(item.amount)}</span></div>
                    ))}
                    {!booking.priceBreakdown?.breakdown && (
                      <>
                        <div className="flex justify-between text-xs py-1"><span className="text-white/50">Rider Fee</span><span className="text-white font-bold">{fmt(booking.priceBreakdown?.riderFee || 0)}</span></div>
                        <div className="flex justify-between text-xs py-1"><span className="text-white/50">Fuel</span><span className="text-white font-bold">{fmt(booking.priceBreakdown?.fuelCost || 0)}</span></div>
                        <div className="flex justify-between text-xs py-1"><span className="text-white/50">Service</span><span className="text-white font-bold">{fmt(booking.priceBreakdown?.serviceTotal || 0)}</span></div>
                      </>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-white/10 mt-2"><span className="text-white font-bold">Total</span><span className="text-amber-400 font-extrabold">{fmt(getRevenue(booking))}</span></div>
                  </div>

                  {booking.notes && <div className="mb-4"><p className="text-white/40 text-[10px] mb-0.5">Notes</p><p className="text-white/50 text-xs">{booking.notes}</p></div>}
                  {booking.emailSent === false && <div className="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><p className="text-yellow-400 text-[11px]">⚠ Email not sent — EmailJS not configured</p></div>}

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-white/40 text-[10px] mb-2">Actions</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {booking.status === 'pending' && (
                        <>
                          <button type="button" onClick={() => updateStatus(booking.id, 'approved')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Approve</button>
                          <button type="button" onClick={() => updateStatus(booking.id, 'rejected')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30">Reject</button>
                        </>
                      )}
                      {['approved', 'assigned', 'completed', 'cancelled'].map(s => (
                        <button key={s} type="button" onClick={() => updateStatus(booking.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${booking.status === s ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {booking.status === 'approved' && (
                      <div className="mb-3">
                        <p className="text-white/40 text-[10px] mb-1">Assign Rider</p>
                        <input type="text" placeholder="Rider name..." defaultValue={booking.rider || ''} className="brut-input max-w-xs px-3 py-1.5 text-xs"
                          onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) updateStatus(booking.id, 'assigned', e.target.value.trim()); }} />
                      </div>
                    )}
                    <div className="pt-3 border-t border-red-500/20">
                      <button type="button" onClick={() => onDeleteBooking(booking.id)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</button>
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

/* ── Circuits View ── */
function CircuitsView({ places, onCircuitEdit, onToast }) {
  const [currentPlaces, setCurrentPlaces] = useState(places);
  useEffect(() => { fetchFileFromGitHub('data/places.json').then(data => { if (data) setCurrentPlaces(data); }).catch(() => {}); }, []);

  return (
    <div>
      <p className="text-white/40 text-xs mb-4">{currentPlaces.length} places across {circuitsData.length} circuits</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {circuitsData.map((circuit, i) => {
          const spotCount = circuit.spots.length;
          return (
            <motion.button key={circuit.id} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => onCircuitEdit(circuit)} className="brut-card p-5 text-left group hover:border-amber-400/40 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: circuit.color }} />
                <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-[0.15em]">{circuit.tagline}</span>
              </div>
              <h3 className="font-['Anton'] text-white text-xl tracking-wider mb-1 group-hover:text-orange-500 transition-colors">{circuit.shortName}</h3>
              <p className="text-white/55 text-xs leading-relaxed mb-4 line-clamp-2">{circuit.description}</p>
              <div className="flex items-center justify-between border-t border-[#2e2e44] pt-3">
                <span className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">{spotCount} spots</span>
                <span className="text-orange-500 font-['Anton'] text-xs uppercase tracking-wider group-hover:underline">Edit →</span>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="brut-card p-4 mt-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <p className="text-white/40 text-xs flex-1">Edits save to GitHub and auto-deploy (~2 min).</p>
        <button type="button" onClick={() => { fetchFileFromGitHub('data/places.json').then(d => { if (d) setCurrentPlaces(d); onToast?.('Places refreshed', 'success'); }).catch(() => onToast?.('Refresh failed', 'error')); }}
          className="px-3 py-1.5 brut-btn text-[10px]">Refresh</button>
      </div>
    </div>
  );
}

function loadBookingsLocal() { return loadBookings(); }

/* ── Main AdminPanel ── */
export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [localBookings, setLocalBookings] = useState(() => loadBookingsLocal());
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sharedBookings, setSharedBookings] = useState([]);
  const [syncState, setSyncState] = useState('loading');
  const [syncTimestamp, setSyncTimestamp] = useState(null);
  const [places, setPlaces] = useState(placesData);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);

  useEffect(() => {
    const handler = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handler); window.addEventListener('offline', handler);
    return () => { window.removeEventListener('online', handler); window.removeEventListener('offline', handler); };
  }, []);

  const refreshBookings = useCallback(() => { setLocalBookings(loadBookingsLocal()); setRefreshKey(k => k + 1); }, []);
  useEffect(() => { getPlaces().then(setPlaces).catch(() => {}); }, []);
  useEffect(() => {
    fetchAllBookings().then(shared => {
      setSharedBookings(shared);
      setSyncState(import.meta.env.VITE_GITHUB_TOKEN ? 'synced' : 'token_missing');
      setSyncTimestamp(new Date().toLocaleTimeString());
    }).catch(() => { setSyncState('error'); setSyncTimestamp(new Date().toLocaleTimeString()); });
  }, [refreshKey]);

  const seen = new Set();
  const allBookings = useMemo(() => [...sharedBookings, ...localBookings].filter(b => { if (seen.has(b.id)) return false; seen.add(b.id); return true; }), [sharedBookings, localBookings]);

  const handleStatusUpdate = useCallback(async (bookingId, newStatus, rider) => {
    try { await updateSingleBooking(bookingId, { status: newStatus, rider }); refreshBookings(); showToast(`Updated to ${newStatus}`, 'success'); }
    catch { showToast('Update failed', 'error'); }
  }, [refreshBookings, showToast]);

  const handleDeleteBooking = useCallback(async (bookingId) => {
    try { await deleteBooking(bookingId); refreshBookings(); showToast('Deleted', 'success'); }
    catch { showToast('Delete failed', 'error'); }
  }, [refreshBookings, showToast]);

  const handleManualSync = useCallback(() => {
    setSyncState('loading');
    fetchAllBookings().then(shared => { setSharedBookings(shared); setSyncState('synced'); setSyncTimestamp(new Date().toLocaleTimeString()); showToast('Synced', 'success'); })
      .catch(() => { setSyncState('error'); showToast('Sync failed', 'error'); });
  }, [showToast]);

  const exportCSV = useCallback(() => {
    const headers = ['ID','Name','Phone','Circuit','Group','Vehicle','Pickup','Spots','Distance','Time','Status','Rider','Revenue','Route Distance','Notes','Created At'];
    const rows = allBookings.map(b => [
      b.id, b.name, b.phone, b.circuitName || b.circuitId || '', b.groupType || '', b.vehicleType || 'bike',
      b.nodalPoint || b.pickupLocation || 'Shillong',
      (b.spotIds || b.spots || []).map(id => places.find(p => p.id === id)?.name || id).join('; '),
      `${getRouteDistance(b)} km`, b.timeSlot || '', b.status, b.rider || '',
      String(getRevenue(b)), String(getRouteDistance(b)), b.notes || '', b.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `shillong-ride-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('CSV exported', 'success');
  }, [allBookings, places, showToast]);

  return (
    <div className="min-h-screen bg-[#0b0b12]">
      <AnimatePresence><Toast toast={toast} onDone={() => setToast(null)} /></AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-black text-white">Admin Panel</h1>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                syncState === 'loading' ? 'bg-yellow-500/20 text-yellow-400' :
                syncState === 'synced' ? 'bg-green-500/20 text-green-400' :
                syncState === 'token_missing' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {syncState === 'loading' ? 'Connecting...' : syncState === 'synced' ? `Synced (${sharedBookings.length} remote)` : syncState === 'token_missing' ? 'Local only' : 'Error'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} title={isOnline ? 'Online' : 'Offline'} />
            </div>
            <p className="text-white/40 text-xs mt-1">{syncTimestamp && <span className="font-mono">Last sync: {syncTimestamp}</span>}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleManualSync} className="px-3 py-2 brut-btn text-xs flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              Sync
            </button>
            <button type="button" onClick={exportCSV} className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-xs rounded-lg hover:bg-green-500/30">CSV</button>
            <span className="text-amber-400 font-black text-lg sm:text-xl ml-2">Shillong<span className="text-white">Ride</span></span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'bookings', label: '📋 Bookings' },
            { id: 'riders', label: '🏍️ Riders' },
            { id: 'circuits', label: '🗺️ Circuits' },
            { id: 'images', label: '🖼️ Images' },
            { id: 'activity', label: '📜 Activity' },
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                tab === t.id ? 'bg-amber-400 text-black' : 'brut-btn'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'dashboard' && <DashboardView bookings={allBookings} />}
        {tab === 'bookings' && (
          <BookingsView key={refreshKey} bookings={allBookings} places={places} exportCSV={exportCSV}
            onUpdateStatus={handleStatusUpdate} onDeleteBooking={(id) => setDeleteConfirmId(id)} />
        )}
        {tab === 'riders' && <RidersView onToast={showToast} />}
        {tab === 'circuits' && <CircuitsView places={places} onCircuitEdit={(c) => setEditingCircuit(c)} onToast={showToast} />}
        {tab === 'images' && <ImageUploader />}
        {tab === 'activity' && <ActivityLogView />}
      </div>

      <ConfirmDialog open={!!deleteConfirmId} title="Delete Booking?" message="Permanently remove this booking from the server?" confirmLabel="Delete" cancelLabel="Cancel" destructive
        onConfirm={async () => { if (deleteConfirmId) await handleDeleteBooking(deleteConfirmId); setDeleteConfirmId(null); }}
        onCancel={() => setDeleteConfirmId(null)} />

      {editingCircuit && <CircuitEditor circuit={editingCircuit} allPlaces={places} onClose={() => setEditingCircuit(null)}
        onSaved={() => showToast('Circuit saved!', 'success')} onError={(msg) => showToast(msg, 'error')} />}
    </div>
  );
}