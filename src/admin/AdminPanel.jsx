import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlaces, getCircuits, clearCache } from '../engines/dataService';
import { fetchAllBookings, updateSingleBooking, deleteBooking } from '../engines/bookingSyncService';
import { fetchFileFromGitHub, saveCircuitData } from '../engines/adminSyncService';
import { getImageSourceList } from '../engines/imageService';
import ImageUploader from '../components/ImageUploader';
import CircuitEditor from '../components/CircuitEditor';
import ConfirmDialog from '../components/ConfirmDialog';
import { WhatsAppTemplateSelector } from '../components/WhatsAppDialog';
import { loadBookings, saveBookings, loadActivityLog, addActivity, loadRiders, saveRiders } from '../engines/storageService';

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
      className={`fixed top-4 right-4 z-[100] max-w-sm px-5 py-3 border-4 border-var-border shadow-neo-lg flex items-center gap-3 ${
        toast.type === 'success' ? 'bg-green-500 text-white' :
        toast.type === 'error' ? 'bg-red-500 text-white' :
        'bg-yellow-500 text-black'
      }`}
    >
      {toast.type === 'success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
      {toast.type === 'error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
      <p className="text-sm font-black uppercase tracking-wider">{toast.message}</p>
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
  }, [value, display]);
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
          { label: 'Total Bookings', value: stats.total, bg: 'bg-yellow-500', txt: 'text-black' },
          { label: 'Total Revenue', value: fmtShort(stats.totalRevenue), bg: 'bg-white', txt: 'text-black' },
          { label: 'Completed Trips', value: stats.completed, bg: 'bg-green-500', txt: 'text-white' },
          { label: 'Active/Pending', value: stats.pending + stats.active, bg: 'bg-red-500', txt: 'text-white' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border-4 border-var-border shadow-neo-lg p-4 text-center`}>
            <p className={`text-xl sm:text-2xl font-black ${s.txt}`}>{s.value}</p>
            <p className={`text-[10px] mt-1 uppercase tracking-wider font-black ${s.txt === 'text-white' ? 'text-white/80' : 'text-black/60'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-4 border-var-border shadow-neo-lg p-5">
          <p className="text-black/50 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Revenue Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-black/60">Total</span><span className="text-green-600 font-bold">{fmtShort(stats.totalRevenue)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-black/60">Collected</span><span className="text-green-600 font-bold">{fmtShort(stats.paidRevenue)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-black/60">Pending</span><span className="text-yellow-600 font-bold">{fmtShort(stats.totalRevenue - stats.paidRevenue)}</span></div>
            <div className="flex justify-between text-sm pt-2 border-t-2 border-var-border"><span className="text-black/60">Avg/Booking</span><span className="text-black font-bold">{stats.total > 0 ? fmtShort(Math.round(stats.totalRevenue / stats.total)) : '₹0'}</span></div>
          </div>
        </div>
        <div className="bg-white border-4 border-var-border shadow-neo-lg p-5">
          <p className="text-black/50 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Booking Status</p>
          <div className="space-y-2">
            {[
              { label: 'Pending', value: stats.pending, bar: 'bg-yellow-500', pct: stats.total > 0 ? Math.round(stats.pending/stats.total*100) : 0 },
              { label: 'Active', value: stats.active, bar: 'bg-black', pct: stats.total > 0 ? Math.round(stats.active/stats.total*100) : 0 },
              { label: 'Completed', value: stats.completed, bar: 'bg-green-500', pct: stats.total > 0 ? Math.round(stats.completed/stats.total*100) : 0 },
              { label: 'Cancelled', value: stats.cancelled, bar: 'bg-red-500', pct: stats.total > 0 ? Math.round(stats.cancelled/stats.total*100) : 0 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1"><span className="text-black font-bold">{s.label}</span><span className="text-black/50">{s.value} ({s.pct}%)</span></div>
                <div className="h-2 bg-white border-2 border-var-border"><div className={`h-full transition-all duration-500 ${s.bar}`} style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {monthlyData.length > 0 && (
        <div className="bg-white border-4 border-var-border shadow-neo-lg p-5">
          <p className="text-black/50 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Monthly Revenue (Last 6)</p>
          <div className="flex items-end gap-3 h-32">
            {monthlyData.map(([month, amount]) => {
              const max = Math.max(...monthlyData.map(([, a]) => a));
              const height = max > 0 ? (amount / max) * 100 : 0;
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-black font-bold">{fmtShort(amount)}</span>
                  <div className="w-full border-2 border-var-border" style={{ height: `${height}%`, minHeight: '8px', backgroundColor: '#eab308' }} />
                  <span className="text-[9px] text-black/50 font-bold">{month}</span>
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
  const [riders, setRiders] = useState(() => loadRiders());
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const addRider = () => {
    if (!newName.trim()) return;
    const rider = { id: Date.now().toString(36), name: newName.trim(), phone: newPhone.trim(), active: true, createdAt: new Date().toISOString() };
    const updated = [...riders, rider];
    setRiders(updated); saveRiders(updated);
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
      <div className="bg-white border-4 border-var-border shadow-neo-lg p-5 mb-6">
        <p className="text-black/50 text-[10px] uppercase tracking-wider mb-3 font-['Anton']">Add Rider</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Rider name" className="border-4 border-var-border shadow-neo px-3 py-2 text-sm font-bold flex-1"
            onKeyDown={e => { if (e.key === 'Enter') addRider(); }} />
          <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone (opt)" className="border-4 border-var-border shadow-neo px-3 py-2 text-sm font-bold w-full sm:w-36"
            onKeyDown={e => { if (e.key === 'Enter') addRider(); }} />
          <button type="button" onClick={addRider} className="bg-yellow-500 border-4 border-var-border shadow-neo px-4 py-2 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Add</button>
        </div>
      </div>

      <div className="space-y-2">
        {riders.length === 0 ? (
          <div className="text-center py-12 text-black/30 text-sm font-bold">No riders yet.</div>
        ) : riders.map(r => (
          <div key={r.id} className="bg-white border-4 border-var-border shadow-neo-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 border-2 border-var-border ${r.active ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="text-black font-bold text-sm">{r.name}</p>
                {r.phone && <p className="text-black/50 text-xs">{r.phone}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => toggleRider(r.id)} className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-var-border ${r.active ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                {r.active ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" onClick={() => removeRider(r.id)} className="px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-var-border bg-red-500 text-white">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Activity Log Tab ── */
function ActivityLogView() {
  const [log, setLog] = useState(() => loadActivityLog());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-black/50 text-xs font-bold">{log.length} entries</p>
        <button type="button" onClick={() => { setLog([]); try { localStorage.removeItem('sr_activity_log'); } catch { /* ignore */ } }}
          className="px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white border-4 border-var-border shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Clear Log</button>
      </div>
      <div className="space-y-1">
        {log.length === 0 ? (
          <div className="text-center py-12 text-black/30 text-sm font-bold">No activity recorded yet.</div>
        ) : log.map(entry => (
          <div key={entry.id} className="bg-white border-4 border-var-border shadow-neo p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 border border-var-border ${
                entry.action.includes('Added') || entry.action.includes('Activated') ? 'bg-green-500' :
                entry.action.includes('Removed') || entry.action.includes('Deactivated') ? 'bg-red-500' :
                entry.action.includes('Updated') || entry.action.includes('Approved') ? 'bg-black' : 'bg-yellow-500'
              }`} />
              <span className="text-black font-bold">{entry.action}</span>
              {entry.details && <span className="text-black/50">{entry.details}</span>}
            </div>
            <span className="text-black/40 text-[10px] font-bold">{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── BookingsView with filters & sort ── */
const SORT_OPTIONS = [{ value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }];
const DATE_FILTERS = [{ value: 'all', label: 'All Time' }, { value: '7days', label: '7 Days' }, { value: '30days', label: '30 Days' }, { value: 'today', label: 'Today' }];
const PAGE_LOAD_TIME = Date.now();
const PAGE_TODAY_STR = new Date(PAGE_LOAD_TIME).toDateString();

function BookingsView({ bookings, places, onUpdateStatus, onDeleteBooking, onWhatsAppOpen }) {
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
    const cutoffTime = PAGE_LOAD_TIME;
    if (dateFilter === 'today') result = result.filter(b => new Date(b.createdAt).toDateString() === PAGE_TODAY_STR);
    else if (dateFilter === '7days') { const c = cutoffTime - 7 * 86400000; result = result.filter(b => new Date(b.createdAt).getTime() >= c); }
    else if (dateFilter === '30days') { const c = cutoffTime - 30 * 86400000; result = result.filter(b => new Date(b.createdAt).getTime() >= c); }
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

  const StatusBadge = ({ status }) => {
    const cls = status === 'completed' ? 'bg-green-500 text-white' :
      status === 'assigned' ? 'bg-black text-white' :
      status === 'approved' ? 'bg-white text-black' :
      status === 'cancelled' || status === 'rejected' ? 'bg-red-500 text-white' :
      status === 'cancel_requested' ? 'bg-red-500 text-white' :
      'bg-yellow-500 text-black';
    return <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-2 border-var-border ${cls}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {[
          { label: 'Total', value: stats.total, bg: 'bg-yellow-500', txt: 'text-black' },
          { label: 'Pending', value: stats.pending, bg: 'bg-yellow-500', txt: 'text-black' },
          { label: 'Approved', value: stats.approved, bg: 'bg-white', txt: 'text-black' },
          { label: 'Assigned', value: stats.assigned, bg: 'bg-black', txt: 'text-white' },
          { label: 'Completed', value: stats.completed, bg: 'bg-green-500', txt: 'text-white' },
          { label: 'Cancelled', value: stats.cancelled, bg: 'bg-red-500', txt: 'text-white' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border-4 border-var-border shadow-neo p-3 text-center`}>
            <p className={`text-lg sm:text-xl font-black ${s.txt}`}><AnimatedCount value={s.value} /></p>
            <p className={`text-[9px] uppercase tracking-wider font-black ${s.txt === 'text-white' ? 'text-white/70' : 'text-black/60'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex gap-1 overflow-x-auto flex-1 min-w-0">
          {['all', 'pending', 'approved', 'assigned', 'completed', 'cancelled'].map(status => (
            <button key={status} type="button" onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 border-var-border transition-all flex-shrink-0 ${
                filter === status ? 'bg-yellow-500 text-black shadow-neo' : 'bg-white text-black/60 hover:shadow-neo'
              }`}>
              {status.replace('_', ' ')} {status !== 'all' && `(${stats[status] || 0})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name/ID/phone..." className="border-4 border-var-border shadow-neo flex-1 min-w-[160px] max-w-xs px-3 py-1.5 text-xs font-bold" />
        {DATE_FILTERS.map(d => (
          <button key={d.value} type="button" onClick={() => setDateFilter(d.value)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-var-border transition-all ${dateFilter === d.value ? 'bg-black text-white shadow-neo' : 'bg-white text-black/50'}`}>
            {d.label}
          </button>
        ))}
        <div className="w-px h-4 bg-black/20 mx-1" />
        {SORT_OPTIONS.map(s => (
          <button key={s.value} type="button" onClick={() => setSortBy(s.value)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-var-border transition-all ${sortBy === s.value ? 'bg-black text-white shadow-neo' : 'bg-white text-black/50'}`}>
            {s.label}
          </button>
        ))}
        <span className="text-black/40 text-[10px] font-mono ml-auto">{filtered.length} of {bookings.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16"><p className="text-black/30 text-sm font-bold uppercase tracking-wider">No bookings found.</p></div>
      ) : (
        <div className="space-y-2">
          {filtered.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="bg-white border-4 border-var-border shadow-neo-lg overflow-hidden">
              <button type="button" onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 flex flex-col sm:flex-row sm:items-center gap-2 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-black font-bold text-xs font-mono">{booking.id}</span>
                    <StatusBadge status={booking.status} />
                    <span className="text-black/40 text-[9px] font-bold">{formatDate(booking.createdAt)}</span>
                  </div>
                  <p className="text-black font-bold text-sm">{booking.name}</p>
                  <p className="text-black/50 text-xs">{booking.phone}</p>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  {booking.rider && <p className="text-black/50 text-[10px] font-bold">Rider: <span className="text-black">{booking.rider}</span></p>}
                  <p className="text-black font-bold text-sm">{fmt(getRevenue(booking))}</p>
                </div>
              </button>

              {expandedId === booking.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t-4 border-var-border px-4 py-4 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Circuit</p><p className="text-black text-sm font-bold">{booking.circuitName || booking.circuitId || '—'}</p></div>
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Pickup</p><p className="text-black text-sm font-bold">{booking.timeSlot || 'TBD'} {booking.nodalPoint ? `@ ${booking.nodalPoint}` : ''}</p></div>
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Places</p><p className="text-black text-sm font-bold">{(booking.spotIds || booking.spots || []).map(getPlaceName).join(', ') || '—'}</p></div>
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Distance</p><p className="text-black text-sm font-bold">{getRouteDistance(booking)} km</p></div>
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Group</p><p className="text-black text-sm font-bold capitalize">{booking.groupType || 'Solo'}</p></div>
                    <div><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Vehicle</p><p className="text-black text-sm font-bold uppercase">{booking.vehicleType || 'Bike'}</p></div>
                  </div>

                  {booking.homestay && (
                    <div className="mb-4"><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Homestay</p><p className="text-black text-sm font-bold">{booking.homestay.name} — {booking.homestay.vibe}</p></div>
                  )}

                  <div className="border-t-4 border-yellow-500 pt-3 mb-3">
                    <p className="text-black font-black text-[10px] uppercase tracking-wider mb-2">Price Breakdown</p>
                    {booking.priceBreakdown?.breakdown?.map(item => (
                      <div key={item.id} className="flex justify-between text-xs py-1"><span className="text-black/50">{item.label}</span><span className="text-black font-bold">{fmt(item.amount)}</span></div>
                    ))}
                    {!booking.priceBreakdown?.breakdown && (
                      <>
                        <div className="flex justify-between text-xs py-1"><span className="text-black/50">Rider Fee</span><span className="text-black font-bold">{fmt(booking.priceBreakdown?.riderFee || 0)}</span></div>
                        <div className="flex justify-between text-xs py-1"><span className="text-black/50">Fuel</span><span className="text-black font-bold">{fmt(booking.priceBreakdown?.fuelCost || 0)}</span></div>
                        <div className="flex justify-between text-xs py-1"><span className="text-black/50">Service</span><span className="text-black font-bold">{fmt(booking.priceBreakdown?.serviceTotal || 0)}</span></div>
                      </>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t-2 border-var-border mt-2"><span className="text-black font-bold">Total</span><span className="text-black font-extrabold">{fmt(getRevenue(booking))}</span></div>
                  </div>

                  {booking.notes && <div className="mb-4"><p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Notes</p><p className="text-black/60 text-xs">{booking.notes}</p></div>}
                  {booking.emailSent === false && <div className="mb-4 px-3 py-2 bg-yellow-500 border-2 border-var-border"><p className="text-black font-bold text-[11px] uppercase tracking-wider">⚠ Email not sent — EmailJS not configured</p></div>}

                  <div className="pt-3 border-t-2 border-var-border">
                    <p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-2">Actions</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {booking.status === 'pending' && (
                        <>
                          <button type="button" onClick={() => updateStatus(booking.id, 'approved')} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-white border-2 border-var-border hover:shadow-neo transition-all">Approve</button>
                          <button type="button" onClick={() => updateStatus(booking.id, 'rejected')} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-red-500 text-white border-2 border-var-border hover:shadow-neo transition-all">Reject</button>
                        </>
                      )}
                      {['approved', 'assigned', 'completed', 'cancelled'].map(s => (
                        <button key={s} type="button" onClick={() => updateStatus(booking.id, s)}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 border-var-border transition-all ${booking.status === s ? 'bg-yellow-500 text-black shadow-neo' : 'bg-white text-black/70 hover:shadow-neo'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3 border-t-2 border-var-border pt-3">
                      <button type="button" onClick={() => onWhatsAppOpen?.(booking)}
                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-green-500 text-white border-2 border-var-border hover:shadow-neo transition-all flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        Send WhatsApp
                      </button>
                    </div>
                    {booking.status === 'approved' && (
                      <div className="mb-3">
                        <p className="text-black/50 text-[10px] font-black uppercase tracking-wider mb-1">Assign Rider</p>
                        <input type="text" placeholder="Rider name..." defaultValue={booking.rider || ''} className="border-4 border-var-border shadow-neo max-w-xs px-3 py-1.5 text-xs font-bold"
                          onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) updateStatus(booking.id, 'assigned', e.target.value.trim()); }} />
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-red-500">
                      <button type="button" onClick={() => onDeleteBooking(booking.id)} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-red-500 text-white border-2 border-var-border hover:shadow-neo transition-all">Delete</button>
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
function CircuitsView({ places, circuits, onCircuitEdit, onToast, onRefresh }) {
  return (
    <div>
      <p className="text-black/50 text-xs font-bold mb-4">{places.length} places across {circuits.length} circuits</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {circuits.map((circuit, i) => {
          const spotCount = circuit.spots.length;
          return (
            <motion.button key={circuit.id} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => onCircuitEdit(circuit)} className="bg-white border-4 border-var-border shadow-neo-lg p-5 text-left group hover:shadow-neo-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 border-2 border-var-border" style={{ backgroundColor: circuit.color }} />
                <span className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-[0.15em]">{circuit.tagline}</span>
              </div>
              <h3 className="font-['Anton'] text-black text-xl tracking-wider mb-1 group-hover:text-yellow-600 transition-colors">{circuit.shortName}</h3>
              <p className="text-black/55 text-xs leading-relaxed mb-4 line-clamp-2">{circuit.description}</p>
              <div className="flex items-center justify-between border-t-2 border-var-border pt-3">
                <span className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider">{spotCount} spots</span>
                <span className="text-black font-['Anton'] text-xs uppercase tracking-wider group-hover:text-yellow-600">Edit →</span>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="bg-white border-4 border-var-border shadow-neo-lg p-4 mt-4 flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 animate-pulse border border-var-border" />
        <p className="text-black/50 text-xs flex-1 font-bold">Edits save to GitHub and auto-deploy (~2 min).</p>
        <button type="button" onClick={() => { if (onRefresh) onRefresh(); onToast?.('Data refreshed', 'success'); }}
          className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-white border-4 border-var-border shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Refresh</button>
      </div>
    </div>
  );
}

/* ── CatalogView ── */

const CATEGORIES = ['lake', 'waterfall', 'viewpoint', 'museum', 'forest', 'village', 'river', 'cave', 'religious', 'market', 'park', 'activity'];

const CATEGORY_COLORS = {
  waterfall: 'text-blue-600 border-var-border bg-blue-100',
  viewpoint: 'text-purple-600 border-var-border bg-purple-100',
  lake: 'text-cyan-600 border-var-border bg-cyan-100',
  cave: 'text-yellow-600 border-var-border bg-yellow-100',
  village: 'text-green-600 border-var-border bg-green-100',
  river: 'text-teal-600 border-var-border bg-teal-100',
  museum: 'text-pink-600 border-var-border bg-pink-100',
  forest: 'text-lime-600 border-var-border bg-lime-100',
  religious: 'text-indigo-600 border-var-border bg-indigo-100',
  market: 'text-yellow-600 border-var-border bg-yellow-100',
  park: 'text-emerald-600 border-var-border bg-emerald-100',
  activity: 'text-rose-600 border-var-border bg-rose-100',
};

function slugify(name) {
  return name.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').replace(/_+/g, '_');
}

function fmtPrice(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function CatalogSpotRow({ place, idx, onEdit, onRemove }) {
  const imgUrl = getImageSourceList(place.id)[0] || '';
  const colorClass = CATEGORY_COLORS[place.category] || 'text-black/50 border-var-border bg-white';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-var-border shadow-neo-lg p-3 sm:p-4 flex items-center gap-3 group"
    >
      <span className="font-['Anton'] text-black/30 text-xs w-6 text-center flex-shrink-0">{idx + 1}</span>
      <div className="w-12 h-12 border-2 border-var-border flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgUrl})` }} />
      <div className="flex-1 min-w-0">
        <p className="text-black font-['Anton'] text-sm tracking-wider truncate">{place.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-black/50 text-[9px] font-mono">{place.distanceWeight} km</span>
          <span className="text-black/30 text-[9px]">·</span>
          <span className="text-black/50 text-[9px] font-mono">{fmtPrice(place.price)}</span>
          <span className="text-black/30 text-[9px]">·</span>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 border-2 border-var-border ${colorClass}`}>{place.category}</span>
          <span className="text-black/30 text-[9px] font-mono">#{place.id}</span>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button type="button" onClick={() => onEdit(place)}
          className="w-7 h-7 flex items-center justify-center bg-white border-2 border-var-border hover:bg-yellow-500 text-black/60 hover:text-black transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
        <button type="button" onClick={() => onRemove(place)}
          className="w-7 h-7 flex items-center justify-center bg-white border-2 border-var-border hover:bg-red-500 text-black/60 hover:text-white transition-all">
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="bg-white border-4 border-var-border shadow-neo-lg p-5 mb-4">
      <h4 className="font-['Anton'] text-black text-xs uppercase tracking-[0.15em] mb-4">
        {place ? `Edit: ${place.name}` : 'New Spot'}
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Spot Name *</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="E.g. Sunset Point" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
          {!place && form.name && <p className="text-black/40 text-[9px] font-mono mt-0.5">ID: {slugify(form.name)}</p>}
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe this destination..." rows={2} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Distance (km) *</label>
            <input type="number" value={form.distanceWeight} onChange={e => setForm(f => ({ ...f, distanceWeight: e.target.value }))} placeholder="km" min="1" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
          </div>
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Entry Price (₹) *</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="₹" min="0" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
        </div>
        {error && <p className="text-red-600 text-[10px] font-['Anton'] uppercase tracking-wider">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={handleSave} className="bg-yellow-500 border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider flex-1 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            {place ? 'Save Changes' : 'Add Spot'}
          </button>
          <button type="button" onClick={onCancel} className="bg-white border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CatalogView({ places, circuits, onToast, onRefresh }) {
  const [catalog, setCatalog] = useState(places);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingSpot, setEditingSpot] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    let result = [...catalog];
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q) || p.category.includes(q)); }
    if (filterCategory !== 'all') result = result.filter(p => p.category === filterCategory);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'distance') result.sort((a, b) => a.distanceWeight - b.distanceWeight);
    else if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'category') result.sort((a, b) => a.category.localeCompare(b.category));
    return result;
  }, [catalog, search, sortBy, filterCategory]);

  const handleAddSave = (newSpot) => {
    const exists = catalog.find(p => p.id === newSpot.id);
    if (exists) { onToast?.('A spot with this ID already exists', 'error'); return; }
    setCatalog(prev => [...prev, newSpot]); setShowAddForm(false);
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
      // Use the latest catalog data (local state) and circuits from props (authoritative from AdminPanel)
      // Ensure we have latest circuits from GitHub first
      const latestCircuits = await fetchFileFromGitHub('data/circuits.json') || circuits;
      const result = await saveCircuitData(catalog, latestCircuits, `Catalog update: ${catalog.length} spots`);
      if (result.success) {
        onToast?.('Catalog saved to GitHub', 'success');
        if (onRefresh) onRefresh();
      }
      else { onToast?.(result.error || 'Failed to save', 'error'); }
    } catch (err) { onToast?.(err.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-black/50 text-xs font-bold">{catalog.length} spots total</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setShowAddForm(true); setEditingSpot(null); }}
            className="bg-yellow-500 border-4 border-var-border shadow-neo px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Spot
          </button>
          <button type="button" onClick={handleSaveToGitHub} disabled={saving}
            className={`bg-white border-4 border-var-border shadow-neo px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${saving ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {saving ? (
              <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
            ) : 'Save to GitHub'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search spots..." className="w-full pl-9 pr-3 py-1.5 text-xs border-4 border-var-border shadow-neo font-bold" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border-4 border-var-border shadow-neo px-3 py-1.5 text-xs font-bold appearance-none">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <div className="flex gap-1">
          {[{ value: 'name', label: 'Name' }, { value: 'distance', label: 'Distance' }, { value: 'price', label: 'Price' }, { value: 'category', label: 'Category' }].map(s => (
            <button key={s.value} type="button" onClick={() => setSortBy(s.value)}
              className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border-2 border-var-border transition-all ${
                sortBy === s.value ? 'bg-yellow-500 text-black shadow-neo' : 'bg-white text-black/70'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-black/40 text-[10px] font-mono ml-auto">{filtered.length} shown</span>
      </div>

      <AnimatePresence>
        {showAddForm && <SpotEditForm place={null} onSave={handleAddSave} onCancel={() => setShowAddForm(false)} />}
        {editingSpot && <SpotEditForm place={editingSpot} onSave={handleEditSave} onCancel={() => setEditingSpot(null)} />}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-black/30 text-sm font-['Anton'] uppercase tracking-wider">No spots found</p>
          <p className="text-black/20 text-xs mt-1 font-bold">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((place, i) => (
            <CatalogSpotRow key={place.id} place={place} idx={i} onEdit={setEditingSpot} onRemove={setRemoveConfirm} />
          ))}
        </div>
      )}

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
  const [places, setPlaces] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [whatsAppBooking, setWhatsAppBooking] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type, id: Date.now() }), []);

  useEffect(() => {
    const handler = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handler); window.addEventListener('offline', handler);
    return () => { window.removeEventListener('online', handler); window.removeEventListener('offline', handler); };
  }, []);

  const refreshBookings = useCallback(() => { setLocalBookings(loadBookingsLocal()); setRefreshKey(k => k + 1); }, []);

  const refreshAllData = useCallback(async (showToastOnComplete = false) => {
    clearCache();
    try {
      const [latestPlaces, latestCircuits, shared] = await Promise.all([
        getPlaces(),
        getCircuits(),
        fetchAllBookings(),
      ]);
      setPlaces(latestPlaces);
      setCircuits(latestCircuits);
      setSharedBookings(shared);
      if (showToastOnComplete) {
        showToast('All data refreshed', 'success');
      }
    } catch {
      // fallback to whatever we already have
    }
    setRefreshKey(k => k + 1);
  }, [showToast]);

  useEffect(() => {
    clearCache();
    Promise.all([
      getPlaces(),
      getCircuits(),
      fetchAllBookings(),
    ]).then(([latestPlaces, latestCircuits, shared]) => {
      setPlaces(latestPlaces);
      setCircuits(latestCircuits);
      setSharedBookings(shared);
      setSyncState(import.meta.env.VITE_GITHUB_TOKEN ? 'synced' : 'token_missing');
      setSyncTimestamp(new Date().toLocaleTimeString());
      setInitialLoading(false);
    }).catch(() => {
      setSyncState('error');
      setSyncTimestamp(new Date().toLocaleTimeString());
      setInitialLoading(false);
    });
  }, []);

  const allBookings = useMemo(() => {
    const seenSet = new Set();
    return [...sharedBookings, ...localBookings].filter(b => {
      if (seenSet.has(b.id)) return false;
      seenSet.add(b.id);
      return true;
    });
  }, [sharedBookings, localBookings]);

  const handleStatusUpdate = useCallback(async (bookingId, newStatus, rider) => {
    try {
      await updateSingleBooking(bookingId, { status: newStatus, rider });
      // Re-fetch shared bookings to get latest state
      const shared = await fetchAllBookings();
      setSharedBookings(shared);
      refreshBookings();
      showToast(`Updated to ${newStatus}`, 'success');
    } catch {
      showToast('Update failed', 'error');
    }
  }, [refreshBookings, showToast]);

  const handleDeleteBooking = useCallback(async (bookingId) => {
    try {
      await deleteBooking(bookingId);
      const shared = await fetchAllBookings();
      setSharedBookings(shared);
      refreshBookings();
      showToast('Deleted', 'success');
    } catch {
      showToast('Delete failed', 'error');
    }
  }, [refreshBookings, showToast]);

  const handleManualSync = useCallback(() => {
    setSyncState('loading');
    refreshAllData(false).then(() => {
      setSyncState('synced');
      setSyncTimestamp(new Date().toLocaleTimeString());
      showToast('Synced', 'success');
    }).catch(() => { setSyncState('error'); showToast('Sync failed', 'error'); });
  }, [showToast, refreshAllData]);

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

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-var-border border-t-yellow-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black font-black text-lg uppercase tracking-wider font-['Anton']">Loading Admin Panel</p>
          <p className="text-black/50 text-xs mt-1 font-bold">Fetching data from GitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence><Toast toast={toast} onDone={() => setToast(null)} /></AnimatePresence>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-yellow-500 border-b-4 border-var-border shadow-neo">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">ADMIN PANEL</h1>
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border-2 border-var-border ${
                syncState === 'loading' ? 'bg-white text-black' :
                syncState === 'synced' ? 'bg-green-500 text-white' :
                syncState === 'token_missing' ? 'bg-white text-black' :
                'bg-red-500 text-white'
              }`}>
                {syncState === 'loading' ? 'Connecting...' : syncState === 'synced' ? `Synced (${sharedBookings.length} remote)` : syncState === 'token_missing' ? 'Local only' : 'Error'}
              </span>
              <span className={`w-3 h-3 border-2 border-var-border ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} title={isOnline ? 'Online' : 'Offline'} />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleManualSync} className="bg-white border-4 border-var-border shadow-neo px-3 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                Sync
              </button>
              <button type="button" onClick={exportCSV} className="bg-white border-4 border-var-border shadow-neo px-4 py-2 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">CSV</button>
              <span className="text-black font-black text-lg sm:text-xl ml-2 font-['Anton'] tracking-wider">Shillong<span className="text-black/60">Ride</span></span>
            </div>
          </div>
          {syncTimestamp && <p className="text-black/60 text-[10px] font-bold mt-1">Last sync: {syncTimestamp}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
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
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-4 border-var-border transition-all ${
                tab === t.id
                  ? 'bg-black text-white shadow-neo'
                  : 'bg-white text-black hover:shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'dashboard' && <DashboardView bookings={allBookings} />}
        {tab === 'bookings' && (
          <BookingsView key={refreshKey} bookings={allBookings} places={places} exportCSV={exportCSV}
            onUpdateStatus={handleStatusUpdate} onDeleteBooking={(id) => setDeleteConfirmId(id)}
            onWhatsAppOpen={(b) => setWhatsAppBooking(b)} />
        )}
        {tab === 'catalog' && <CatalogView key={refreshKey} places={places} circuits={circuits} onToast={showToast} onRefresh={() => refreshAllData(true)} />}
        {tab === 'riders' && <RidersView onToast={showToast} />}
        {tab === 'circuits' && <CircuitsView key={refreshKey} places={places} circuits={circuits} onCircuitEdit={(c) => setEditingCircuit(c)} onToast={showToast} onRefresh={() => refreshAllData(true)} />}
        {tab === 'images' && <ImageUploader />}
        {tab === 'activity' && <ActivityLogView />}
      </div>

      <ConfirmDialog open={!!deleteConfirmId} title="Delete Booking?" message="Permanently remove this booking from the server?" confirmLabel="Delete" cancelLabel="Cancel" destructive
        onConfirm={async () => { if (deleteConfirmId) await handleDeleteBooking(deleteConfirmId); setDeleteConfirmId(null); }}
        onCancel={() => setDeleteConfirmId(null)} />

      {editingCircuit && <CircuitEditor circuit={editingCircuit} allPlaces={places} onClose={() => setEditingCircuit(null)}
        onSaved={() => { showToast('Circuit saved!', 'success'); refreshAllData(false); }} onError={(msg) => showToast(msg, 'error')} />}

      <WhatsAppTemplateSelector
        open={!!whatsAppBooking}
        onClose={() => setWhatsAppBooking(null)}
        booking={whatsAppBooking}
      />
    </div>
  );
}