import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../components/DataTable'
import SlidePanel from '../components/SlidePanel'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { publish } from '../publishService'

export default function Homestays({ homestays: initial, circuits }) {
  const [homestays, setHomestays] = useState(initial)
  const [circuitFilter, setCircuitFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    if (circuitFilter === 'all') return homestays
    return homestays.filter(h => h.circuitId === circuitFilter)
  }, [homestays, circuitFilter])

  const columns = [
    { key: 'name', label: 'Name', render: r => (
      <div><p className="font-medium text-slate-800">{r.name}</p><p className="text-xs text-slate-400">{r.vibe || ''}</p></div>
    )},
    { key: 'circuitId', label: 'Circuit', render: r => <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{r.circuitId}</span> },
    { key: 'price', label: 'Price', render: r => <span className="font-mono">₹{r.priceRange?.min}–{r.priceRange?.max}</span> },
    { key: 'rating', label: 'Rating', render: r => <span>{r.rating ? `${r.rating} ⭐` : '—'}</span> },
    { key: 'actions', label: '', sortable: false, render: r => (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => setEditing(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ]

  const saveHomestay = (data) => {
    let updated
    if (homestays.find(h => h.id === data.id)) {
      updated = homestays.map(h => h.id === data.id ? data : h)
    } else {
      updated = [...homestays, data]
    }
    setHomestays(updated)
    setEditing(null)
    publish({ 'data/homestays.json': updated }, updated.length > homestays.length ? `Add homestay ${data.name}` : `Update ${data.name}`)
  }

  const removeHomestay = () => {
    if (!deleteTarget) return
    const updated = homestays.filter(h => h.id !== deleteTarget.id)
    setHomestays(updated)
    setDeleteTarget(null)
    publish({ 'data/homestays.json': updated }, `Remove ${deleteTarget.name}`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={circuitFilter} onChange={e => setCircuitFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="all">All Circuits</option>
          {circuits.map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}
        </select>
        <button onClick={() => setEditing({ id: '', name: '', description: '', circuitId: circuits[0]?.id || '', vibe: '', amenities: [], priceRange: { min: 0, max: 0 }, rating: 4.0, imageRef: '' })}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        ><Plus className="w-4 h-4" /> Add Homestay</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No homestays yet" description="Add accommodations for premium booking packages." action="Add Homestay" onAction={() => setEditing({ id: '', name: '', description: '', circuitId: circuits[0]?.id || '', vibe: '', amenities: [], priceRange: { min: 0, max: 0 }, rating: 4.0, imageRef: '' })} />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={20} />
      )}

      <SlidePanel open={!!editing} title={editing?.id && homestays.find(h => h.id === editing.id) ? 'Edit Homestay' : 'Add Homestay'} onClose={() => setEditing(null)}>
        {editing && <HomestayForm data={editing} circuits={circuits} onSave={saveHomestay} onCancel={() => setEditing(null)} />}
      </SlidePanel>

      <ConfirmDialog open={!!deleteTarget} title="Remove Homestay" message={`Remove "${deleteTarget?.name}"?`} onConfirm={removeHomestay} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

function HomestayForm({ data, circuits, onSave, onCancel }) {
  const [form, setForm] = useState(data)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      id: form.id || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
      priceRange: { min: Number(form.priceRange?.min) || 0, max: Number(form.priceRange?.max) || 0 },
      rating: Number(form.rating) || 0,
      amenities: form.amenities || [],
    })
  }

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities?.includes(a) ? f.amenities.filter(x => x !== a) : [...(f.amenities || []), a]
    }))
  }

  const commonAmenities = ['Mountain view', 'Restaurant', 'Parking', 'Hot water', 'WiFi', 'Breakfast', 'Pickup', 'Guided tour']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Circuit</label>
          <select value={form.circuitId} onChange={e => setForm(f => ({ ...f, circuitId: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
            {circuits.map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Vibe / Theme</label>
          <input type="text" value={form.vibe} onChange={e => setForm(f => ({ ...f, vibe: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Min Price (₹)</label>
          <input type="number" value={form.priceRange?.min} onChange={e => setForm(f => ({ ...f, priceRange: { ...f.priceRange, min: e.target.value } }))} min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Max Price (₹)</label>
          <input type="number" value={form.priceRange?.max} onChange={e => setForm(f => ({ ...f, priceRange: { ...f.priceRange, max: e.target.value } }))} min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
        <input type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} min="0" max="5" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {commonAmenities.map(a => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${form.amenities?.includes(a) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
            >{a}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
      </div>
    </form>
  )
}
