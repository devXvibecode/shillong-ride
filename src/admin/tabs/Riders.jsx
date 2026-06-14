import { useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { loadRiders, saveRiders, addActivity } from '../../engines/storageService'

export default function Riders() {
  const [riders, setRiders] = useState(() => loadRiders())
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const addRider = () => {
    if (!newName.trim()) return
    const rider = { id: Date.now().toString(36), name: newName.trim(), phone: newPhone.trim(), active: true, createdAt: new Date().toISOString() }
    const updated = [...riders, rider]
    setRiders(updated); saveRiders(updated)
    addActivity('Rider Added', rider.name)
    setNewName(''); setNewPhone('')
  }

  const toggleRider = (id) => {
    const updated = riders.map(r => r.id === id ? { ...r, active: !r.active } : r)
    setRiders(updated); saveRiders(updated)
    const rider = updated.find(r => r.id === id)
    addActivity(rider.active ? 'Rider Activated' : 'Rider Deactivated', rider.name)
  }

  const removeRider = (id) => {
    const rider = riders.find(r => r.id === id)
    const updated = riders.filter(r => r.id !== id)
    setRiders(updated); saveRiders(updated)
    addActivity('Rider Removed', rider?.name)
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Add Rider</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Rider name"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => { if (e.key === 'Enter') addRider() }} />
          <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone (optional)"
            className="w-full sm:w-36 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => { if (e.key === 'Enter') addRider() }} />
          <button onClick={addRider} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {riders.length === 0 ? (
        <EmptyState title="No riders yet" description="Add riders to assign them to bookings." />
      ) : (
        <div className="space-y-2">
          {riders.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${r.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                  {(r.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{r.name}</p>
                  {r.phone && <p className="text-xs text-slate-400">{r.phone}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleRider(r.id)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${r.active ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>
                  {r.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {r.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => removeRider(r.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
