import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaces } from '../engines/dataService';
import { fetchAllBookings, updateSingleBooking, deleteBooking } from '../engines/bookingSyncService';
import { fetchFileFromGitHub, saveCircuitData } from '../engines/adminSyncService';
import { getAllImagesForPlace, getImageSourceList } from '../engines/imageService';
import ImageUploader from '../components/ImageUploader';
import CircuitEditor from '../components/CircuitEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import { handleSendWhatsApp } from '../components/WhatsAppDialog';
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
                    <div className="flex flex-wrap gap-1.5 mb-3 border-t border-white/5 pt-3">
                      <button type="button" onClick={() => handleSendWhatsApp(booking)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Send WhatsApp
                      </button>
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

/* ── CatalogView ── */

const CATEGORIES = ['lake', 'waterfall', 'viewpoint', 'museum', 'forest', 'village', 'river', 'cave', 'religious', 'market', 'park', 'activity'];

const CATEGORY_COLORS = {
  waterfall: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  viewpoint: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  lake: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  cave: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  village: 'text-green-400 border-green-500/30 bg-green-500/10',
  river: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
  museum: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  forest: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
  religious: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  market: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  park: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  activity: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
};

function slugify(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/_+/g, '_');
}

function fmtPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function CatalogSpotRow({ place, idx, onEdit, onRemove }) {
  const imgUrl = getImageSourceList(place.id)[0] || '';
  const colorClass = CATEGORY_COLORS[place.category] || 'text-white/40 border-white/10 bg-white/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card-dark p-3 sm:p-4 flex items-center gap-3 group"
    >
      <span className="font-['Anton'] text-white/30 text-xs w-6 text-center flex-shrink-0">{idx + 1}</span>
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 border-black bg-cover bg-center" style={{ backgroundImage: `url(${imgUrl})` }} />
      <div className="flex-1 min-w-0">
        <p className="text-white font-['Anton'] text-sm tracking-wider truncate">{place.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-white/40 text-[9px] font-mono">{place.distanceWeight} km</span>
          <span className="text-white/20 text-[9px]">·</span>
          <span className="text-white/40 text-[9px] font-mono">{fmtPrice(place.price)}</span>
          <span className="text-white/20 text-[9px]">·</span>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 border ${colorClass}`}>{place.category}</span>
          <span className="text-white/20 text-[9px] font-mono">#{place.id}</span>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button type="button" onClick={() => onEdit(place)}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-amber-500/20 text-white/60 hover:text-amber-400 transition-all border border-black">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
        <button type="button" onClick={() => onRemove(place)}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all border border-black">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </button>
      </div>
    </motion.div>
  );
}

function SpotEditForm({ place, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: place?.name || '',
    description: place?.description || '',
    category: place?.category || 'waterfall',
    distanceWeight: place ? String(place.distanceWeight) : '',
    price: place ? String(place.price) : '',
  });
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!form.name.trim()) { setError('Spot name is required'); return; }
    if (!form.distanceWeight.trim() || isNaN(Number(form.distanceWeight)) || Number(form.distanceWeight) <= 0) { setError('Distance must be a positive number'); return; }
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) < 0) { setError('Entry price must be a valid number'); return; }
    onSave({
      id: place ? place.id : slugify(form.name),
      name: form.name.trim(),
      description: form.description.trim() || `${form.name.trim()} — a scenic destination in Meghalaya.`,
      price: Number(form.price),
      distanceWeight: Number(form.distanceWeight),
      imageCount: place?.imageCount || 0,
      category: form.category,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="neo-card-dark p-5 mb-4"
    >
      <h4 className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4">
        {place ? `Edit: ${place.name}` : 'New Spot'}
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Spot Name *</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="E.g. Sunset Point" className="neo-input-dark w-full px-3 py-2 text-sm" />
          {!place && form.name && <p className="text-white/35 text-[9px] font-mono mt-0.5">ID: {slugify(form.name)}</p>}
        </div>
        <div>
          <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe this destination..." rows={2} className="neo-input-dark w-full px-3 py-2 text-sm resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="neo-input-dark w-full px-3 py-2 text-sm appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0b0b12]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Distance (km) *</label>
            <input type="number" value={form.distanceWeight} onChange={e => setForm(f => ({ ...f, distanceWeight: e.target.value }))} placeholder="km" min="1" className="neo-input-dark w-full px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Entry Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="₹" min="0" className="neo-input-dark w-full px-3 py-2 text-sm" />
        </div>
        {error && <p className="text-red-400 text-[10px] font-['Anton'] uppercase tracking-wider">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={handleSave} className="neo-btn-primary-dark px-5 py-2.5 text-xs uppercase tracking-wider flex-1">
            {place ? 'Save Changes' : 'Add Spot'}
          </button>
          <button type="button" onClick={onCancel} className="neo-btn-dark px-5 py-2.5 text-xs uppercase tracking-wider">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CatalogView({ places, onToast }) {
  const [catalog, setCatalog] = useState(places);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingSpot, setEditingSpot] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFileFromGitHub('data/places.json').then(data => {
      if (data) setCatalog(data);
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q) || p.category.includes(q));
    }
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'distance') result.sort((a, b) => a.distanceWeight - b.distanceWeight);
    else if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'category') result.sort((a, b) => a.category.localeCompare(b.category));
    return result;
  }, [catalog, search, sortBy, filterCategory]);

  const handleAddSave = (newSpot) => {
    const exists = catalog.find(p => p.id === newSpot.id);
    if (exists) {
      onToast?.('A spot with this ID already exists', 'error');
      return;
    }
    setCatalog(prev => [...prev, newSpot]);
    setShowAddForm(false);
    onToast?.('Spot added to catalog', 'success');
  };

  const handleEditSave = (updatedSpot) => {
    setCatalog(prev => prev.map(p => p.id === updatedSpot.id ? { ...p, ...updatedSpot } : p));
    setEditingSpot(null);
    onToast?.('Spot updated', 'success');
  };

  const handleRemoveConfirm = () => {
    if (!removeConfirm) return;
    setCatalog(prev => prev.filter(p => p.id !== removeConfirm.id));
    setRemoveConfirm(null);
    onToast?.('Spot removed from catalog', 'success');
  };

  const handleSaveToGitHub = async () => {
    setSaving(true);
    try {
      const result = await saveCircuitData(
        catalog,
        circuitsData,
        `Catalog update: ${catalog.length} spots`
      );
      if (result.success) {
        onToast?.('Catalog saved to GitHub', 'success');
      } else {
        onToast?.(result.error || 'Failed to save', 'error');
      }
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-white/40 text-xs">{catalog.length} spots total</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setShowAddForm(true); setEditingSpot(null); }}
            className="neo-btn-primary-dark px-4 py-2 text-xs flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Spot
          </button>
          <button type="button" onClick={handleSaveToGitHub} disabled={saving}
            className={`neo-btn-dark px-4 py-2 text-xs flex items-center gap-1.5 ${saving ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {saving ? (
              <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
            ) : 'Save to GitHub'}
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search spots..." className="neo-input-dark w-full pl-9 pr-3 py-1.5 text-xs" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="neo-input-dark w-auto px-3 py-1.5 text-xs">
          <option value="all" className="bg-[#0b0b12]">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0b0b12] capitalize">{c}</option>)}
        </select>
        <div className="flex gap-1">
          {[
            { value: 'name', label: 'Name' },
            { value: 'distance', label: 'Distance' },
            { value: 'price', label: 'Price' },
            { value: 'category', label: 'Category' },
          ].map(s => (
            <button key={s.value} type="button" onClick={() => setSortBy(s.value)}
              className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border border-black transition-all ${
                sortBy === s.value ? 'neo-btn-primary-dark text-[9px]' : 'neo-btn-dark text-[9px]'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-white/30 text-[10px] font-mono ml-auto">{filtered.length} shown</span>
      </div>

      {/* Add / Edit Forms */}
      <AnimatePresence>
        {showAddForm && (
          <SpotEditForm place={null} onSave={handleAddSave} onCancel={() => setShowAddForm(false)} />
        )}
        {editingSpot && (
          <SpotEditForm place={editingSpot} onSave={handleEditSave} onCancel={() => setEditingSpot(null)} />
        )}
      </AnimatePresence>

      {/* Spot List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm font-['Anton'] uppercase tracking-wider">No spots found</p>
          <p className="text-white/20 text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((place, i) => (
            <CatalogSpotRow
              key={place.id}
              place={place}
              idx={i}
              onEdit={setEditingSpot}
              onRemove={setRemoveConfirm}
            />
          ))}
        </div>
      )}

      {/* Remove Confirmation */}
      <ConfirmDialog
        open={!!removeConfirm}
        title="Remove Spot?"
        message={`Permanently remove "${removeConfirm?.name || ''}" from the catalog? This will also affect circuits using this spot.`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleRemoveConfirm}
        onCancel={() => setRemoveConfirm(null)}
      />
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
            <button type="button" onClick={handleManualSync} className="neo-btn-dark px-3 py-2 text-xs flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              Sync
            </button>
            <button type="button" onClick={exportCSV} className="neo-btn-dark px-4 py-2 text-xs">CSV</button>
            <span className="text-orange-500 font-black text-lg sm:text-xl ml-2 font-['Anton'] tracking-wider">Shillong<span className="text-white">Ride</span></span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'bookings', label: '📋 Bookings' },
            { id: 'catalog', label: '🏷️ Catalog' },
            { id: 'riders', label: '🏍️ Riders' },
            { id: 'circuits', label: '🗺️ Circuits' },
            { id: 'images', label: '🖼️ Images' },
            { id: 'activity', label: '📜 Activity' },
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-4 border-black transition-all ${
                tab === t.id
                  ? 'bg-orange-500 text-black shadow-[4px_4px_0px_#000]'
                  : 'bg-transparent text-white shadow-[4px_4px_0px_#000] hover:bg-white/10'
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
        {tab === 'catalog' && <CatalogView places={places} onToast={showToast} />}
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