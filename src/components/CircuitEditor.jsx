import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllImagesForPlace, getImageSourceList, addImageToPlace, removeImageFromPlace, setPrimaryImage, resetPlaceImages } from '../engines/imageService';
import { saveCircuitData, fetchFileFromGitHub } from '../engines/adminSyncService';
import Modal from './Modal';

const CATEGORIES = ['lake', 'waterfall', 'viewpoint', 'museum', 'forest', 'village', 'river', 'cave', 'religious', 'market', 'park', 'activity'];

function slugify(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/_+/g, '_');
}

function roman(i) {
  return ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'][i] || String(i + 1);
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function PlaceRow({ place, idx, onEdit, onRemove, onManageImages }) {
  const [showActions, setShowActions] = useState(false);
  const imgUrl = getImageSourceList(place.id)[0] || '';
  const imgCount = getAllImagesForPlace(place.id).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-2.5 bg-white border-4 border-var-border group hover:shadow-neo transition-all"
    >
      <span className="font-['Anton'] text-black/30 text-xs w-5 text-center flex-shrink-0">{roman(idx)}</span>
      <div className="w-12 h-12 border-2 border-var-border flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgUrl})` }} />
      <div className="flex-1 min-w-0">
        <p className="text-black text-sm font-['Anton'] tracking-wider truncate">{place.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-black/40 text-[9px] font-mono">{place.distanceWeight} km</span>
          <span className="text-black/30 text-[9px] font-mono">·</span>
          <span className="text-black/40 text-[9px] font-mono">{fmt(place.price)} entry</span>
          <span className="text-black/30 text-[9px] font-mono">·</span>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 border-2 border-var-border ${
            place.category === 'waterfall' ? 'text-blue-600 bg-blue-100' :
            place.category === 'viewpoint' ? 'text-purple-600 bg-purple-100' :
            place.category === 'lake' ? 'text-cyan-600 bg-cyan-100' :
            place.category === 'cave' ? 'text-yellow-600 bg-yellow-100' :
            place.category === 'village' ? 'text-green-600 bg-green-100' :
            place.category === 'river' ? 'text-teal-600 bg-teal-100' :
            'text-black/50 bg-gray-100'
          }`}>{place.category}</span>
        </div>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowActions(!showActions)}
          className="w-7 h-7 flex items-center justify-center text-black/40 hover:text-black hover:bg-yellow-500 border-2 border-var-border transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
          </svg>
        </button>
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="absolute right-0 top-full mt-1 z-30 w-44 bg-white border-4 border-var-border shadow-neo-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => { setShowActions(false); onEdit(place); }}
                className="w-full px-3 py-2 text-left text-xs text-black/80 hover:bg-yellow-500 hover:text-black flex items-center gap-2 font-bold border-b-2 border-var-border"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit Details
              </button>
              <button
                type="button"
                onClick={() => { setShowActions(false); onManageImages(place); }}
                className="w-full px-3 py-2 text-left text-xs text-black/80 hover:bg-yellow-500 hover:text-black flex items-center gap-2 font-bold border-b-2 border-var-border"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                Manage Images
                {imgCount > 0 && <span className="text-black/30 ml-auto">({imgCount})</span>}
              </button>
              <button
                type="button"
                onClick={() => { setShowActions(false); onRemove(place); }}
                className="w-full px-3 py-2 text-left text-xs text-red-500 hover:bg-red-100 flex items-center gap-2 font-bold"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                Remove from Circuit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function NewSpotForm({ onSave, onCancel, existingIds }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('waterfall');
  const [distance, setDistance] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');
    if (!name.trim()) { setError('Spot name is required'); return; }
    if (!distance.trim() || isNaN(Number(distance)) || Number(distance) <= 0) { setError('Distance must be a positive number'); return; }
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) { setError('Entry price must be a valid number'); return; }

    const id = slugify(name);
    if (!id) { setError('Name must contain letters or numbers'); return; }
    if (existingIds.includes(id)) {
      setError(`ID "${id}" already exists. Use a different name.`);
      return;
    }

    onSave({
      id,
      name: name.trim(),
      description: desc.trim() || `${name.trim()} — a scenic destination in Meghalaya.`,
      price: Number(price),
      distanceWeight: Number(distance),
      imageCount: 0,
      category,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-var-border shadow-neo-lg p-5 mb-4"
    >
      <h4 className="font-['Anton'] text-black text-xs uppercase tracking-[0.15em] mb-4">New Spot Details</h4>
      <div className="space-y-3">
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Spot Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Sunset Point" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
          {name && <p className="text-black/35 text-[9px] font-mono mt-0.5">ID: {slugify(name)}{existingIds.includes(slugify(name)) ? ' (taken)' : ''}</p>}
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe this destination..." rows={2} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Distance from Shillong *</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="km" min="1" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
            {distance && <p className="text-black/35 text-[9px] font-mono mt-0.5">Fuel: ₹{Number(distance) * 10}/km → ₹{Number(distance) * 20} round trip</p>}
          </div>
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Entry Price *</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="₹" min="0" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
        </div>
        <div className="bg-white border-4 border-var-border shadow-neo p-3 mt-2">
          <p className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Pricing Engine Preview</p>
          <div className="text-black/60 text-xs font-mono space-y-0.5">
            <p>Entry fee: {price ? fmt(Number(price)) : '—'}</p>
            <p>Fuel cost: ₹{distance ? Number(distance) * 10 : '?'}/km</p>
            <p>Round trip fuel (2 spots): ~₹{distance ? Number(distance) * 20 : '?'}</p>
          </div>
        </div>
        {error && <p className="text-red-500 text-[10px] font-['Anton'] uppercase tracking-wider">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={handleSave} className="bg-yellow-500 text-black border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider flex-1 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            Add Spot
          </button>
          <button type="button" onClick={onCancel} className="bg-white text-black border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CircuitEditor({ circuit, allPlaces, onClose, onSaved, onError }) {
  const [circuitSpots, setCircuitSpots] = useState(() => circuit.spots.map(id => allPlaces.find(p => p.id === id)).filter(Boolean));
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', distanceWeight: '', price: '', category: '' });
  const [managingImagesPlace, setManagingImagesPlace] = useState(null);

  const availablePlaces = useMemo(() => {
    const circuitSpotIds = new Set(circuitSpots.map(p => p.id));
    return allPlaces.filter(p => !circuitSpotIds.has(p.id) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search)));
  }, [allPlaces, circuitSpots, search]);

  const handleRemove = (place) => {
    setCircuitSpots(prev => prev.filter(p => p.id !== place.id));
  };

  const handleAddExisting = (place) => {
    setCircuitSpots(prev => [...prev, place]);
  };

  const handleNewSpotSave = (newPlace) => {
    setCircuitSpots(prev => [...prev, newPlace]);
    setShowNewForm(false);
  };

  const startEdit = (place) => {
    setEditingPlace(place);
    setEditForm({
      name: place.name,
      description: place.description,
      distanceWeight: String(place.distanceWeight),
      price: String(place.price),
      category: place.category,
    });
  };

  const handleEditSave = () => {
    if (!editForm.name.trim() || !editForm.distanceWeight.trim() || !editForm.price.trim()) return;
    setCircuitSpots(prev => prev.map(p =>
      p.id === editingPlace.id ? {
        ...p,
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        distanceWeight: Number(editForm.distanceWeight),
        price: Number(editForm.price),
        category: editForm.category,
      } : p
    ));
    setEditingPlace(null);
  };

  const handleSaveToGitHub = async () => {
    setSaving(true);
    try {
      let currentPlaces = allPlaces;
      try {
        const fetched = await fetchFileFromGitHub('data/places.json');
        if (fetched) currentPlaces = fetched;
      } catch { /* ignore */ }

      const mergedPlaces = [];
      const seen = new Set();
      // Merge: latest from GitHub first, then overlay with local allPlaces
      for (const p of [...currentPlaces, ...allPlaces]) {
        if (!seen.has(p.id)) { seen.add(p.id); mergedPlaces.push(p); }
      }

      // Apply any edits made within the circuit editor to the merged places
      const finalPlaces = mergedPlaces.map(existing => {
        const edited = circuitSpots.find(s => s.id === existing.id);
        if (edited && (edited.name !== existing.name || edited.description !== existing.description ||
            edited.distanceWeight !== existing.distanceWeight || edited.price !== existing.price ||
            edited.category !== existing.category)) {
          return { ...existing, ...edited };
        }
        return existing;
      });

      // Add any new spots created in the circuit editor that aren't in the places list
      const existingIds = new Set(finalPlaces.map(p => p.id));
      for (const spot of circuitSpots) {
        if (!existingIds.has(spot.id)) {
          finalPlaces.push(spot);
        }
      }

      // Fetch latest circuits from GitHub to avoid overwriting other changes
      let latestCircuits;
      try {
        const fetched = await fetchFileFromGitHub('data/circuits.json');
        latestCircuits = fetched;
      } catch { /* use allPlaces circuits data - passed via props */ }

      // We need circuits passed from parent; but if we have them from GitHub, use those
      let finalCircuits;
      if (latestCircuits) {
        finalCircuits = JSON.parse(JSON.stringify(latestCircuits));
      } else {
        // Make a copy from the props (we don't have them as a prop directly)
        // We'll re-fetch them if needed
        const refetchCircuits = await fetchFileFromGitHub('data/circuits.json');
        finalCircuits = refetchCircuits ? JSON.parse(JSON.stringify(refetchCircuits)) : [];
      }

      const circuitIdx = finalCircuits.findIndex(c => c.id === circuit.id);
      if (circuitIdx >= 0) {
        finalCircuits[circuitIdx] = { ...finalCircuits[circuitIdx], spots: circuitSpots.map(p => p.id) };
      }

      const result = await saveCircuitData(
        finalPlaces,
        finalCircuits,
        `Circuit update: ${circuit.shortName} — ${circuitSpots.length} spots`
      );

      if (result.success) {
        if (onSaved) onSaved();
        if (onClose) onClose();
      } else {
        if (onError) onError(result.error || 'Failed to save');
      }
    } catch (err) {
      if (onError) onError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setCircuitSpots(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index) => {
    if (index === circuitSpots.length - 1) return;
    setCircuitSpots(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const editModal = editingPlace && (
    <Modal open={true} onClose={() => setEditingPlace(null)} title={`Edit: ${editingPlace.name}`}>
      <div className="space-y-3">
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Name</label>
          <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Description</label>
          <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Distance (km)</label>
            <input type="number" value={editForm.distanceWeight} onChange={e => setEditForm(f => ({ ...f, distanceWeight: e.target.value }))} min="1" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
            <p className="text-black/35 text-[9px] font-mono mt-0.5">Fuel: ₹{Number(editForm.distanceWeight) * 10}/km</p>
          </div>
          <div>
            <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Entry Price (₹)</label>
            <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} min="0" className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
          </div>
        </div>
        <div>
          <label className="block text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Category</label>
          <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold appearance-none">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={handleEditSave} className="bg-yellow-500 text-black border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider flex-1 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Save Changes</button>
          <button type="button" onClick={() => setEditingPlace(null)} className="bg-white text-black border-4 border-var-border shadow-neo px-5 py-2.5 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Cancel</button>
        </div>
      </div>
    </Modal>
  );

  const imageModal = managingImagesPlace && (
    <ImageManagerEmbed
      place={managingImagesPlace}
      onClose={() => setManagingImagesPlace(null)}
    />
  );

  const allPlaceIds = useMemo(() => allPlaces.map(p => p.id), [allPlaces]);

  return (
    <>
      <Modal open={true} onClose={onClose} title={`Edit Circuit: ${circuit.shortName}`} subtitle={`${circuitSpots.length} spots in this circuit`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Circuit spots */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <p className="font-['Anton'] text-black/50 text-[10px] uppercase tracking-[0.15em]">Spots in this circuit</p>
                <button
                  type="button"
                  onClick={() => setManagingImagesPlace({ id: circuit.id, name: `${circuit.name} (Circuit Image)` })}
                  className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-wider border-2 border-var-border hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  Manage Circuit Images
                </button>
              </div>
              <span className="text-black/30 text-[9px] font-mono">Drag arrows to reorder</span>
            </div>

            <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto pr-1">
              {circuitSpots.length === 0 ? (
                <div className="text-center py-8 border-4 border-var-border shadow-neo bg-white">
                  <p className="text-black/40 text-xs font-['Anton'] uppercase tracking-wider">No spots in this circuit</p>
                  <p className="text-black/30 text-[10px] font-mono mt-1">Add spots from the right panel</p>
                </div>
              ) : circuitSpots.map((place, i) => (
                <div key={place.id} className="flex items-center gap-1">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => handleMoveUp(i)} disabled={i === 0} className="w-5 h-3.5 flex items-center justify-center text-black/20 hover:text-black/70 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
                    </button>
                    <button type="button" onClick={() => handleMoveDown(i)} disabled={i === circuitSpots.length - 1} className="w-5 h-3.5 flex items-center justify-center text-black/20 hover:text-black/70 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                  </div>
                  <PlaceRow
                    place={place}
                    idx={i}
                    onEdit={startEdit}
                    onRemove={handleRemove}
                    onManageImages={setManagingImagesPlace}
                  />
                </div>
              ))}
            </div>

            {circuitSpots.length > 0 && (
              <div className="bg-white border-4 border-var-border shadow-neo p-3">
                <p className="text-black/50 text-[10px] font-['Anton'] uppercase tracking-wider mb-1.5">Suggested Route Order</p>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs font-mono text-black font-['Anton'] tracking-wider">Shillong</span>
                  {circuitSpots.map(p => (
                    <span key={p.id} className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-yellow-600"><polyline points="9 18 15 12 9 6" /></svg>
                      <span className="text-xs font-mono text-black/70">{p.name.split(' ')[0]}</span>
                    </span>
                  ))}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-yellow-600"><polyline points="9 18 15 12 9 6" /></svg>
                  <span className="text-xs font-mono text-black font-['Anton'] tracking-wider">Shillong</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Add spots */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Anton'] text-black/50 text-[10px] uppercase tracking-[0.15em]">Add Spots</p>
            </div>

            {!showNewForm && (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="w-full mb-3 px-4 py-3 border-4 border-dashed border-var-border text-black font-['Anton'] text-xs uppercase tracking-wider hover:bg-yellow-500 hover:border-solid transition-all flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add New Spot
              </button>
            )}

            <AnimatePresence>
              {showNewForm && (
                <NewSpotForm
                  onSave={handleNewSpotSave}
                  onCancel={() => setShowNewForm(false)}
                  existingIds={[...allPlaceIds]}
                />
              )}
            </AnimatePresence>

            <div className="relative mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search existing spots..."
                className="w-full pl-9 pr-3 py-2 text-xs border-4 border-var-border shadow-neo font-bold"
              />
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {availablePlaces.length === 0 ? (
                <p className="text-black/30 text-[10px] font-mono text-center py-4">No matching spots</p>
              ) : availablePlaces.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddExisting(p)}
                  className="w-full flex items-center gap-2 p-2 border-2 border-var-border hover:bg-yellow-500 hover:border-var-border transition-all text-left group"
                >
                  <div className="w-8 h-8 border-2 border-var-border flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${getImageSourceList(p.id)[0] || ''})` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-black/70 text-xs font-['Anton'] tracking-wider truncate group-hover:text-black transition-colors">{p.name}</p>
                    <p className="text-black/30 text-[9px] font-mono">{p.distanceWeight} km · {p.category}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/20 group-hover:text-black flex-shrink-0">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t-4 border-var-border">
          <p className="text-black/40 text-[10px] font-mono font-bold">
            {circuitSpots.length} spot{circuitSpots.length !== 1 ? 's' : ''} ·
            {circuitSpots.reduce((sum, p) => sum + p.distanceWeight, 0)} total km ·
            ₹{circuitSpots.reduce((sum, p) => sum + (p.price || 0), 0)} total entry fees
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="bg-white text-black border-4 border-var-border shadow-neo px-4 py-2 text-xs font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Cancel</button>
            <button
              type="button"
              onClick={handleSaveToGitHub}
              disabled={saving}
              className={`bg-yellow-500 text-black border-4 border-var-border shadow-neo px-5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${saving ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : 'Save & Deploy →'}
            </button>
          </div>
        </div>
      </Modal>

      {editModal}
      {imageModal}
    </>
  );
}

function ImageManagerEmbed({ place, onClose }) {
  const [images, setImages] = useState(() => getAllImagesForPlace(place.id));
  const [newUrl, setNewUrl] = useState('');

  const refresh = () => setImages(getAllImagesForPlace(place.id));

  const handleAdd = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (addImageToPlace(place.id, url)) { refresh(); setNewUrl(''); }
  };

  const handleRemove = (index) => { removeImageFromPlace(place.id, index); refresh(); };
  const handleSetPrimary = (index) => { setPrimaryImage(place.id, index); refresh(); };
  const handleReset = () => { resetPlaceImages(place.id); refresh(); };

  return (
    <Modal open={true} onClose={onClose} title={`Images: ${place.name}`} subtitle="Add, remove, or set primary images">
      <div className="flex gap-2 mb-4">
        <input type="text" placeholder="Paste image URL..." value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="flex-1 px-3 py-2 text-sm border-4 border-var-border shadow-neo font-bold" />
        <button type="button" onClick={handleAdd} className="bg-yellow-500 text-black border-4 border-var-border shadow-neo px-4 py-2 text-sm font-black uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Add</button>
      </div>
      {images.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button type="button" onClick={handleReset} className="px-3 py-1.5 bg-red-500 text-white border-2 border-var-border font-bold text-xs hover:shadow-neo transition-all">Reset to Defaults</button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="group relative border-4 border-var-border bg-white overflow-hidden">
            <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => handleSetPrimary(idx)} className="w-8 h-8 bg-yellow-500 border-2 border-var-border flex items-center justify-center text-black hover:bg-yellow-300 transition-all" title="Set as primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </button>
              <button type="button" onClick={() => handleRemove(idx)} className="w-8 h-8 bg-red-500 border-2 border-var-border flex items-center justify-center text-white hover:bg-red-600 transition-all" title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
            {idx === 0 && <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-yellow-500 border-2 border-var-border text-black text-[9px] font-bold">PRIMARY</span>}
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <div className="text-center py-12 border-4 border-dashed border-var-border">
          <p className="text-black/40 text-sm font-bold">No images yet. Add an image URL above.</p>
        </div>
      )}
    </Modal>
  );
}