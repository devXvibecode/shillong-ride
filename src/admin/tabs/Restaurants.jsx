import { useState, useMemo } from 'react'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../components/DataTable'
import SlidePanel from '../components/SlidePanel'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import { publish } from '../publishService'

const CUISINE_TYPES = ['local', 'indian', 'chinese', 'continental', 'thai', 'mexican', 'cafe', 'bakery', 'multi-cuisine']
const RESTAURANTS_KEY = 'sr_restaurants'

function loadRestaurants() {
  try { return JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [] }
  catch { return [] }
}

function saveRestaurants(data) {
  try { localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(data)) } catch {}
}

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(loadRestaurants)
  const [search, setSearch] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    let r = restaurants
    if (cuisineFilter !== 'all') r = r.filter(res => res.cuisine === cuisineFilter)
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(res => res.name?.toLowerCase().includes(q)) }
    return r
  }, [restaurants, cuisineFilter, search])

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'cuisine', label: 'Cuisine', render: r => <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600 capitalize">{r.cuisine || '—'}</span> },
    { key: 'priceRange', label: 'Price Range', render: r => r.priceRange ? <span className="text-sm">₹{r.priceRange.min}–{r.priceRange.max}</span> : <span className="text-slate-400">—</span> },
    { key: 'rating', label: 'Rating', render: r => <span className="text-sm">{r.rating ? `${r.rating} ⭐` : '—'}</span> },
    { key: 'actions', label: '', sortable: false, render: r => (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => setEditing(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ]

  const saveRestaurant = (data) => {
    let updated
    if (restaurants.find(r => r.id === data.id)) {
      updated = restaurants.map(r => r.id === data.id ? data : r)
    } else {
      updated = [...restaurants, { ...data, id: data.id || Date.now().toString(36) }]
    }
    setRestaurants(updated)
    saveRestaurants(updated)
    setEditing(null)
  }

  const removeRestaurant = () => {
    if (!deleteTarget) return
    const updated = restaurants.filter(r => r.id !== deleteTarget.id)
    setRestaurants(updated)
    saveRestaurants(updated)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={cuisineFilter} onChange={e => setCuisineFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="all">All Cuisines</option>
          {CUISINE_TYPES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <button onClick={() => setEditing({ id: '', name: '', description: '', cuisine: '', priceRange: { min: 0, max: 0 }, rating: 4.0, contact: '', location: '', circuitId: '' })}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        ><Plus className="w-4 h-4" /> Add Restaurant</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Plus} title="No restaurants yet" description="Add your first restaurant to display on the site." action="Add Restaurant" onAction={() => setEditing({ id: '', name: '', description: '', cuisine: '', priceRange: { min: 0, max: 0 }, rating: 4.0, contact: '', location: '', circuitId: '' })} />
      ) : (
        <DataTable columns={columns} data={filtered} pageSize={20} />
      )}

      <SlidePanel open={!!editing} title={editing?.id && restaurants.find(r => r.id === editing.id) ? 'Edit Restaurant' : 'Add Restaurant'} onClose={() => setEditing(null)}>
        {editing && <RestaurantForm data={editing} onSave={saveRestaurant} onCancel={() => setEditing(null)} />}
      </SlidePanel>

      <ConfirmDialog open={!!deleteTarget} title="Remove Restaurant" message={`Remove "${deleteTarget?.name}"?`} onConfirm={removeRestaurant} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

function RestaurantForm({ data, onSave, onCancel }) {
  const [form, setForm] = useState(data)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      priceRange: { min: Number(form.priceRange?.min) || 0, max: Number(form.priceRange?.max) || 0 },
      rating: Number(form.rating) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Cuisine Type</label>
          <input type="text" value={form.cuisine} onChange={e => setForm(f => ({ ...f, cuisine: e.target.value }))} list="cuisines" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <datalist id="cuisines">{CUISINE_TYPES.map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
          <input type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} min="0" max="5" step="0.1" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
        <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
        <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Contact</label>
        <input type="text" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
      </div>
    </form>
  )
}
