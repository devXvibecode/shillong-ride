import { useState, useMemo, useCallback } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ArrowUp, ArrowDown, Plus, Trash2, Pencil, X } from 'lucide-react'
import SlidePanel from '../components/SlidePanel'
import { publish } from '../publishService'

function SortableSpot({ spot, index, total, onMoveUp, onMoveDown, onRemove, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: spot.id })
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 'auto' }

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-3 ${isDragging ? 'shadow-lg border-blue-300' : ''}`}>
      <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"><GripVertical className="w-4 h-4" /></button>
      <span className="text-xs font-mono text-slate-400 w-6">{index + 1}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{spot.name}</p>
        <p className="text-xs text-slate-400">{spot.category} • ₹{spot.price}</p>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(spot)} className="p-1 text-slate-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={() => onMoveUp(index)} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
        <button onClick={() => onMoveDown(index)} disabled={index === total - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
        <button onClick={() => onRemove(spot.id)} className="p-1 text-slate-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}

export default function Routes({ places: allPlaces, circuits: initial }) {
  const [circuits, setCircuits] = useState(initial)
  const [selectedId, setSelectedId] = useState(circuits[0]?.id)
  const [editingSpot, setEditingSpot] = useState(null)
  const [showAddSpot, setShowAddSpot] = useState(false)
  const [addSpotSearch, setAddSpotSearch] = useState('')

  const selected = useMemo(() => circuits.find(c => c.id === selectedId), [circuits, selectedId])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const updated = circuits.map(c => {
      if (c.id !== selectedId) return c
      const spots = [...c.spots]
      const oldIndex = spots.findIndex(s => s.id === active.id)
      const newIndex = spots.findIndex(s => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return c
      const [moved] = spots.splice(oldIndex, 1)
      spots.splice(newIndex, 0, moved)
      return { ...c, spots }
    })
    setCircuits(updated)
  }, [circuits, selectedId])

  const moveSpot = (index, dir) => {
    const updated = circuits.map(c => {
      if (c.id !== selectedId) return c
      const spots = [...c.spots]
      const newIndex = index + dir
      if (newIndex < 0 || newIndex >= spots.length) return c
      ;[spots[index], spots[newIndex]] = [spots[newIndex], spots[index]]
      return { ...c, spots }
    })
    setCircuits(updated)
  }

  const removeSpot = (spotId) => {
    const updated = circuits.map(c => {
      if (c.id !== selectedId) return c
      return { ...c, spots: c.spots.filter(s => s.id !== spotId) }
    })
    setCircuits(updated)
  }

  const addSpotToCircuit = (place) => {
    const updated = circuits.map(c => {
      if (c.id !== selectedId) return c
      if (c.spots.find(s => s.id === place.id)) return c
      return { ...c, spots: [...c.spots, { id: place.id, name: place.name, category: place.category, price: place.price, description: place.description, distanceWeight: place.distanceWeight }] }
    })
    setCircuits(updated)
    setAddSpotSearch('')
  }

  const updateSpot = (place) => {
    const updated = circuits.map(c => {
      if (c.id !== selectedId) return c
      return { ...c, spots: c.spots.map(s => s.id === place.id ? { ...s, ...place } : s) }
    })
    setCircuits(updated)
    setEditingSpot(null)
  }

  const publishRoutes = () => {
    const allSpotIds = new Set()
    circuits.forEach(c => c.spots?.forEach(s => allSpotIds.add(s.id)))

    const placesData = allPlaces.filter(p => allSpotIds.has(p.id))
    circuits.forEach(c => {
      c.spots?.forEach(s => {
        if (!placesData.find(p => p.id === s.id)) {
          placesData.push(s)
        }
      })
    })

    publish({
      'data/circuits.json': circuits,
      'data/places.json': placesData,
    }, 'Update routes from admin')
  }

  const availablePlaces = useMemo(() => {
    if (!selected) return []
    const existingIds = new Set(selected.spots.map(s => s.id))
    const all = [...allPlaces, ...circuits.flatMap(c => c.spots || [])]
    const unique = {}
    all.forEach(p => { if (!unique[p.id]) unique[p.id] = p })
    let result = Object.values(unique).filter(p => !existingIds.has(p.id))
    if (addSpotSearch.trim()) { const q = addSpotSearch.toLowerCase(); result = result.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)) }
    return result
  }, [selected, allPlaces, circuits, addSpotSearch])

  if (circuits.length === 0) {
    return <p className="text-slate-400 text-center py-12">No circuits defined.</p>
  }

  const spotIds = selected?.spots?.map(s => s.id) || []

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {circuits.map(c => (
          <button key={c.id} onClick={() => setSelectedId(c.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedId === c.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >{c.shortName || c.name}</button>
        ))}
      </div>

      {selected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{selected.name}</h3>
                  <p className="text-sm text-slate-500">{selected.tagline}</p>
                </div>
                <span className="text-xs text-slate-400">{selected.spots?.length || 0} spots</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{selected.description}</p>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={spotIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {selected.spots?.map((spot, i) => (
                      <SortableSpot key={spot.id} spot={spot} index={i} total={selected.spots.length}
                        onMoveUp={(idx) => moveSpot(idx, -1)} onMoveDown={(idx) => moveSpot(idx, 1)}
                        onRemove={removeSpot} onEdit={(s) => setEditingSpot(s)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {(!selected.spots || selected.spots.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">No spots in this circuit. Click "Add Spot" to start.</p>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowAddSpot(!showAddSpot)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add Spot
              </button>
              <button onClick={publishRoutes} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Publish Routes
              </button>
            </div>

            {showAddSpot && (
              <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
                <input type="text" value={addSpotSearch} onChange={e => setAddSpotSearch(e.target.value)} placeholder="Search spots to add..." autoFocus
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {availablePlaces.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No spots found</p>
                  ) : availablePlaces.slice(0, 20).map(p => (
                    <button key={p.id} onClick={() => addSpotToCircuit(p)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors text-left"
                    >
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <span className="text-xs text-slate-400">{p.category} • ₹{p.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Circuit Info</h4>
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-400 text-xs block">ID</span><span className="font-mono text-xs">{selected.id}</span></div>
              <div><span className="text-slate-400 text-xs block">Short Name</span><span>{selected.shortName}</span></div>
              <div><span className="text-slate-400 text-xs block">Tagline</span><span className="text-slate-600">{selected.tagline}</span></div>
              <div><span className="text-slate-400 text-xs block">Color</span><span className="flex items-center gap-2"><span className="w-4 h-4 rounded" style={{ backgroundColor: selected.color || '#3B82F6' }} /> {selected.color}</span></div>
              <div><span className="text-slate-400 text-xs block">Spots</span><span>{selected.spots?.length || 0}</span></div>
            </div>
          </div>
        </div>
      )}

      <SlidePanel open={!!editingSpot} title="Edit Spot Details" onClose={() => setEditingSpot(null)}>
        {editingSpot && (
          <form onSubmit={(e) => { e.preventDefault(); updateSpot(editingSpot) }} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
              <input type="text" value={editingSpot.name} onChange={e => setEditingSpot(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
              <textarea value={editingSpot.description} onChange={e => setEditingSpot(s => ({ ...s, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <input type="text" value={editingSpot.category} onChange={e => setEditingSpot(s => ({ ...s, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Price (₹)</label>
                <input type="number" value={editingSpot.price} onChange={e => setEditingSpot(s => ({ ...s, price: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Update Spot</button>
          </form>
        )}
      </SlidePanel>
    </div>
  )
}
