import { useState, useEffect, useCallback } from 'react';
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

function saveBookings(bookings) {
  localStorage.setItem('sr_bookings', JSON.stringify(bookings));
}

function removeMyBooking(id) {
  const bookings = loadBookings().filter(b => b.id !== id);
  saveBookings(bookings);
}
import { fetchAllBookings, updateSingleBooking } from '../engines/bookingSyncService';
import { useToast } from '../components/Toast';
import EditSpotModal from '../components/EditSpotModal';
import ConfirmDialog from '../components/ConfirmDialog';

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  approved: { label: 'Approved', bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
  canceled: { label: 'Cancelled', bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
  cancel_requested: { label: 'Cancel Requested', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
};

export default function MyBookings() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBooking, setEditingBooking] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const refreshBookings = useCallback(async () => {
    try {
      const remote = await fetchAllBookings();
      saveBookings(remote);
      setBookings(remote);
    } catch {
      setBookings(loadBookings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshBookings(); }, [refreshBookings]);

  const handleSaveEdit = async (updated) => {
    try {
      await updateSingleBooking(updated);
      addToast('Spots updated successfully', 'success');
      setEditingBooking(null);
      refreshBookings();
    } catch {
      addToast('Failed to update spots', 'error');
    }
  };

  const handleDelete = async (b) => {
    try {
      removeMyBooking(b.id);
      await updateSingleBooking({ ...b, spots: [], route: [], spotNames: [] }, true);
      addToast('Booking deleted from server', 'success');
      setConfirmDelete(null);
      refreshBookings();
    } catch {
      addToast('Failed to delete booking', 'error');
    }
  };

  const handleCancelRequest = async (b) => {
    try {
      const updated = { ...b, status: 'cancel_requested' };
      await updateSingleBooking(updated);
      addToast('Cancellation request sent', 'success');
      setConfirmCancel(null);
      refreshBookings();
    } catch {
      addToast('Failed to request cancellation', 'error');
    }
  };

  const filtered = bookings.filter(b => statusFilter === 'all' || b.status === statusFilter);

  const buttonClasses = (active) =>
    `px-4 py-2 text-xs font-['Anton'] uppercase tracking-wider rounded-lg transition-all ${
      active ? 'brut-btn-primary' : 'brut-btn'
    }`;

  return (
    <div className="min-h-screen px-5 pb-16 pt-20 sm:pt-24">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-['Anton'] text-4xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-2">My Bookings</h1>
          <p className="text-white/55 text-sm">All your ShillongRide bookings in one place.</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'approved', 'cancel_requested', 'canceled'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={buttonClasses(statusFilter === s)}
            >
              {s === 'all' ? 'All' : s === 'cancel_requested' ? 'Cancel Req.' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

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
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 border-2 border-dashed border-[#2e2e44] rounded-xl"
            >
              <p className="text-white/55 text-lg font-['Anton'] uppercase tracking-wider mb-4">No bookings found</p>
              <Link to="/booking" className="brut-btn-primary inline-block px-8 py-3 text-sm tracking-widest uppercase">
                Go to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {filtered.map(b => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
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
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-['Anton'] uppercase tracking-wider border-2 ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                        <p className="text-orange-500 font-['Anton'] text-base tracking-wider">{fmt(b.priceBreakdown?.total || 0)}</p>
                      </div>
                      <div>
                        <p className="text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">Status</p>
                        <p className="text-white/80 font-['Anton'] text-xs uppercase tracking-wider">{b.status}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t-2 border-[#2e2e44] pt-3">
                      {['pending', 'approved'].includes(b.status) && (
                        <>
                          <button
                            onClick={() => setEditingBooking(b)}
                            className="brut-btn flex-1 py-2 text-xs uppercase tracking-wider"
                          >
                            Edit Spots
                          </button>
                          <button
                            onClick={() => setConfirmCancel(b)}
                            className="brut-btn flex-1 py-2 text-xs uppercase tracking-wider"
                          >
                            Request Cancellation
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setConfirmDelete(b)}
                        className="brut-btn flex-shrink-0 py-2 px-3 text-xs"
                        title="Delete from server"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {editingBooking && (
        <EditSpotModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Delete Booking"
        message={`Permanently delete booking ${confirmDelete?.id} from the server? The customer's local copy won't be affected.`}
        confirmText="Delete"
        destructive
      />

      <ConfirmDialog
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => handleCancelRequest(confirmCancel)}
        title="Request Cancellation"
        message="Send a cancellation request to the admin? The booking will be marked for review."
        confirmText="Request Cancellation"
      />
    </div>
  );
}
