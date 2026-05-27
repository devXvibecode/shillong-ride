import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import placesData from '../data/places.json';
import { getPlaces } from '../engines/dataService';
import { fetchAllBookings, updateSingleBooking, deleteBooking } from '../engines/bookingSyncService';
import ImageUploader from '../components/ImageUploader';
import {
  getEffectiveImage,
  getAllImagesForPlace,
  getAllPlaceImages,
  addImageToPlace,
  removeImageFromPlace,
  setPrimaryImage,
  resetPlaceImages,
} from '../engines/imageService';

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

function BookingsView({ bookings, places, exportCSV, onUpdateStatus, onDeleteBooking }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    assigned: bookings.filter(b => b.status === 'assigned').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
    cancel_requested: bookings.filter(b => b.status === 'cancel_requested').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const updateStatus = (bookingId, newStatus, rider) => {
    const stored = loadBookings();
    const updated = stored.map(b => {
      if (b.id === bookingId) return { ...b, status: newStatus, rider: rider || b.rider };
      return b;
    });
    saveBookings(updated);
    if (onUpdateStatus) onUpdateStatus(bookingId, newStatus, rider);
    window.location.reload();
  };

  const getPlaceName = (id) => places.find(p => p.id === id)?.name || id;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-3 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Approved', value: stats.approved, color: 'text-blue-400' },
            { label: 'Assigned', value: stats.assigned, color: 'text-purple-400' },
            { label: 'Completed', value: stats.completed, color: 'text-green-400' },
            { label: 'Cancellation', value: stats.cancel_requested, color: 'text-orange-400' },
            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
              <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs sm:text-sm mt-1 capitalize">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'approved', 'assigned', 'completed', 'cancel_requested', 'cancelled', 'rejected'].map(status => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all flex-shrink-0 ${
              filter === status
                ? 'bg-amber-400 text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {status} {status !== 'all' && `(${stats[status] || 0})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
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
                      booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      booking.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      booking.status === 'cancel_requested' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm">{booking.name}</p>
                  <p className="text-white/50 text-xs">{booking.phone}</p>
                </div>
                <div className="text-left sm:text-right flex sm:block items-center gap-4 sm:gap-0">
                  {booking.rider && (
                    <p className="text-white/50 text-xs sm:mb-1">
                      Rider: <span className="text-white font-semibold">{booking.rider}</span>
                    </p>
                  )}
                  <p className="text-amber-400 font-bold">&#x20B9;{booking.priceBreakdown.total}</p>
                  <p className="text-white/30 text-[10px]">{new Date(booking.createdAt).toLocaleDateString()}</p>
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
                      <p className="text-white/40 text-[10px] mb-0.5">Circuit</p>
                      <p className="text-white font-semibold text-sm">{booking.circuitName || booking.circuitId || '\u2014'}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">Pickup Time</p>
                      <p className="text-white font-semibold text-sm">{booking.timeSlot || 'Scheduled post-booking'}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">Pickup Location</p>
                      <p className="text-white font-semibold text-sm">{booking.pickupLocation || 'Shillong'}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">Spots</p>
                      <p className="text-white font-semibold text-sm">{booking.spots.map(getPlaceName).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">Route Distance</p>
                      <p className="text-white font-semibold text-sm">{booking.priceBreakdown.routeDistance} km</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] mb-0.5">Vehicle</p>
                      <p className="text-white font-semibold text-sm uppercase">{booking.vehicleType || 'bike'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/40 text-[10px] mb-0.5">Full Route</p>
                    <p className="text-white/70 text-xs">{booking.route.map(id => getPlaceName(id) || id).join(' \u2192 ')}</p>
                  </div>

                  <div className="space-y-2 pb-3 border-b border-amber-400/20 mb-3">
                    <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Breakdown</p>
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-white/60">Processing &amp; Platform Fee</span>
                        <p className="text-white/30 text-[9px] font-mono">Platform, booking system &amp; support</p>
                      </div>
                      <span className="text-amber-400 font-extrabold">&#x20B9;{booking.priceBreakdown.ownerFee || booking.priceBreakdown.processingCharge}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Rider Cost</span>
                      <span className="text-white font-bold">&#x20B9;{booking.priceBreakdown.riderFee || booking.priceBreakdown.spotCost}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">Fuel Cost</span>
                      <span className="text-white font-bold">&#x20B9;{booking.priceBreakdown.fuelCost}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-extrabold text-sm">Total</span>
                    <span className="text-amber-400 font-extrabold">&#x20B9;{booking.priceBreakdown.total}</span>
                  </div>

                  {booking.notes && (
                    <div className="mb-4">
                      <p className="text-white/40 text-[10px] mb-0.5">Notes</p>
                      <p className="text-white/60 text-xs">{booking.notes}</p>
                    </div>
                  )}

                  {booking.emailSent === false && (
                    <div className="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-[11px] font-medium">&#x26A0; Email not sent \u2014 EmailJS not configured</p>
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
                            booking.status === s
                              ? 'bg-amber-400 text-black'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {s}
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
                            className="flex-1 max-w-xs px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:border-amber-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                updateStatus(booking.id, 'assigned', e.target.value.trim());
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
                          <button
                            type="button"
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                          >
                            Approve Cancellation
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(booking.id, 'pending')}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                          >
                            Deny Cancellation
                          </button>
                        </div>
                      </div>
                    )}
                    {booking.status === 'assigned' && booking.rider && (
                      <p className="text-white/50 text-[11px]">
                        Rider: <span className="text-white font-semibold">{booking.rider}</span>
                      </p>
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

function PlacesView({ places, categories, overridesVersion, refreshOverrides }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [managerPlace, setManagerPlace] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const placeImagesOverrides = getAllPlaceImages();

  const filtered = places.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search places..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>
          ))}
        </select>
      </div>

      <p className="text-white/40 text-xs mb-4">{filtered.length} places</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No places match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(place => {
            const hasOverride = placeImagesOverrides[place.id] && placeImagesOverrides[place.id].length > 0;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => { setManagerPlace(place); setNewImageUrl(''); }}
                className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden text-left hover:border-amber-400/40 transition-all group"
              >
                <div className="relative h-32 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${getEffectiveImage(place.id)})` }}
                  />
                  {hasOverride && (
                    <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-bold rounded">
                      EDITED
                    </span>
                  )}
                  <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 bg-black/60 border border-white/10 text-white/60 text-[9px] font-['Anton'] uppercase tracking-wider rounded">
                    {place.category}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-white font-semibold text-sm leading-tight">{place.name}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{place.distanceWeight} km</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {managerPlace && (
        <ImageManager
          place={managerPlace}
          onClose={() => setManagerPlace(null)}
          refreshOverrides={refreshOverrides}
        />
      )}
    </div>
  );
}

function ImageManager({ place, onClose, refreshOverrides }) {
  const [images, setImages] = useState(() => getAllImagesForPlace(place.id));
  const [newUrl, setNewUrl] = useState('');

  const refresh = () => {
    setImages(getAllImagesForPlace(place.id));
    refreshOverrides();
  };

  const handleAdd = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (addImageToPlace(place.id, url)) {
      refresh();
      setNewUrl('');
    }
  };

  const handleRemove = (index) => {
    removeImageFromPlace(place.id, index);
    refresh();
  };

  const handleSetPrimary = (index) => {
    setPrimaryImage(place.id, index);
    refresh();
  };

  const handleReset = () => {
    resetPlaceImages(place.id);
    refresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#12121a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#12121a] z-10 flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">{place.name}</h2>
            <p className="text-white/40 text-xs mt-0.5 capitalize">{place.category} &middot; {place.distanceWeight} km</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Paste image URL..."
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-amber-400 text-black font-bold text-sm rounded-lg hover:bg-amber-500 transition-all whitespace-nowrap"
            >
              Add Image
            </button>
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-all"
              >
                Reset to Defaults
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 hover:bg-amber-400/40 transition-all"
                    title="Set as primary"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-all"
                    title="Remove image"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-bold rounded">
                    PRIMARY
                  </span>
                )}
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-white/30 text-sm">No images yet. Add an image URL above.</p>
              <p className="text-white/20 text-xs mt-1">The default image will show until you add one.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState(loadBookings);
  const [sharedBookings, setSharedBookings] = useState([]);
  const [syncState, setSyncState] = useState('loading');
  const [places, setPlaces] = useState(placesData);
  const [overridesVersion, setOverridesVersion] = useState(0);
  const refreshOverrides = () => setOverridesVersion(v => v + 1);
  const categories = [...new Set(places.map(p => p.category))];

  useEffect(() => {
    getPlaces().then(setPlaces).catch(() => {});
  }, []);

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
  const allBookings = [...sharedBookings, ...bookings].filter(b => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  const handleStatusUpdate = (bookingId, newStatus, rider) => {
    updateSingleBooking(bookingId, { status: newStatus, rider });
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm(`Delete booking ${bookingId} from server? This won't affect the customer's local copy.`)) return;
    await deleteBooking(bookingId);
    window.location.reload();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Circuit', 'Vehicle', 'Pickup Location', 'Spots', 'Pickup Time', 'Status', 'Rider', 'Processing & Platform Fee', 'Rider Cost', 'Fuel Cost', 'Total', 'Route Distance', 'Notes', 'Created At'];
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
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
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
            <p className="text-white/50 text-sm sm:text-base mt-1">Manage bookings, places, and images</p>
          </div>
          <div className="flex items-center gap-3">
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
          {['bookings', 'places', 'images'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-amber-400 text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <BookingsView bookings={allBookings} places={places} exportCSV={exportCSV} onUpdateStatus={handleStatusUpdate} onDeleteBooking={handleDeleteBooking} />
        )}
        {tab === 'places' && (
          <PlacesView
            places={places}
            categories={categories}
            overridesVersion={overridesVersion}
            refreshOverrides={refreshOverrides}
          />
        )}
        {tab === 'images' && <ImageUploader />}
      </div>
    </div>
  );
}