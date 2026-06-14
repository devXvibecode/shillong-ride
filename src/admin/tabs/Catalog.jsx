import { useState, useMemo } from 'react'
import { Search, Plus, Pencil, Trash2, LayoutGrid, Table as TableIcon, X, Check } from 'lucide-react'
import DataTable from '../components/DataTable'
import SlidePanel from '../components/SlidePanel'
import ConfirmDialog from '../components/ConfirmDialog'
import { publish } from '../publishService'

export default function Catalog({ places: initial, circuits }) {
  const [places, setPlaces] = useState(initial)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [view, setView] = useState('table')
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const categories = useMemo(() => [...new Set(places.map(p => p.category))].sort(), [places])

  const filtered = useMemo(() => {
    let r = places
    if (catFilter !== 'all') r = r.filter(p => p.category === catFilter)
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(p => p.name?.toLowerCase().includes(q) || p.id?.includes(q)) }
    return r
  }, [places, catFilter, search])

  const columns = [
    { key: 'id', label: 'ID', render: r => <span className="text-xs font-mono text-slate-400">{r.id}</span> },
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'category', label: 'Category', render: r => <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">{r.category}</span> },
    { key: 'price', label: 'Price', render: r => <span className="font-mono">₹{r.price}</span> },
    { key: 'distanceWeight', label: 'Dist', render: r => <span className="text-sm text-slate-500">{r.distanceWeight}</span> },
    { key: 'actions', label: '', sortable: false, render: r => (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => setEditing(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ]

  const savePlace = (place) => {
    let updated
    if (places.find(p => p.id === place.id)) {
      updated = places.map(p => p.id === place.id ? place : p)
    } else {
      updated = [...places, place]
    }
    setPlaces(updated)
    setEditing(null)
    publish({ 'data/places.json': updated }, updated.length > places.length ? `Add ${place.name}` : `Update ${place.name}`)
  }

  const removePlace = () => {
    if (!deleteTarget) return
    const updated = places.filter(p => p.id !== deleteTarget.id)
    setPlaces(updated)
    setDeleteTarget(null)
    publish({ 'data/places.json': updated }, `Remove ${deleteTarget.name}`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setView('table')} className={`p-1.5 rounded ${view === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><TableIcon className="w-4 h-4" /></button>
          <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search places..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setEditing({ id: '', name: '', description: '', category: '', price: 0, distanceWeight: 0, imageCount: 0 })}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        ><Plus className="w-4 h-4" /> Add Spot</button>
      </div>

      {view === 'table' ? (
        <DataTable columns={columns} data={filtered} pageSize={25} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setEditing(p)}>
              <div className="w-full h-24 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-300 text-2xl font-bold">{(p.name || '?')[0]}</div>
              <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{p.category}</span>
                <span className="text-xs font-mono font-semibold">₹{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SlidePanel open={!!editing} title={editing?.id && places.find(p => p.id === editing.id) ? 'Edit Spot' : 'Add Spot'} onClose={() => setEditing(null)}>
        {editing && <PlaceForm place={editing} onSave={savePlace} onCancel={() => setEditing(null)} />}
      </SlidePanel>

      <ConfirmDialog open={!!deleteTarget} title="Remove Spot" message={`Remove "${deleteTarget?.name}" from catalog? This may affect circuits that include this spot.`} onConfirm={removePlace} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

function PlaceForm({ place, onSave, onCancel }) {
  const [form, setForm] = useState(place)
  const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      id: form.id || slug(form.name),
      price: Number(form.price) || 0,
      distanceWeight: Number(form.distanceWeight) || 0,
      imageCount: Number(form.imageCount) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">ID (auto-generated)</label>
        <input type="text" value={form.id || slug(form.name)} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono bg-slate-50" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} list="categories"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <datalist id="categories">
            {['waterfall', 'lake', 'viewpoint', 'cave', 'forest', 'park', 'market', 'museum', 'religious', 'river', 'village', 'activity', 'restaurant'].map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Price (₹)</label>
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} min="0"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Distance Weight</label>
          <input type="number" value={form.distanceWeight} onChange={e => setForm(f => ({ ...f, distanceWeight: e.target.value }))} min="0"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Image Count</label>
          <input type="number" value={form.imageCount} onChange={e => setForm(f => ({ ...f, imageCount: e.target.value }))} min="0"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
          {place.id && places?.find?.(p => p.id === place.id) ? 'Update' : 'Create'} Spot
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
      </div>
    </form>
  )
}
