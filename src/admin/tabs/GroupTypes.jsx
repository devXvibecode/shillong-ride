import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import DataTable from '../components/DataTable'
import SlidePanel from '../components/SlidePanel'
import ConfirmDialog from '../components/ConfirmDialog'

const GROUPS_KEY = 'sr_group_types'

function loadGroups() {
  try { return JSON.parse(localStorage.getItem(GROUPS_KEY)) }
  catch { return null }
}

export default function GroupTypes() {
  const defaultGroups = [
    { id: 'solo', name: 'Solo Explorer', groupSize: 1, multiplier: 1.3, description: 'Just you and the open road.', tag: 'Best for solo travelers' },
    { id: 'couple', name: 'Couple Escape', groupSize: 2, multiplier: 1.0, description: 'A shared adventure.', tag: 'Shared adventure' },
    { id: 'friends', name: 'Friends Trip', groupSize: 4, multiplier: 0.9, description: 'More the merrier.', tag: 'Best value' },
    { id: 'family', name: 'Family Package', groupSize: 5, multiplier: 0.85, description: 'Family fun on the road.', tag: 'Family friendly' },
  ]

  const initial = loadGroups() || defaultGroups
  const [groups, setGroups] = useState(initial)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const saveGroupsData = (data) => {
    try { localStorage.setItem(GROUPS_KEY, JSON.stringify(data)) } catch {}
  }

  const columns = [
    { key: 'name', label: 'Name', render: r => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'groupSize', label: 'Size', render: r => <span className="text-sm">{r.groupSize} pax</span> },
    { key: 'multiplier', label: 'Multiplier', render: r => <span className="font-mono">{r.multiplier}x</span> },
    { key: 'tag', label: 'Tag', render: r => <span className="text-xs text-slate-500">{r.tag || '—'}</span> },
    { key: 'actions', label: '', sortable: false, render: r => (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => setEditing(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ]

  const saveGroup = (data) => {
    let updated
    if (groups.find(g => g.id === data.id)) {
      updated = groups.map(g => g.id === data.id ? data : g)
    } else {
      updated = [...groups, { ...data, id: data.id || data.name.toLowerCase().replace(/\s+/g, '-') }]
    }
    setGroups(updated)
    saveGroupsData(updated)
    setEditing(null)
  }

  const removeGroup = () => {
    if (!deleteTarget) return
    const updated = groups.filter(g => g.id !== deleteTarget.id)
    setGroups(updated)
    saveGroupsData(updated)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-500 mb-3">Group types determine pricing multipliers for different party sizes. Changes apply instantly in localStorage.</p>
        <button onClick={() => setEditing({ id: '', name: '', groupSize: 1, multiplier: 1.0, description: '', tag: '' })}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
        ><Plus className="w-4 h-4" /> Add Group Type</button>
      </div>

      <DataTable columns={columns} data={groups} pageSize={20} />

      <SlidePanel open={!!editing} title={editing?.id && groups.find(g => g.id === editing.id) ? 'Edit Group Type' : 'Add Group Type'} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); saveGroup(editing) }} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
              <input type="text" value={editing.name} onChange={e => setEditing(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Group Size</label>
                <input type="number" value={editing.groupSize} onChange={e => setEditing(f => ({ ...f, groupSize: Number(e.target.value) || 1 }))} min="1" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Price Multiplier</label>
                <input type="number" value={editing.multiplier} onChange={e => setEditing(f => ({ ...f, multiplier: Number(e.target.value) || 1 }))} min="0.1" step="0.05" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
              <textarea value={editing.description} onChange={e => setEditing(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tag / Badge</label>
              <input type="text" value={editing.tag} onChange={e => setEditing(f => ({ ...f, tag: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="flex gap-2 pt-4">
              <button type="submit" className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            </div>
          </form>
        )}
      </SlidePanel>

      <ConfirmDialog open={!!deleteTarget} title="Remove Group Type" message={`Remove "${deleteTarget?.name}"? Existing bookings with this group type won't be affected.`} onConfirm={removeGroup} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}
