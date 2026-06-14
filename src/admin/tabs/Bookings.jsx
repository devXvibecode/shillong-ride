import { useState, useMemo, useCallback } from 'react'
import { Search, Download, ChevronDown, ChevronUp, Phone, MessageSquare, Trash2 } from 'lucide-react'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import { WhatsAppTemplateSelector } from '../../components/WhatsAppDialog'
import { updateSingleBooking, deleteBooking } from '../../engines/bookingSyncService'
import { loadBookings, saveBookings, addActivity } from '../../engines/storageService'

const STATUS_FLOW = ['pending', 'approved', 'assigned', 'completed']
const STATUSES = ['all', 'pending', 'approved', 'assigned', 'completed', 'cancelled', 'rejected']

function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN') }
function getRevenue(b) { return b.priceBreakdown?.total || b.priceBreakdown?.groupTotal || 0 }
function formatDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
function formatTime(iso) { if (!iso) return '—'; return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }

export default function Bookings({ bookings: initial, places, onRefresh }) {
  const [bookings, setBookings] = useState(initial)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [whatsAppTarget, setWhatsAppTarget] = useState(null)
  const [assignInput, setAssignInput] = useState({})

  const filtered = useMemo(() => {
    let r = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(b => b.name?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q) || b.phone?.includes(q)) }
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [bookings, filter, search])

  const statusCounts = useMemo(() => {
    const counts = { total: bookings.length }
    STATUSES.forEach(s => { if (s !== 'all') counts[s] = bookings.filter(b => b.status === s).length })
    return counts
  }, [bookings])

  const updateBookingStatus = (id, newStatus, rider) => {
    const stored = loadBookings()
    const updated = stored.map(b => b.id === id ? { ...b, status: newStatus, rider: rider || b.rider } : b)
    saveBookings(updated)
    addActivity(`Booking ${newStatus}`, id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus, rider: rider || b.rider } : b))
    if (newStatus === 'assigned' && !rider) {
      updateSingleBooking(id, { status: 'assigned' }).catch(() => {})
    } else {
      updateSingleBooking(id, { status: newStatus, rider }).catch(() => {})
    }
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteBooking(deleteTarget.id).catch(() => {})
    const stored = loadBookings().filter(b => b.id !== deleteTarget.id)
    saveBookings(stored)
    addActivity('Booking Deleted', deleteTarget.id)
    setBookings(prev => prev.filter(b => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleAssign = (id) => {
    const rider = assignInput[id]
    if (!rider?.trim()) return
    updateBookingStatus(id, 'assigned', rider.trim())
    setAssignInput(prev => ({ ...prev, [id]: '' }))
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Status', 'Route', 'Revenue', 'Date']
    const rows = bookings.map(b => [b.id, b.name, b.phone, b.status, b.routeName || b.circuitId, getRevenue(b), formatDate(b.createdAt)])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'bookings.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'id', label: 'ID', render: r => <span className="text-xs font-mono text-slate-400">#{r.id?.slice(-6)}</span> },
    { key: 'name', label: 'Name', render: r => (
      <div><p className="font-medium text-slate-800">{r.name || 'Unknown'}</p><p className="text-xs text-slate-400">{r.phone}</p></div>
    )},
    { key: 'status', label: 'Status', render: r => {
      const colors = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-blue-100 text-blue-800', assigned: 'bg-purple-100 text-purple-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', rejected: 'bg-red-100 text-red-800' }
      return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
    }},
    { key: 'revenue', label: 'Revenue', render: r => <span className="font-mono text-sm">{fmt(getRevenue(r))}</span> },
    { key: 'date', label: 'Date', render: r => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    { key: 'actions', label: '', sortable: false, render: r => (
      <button onClick={e => { e.stopPropagation(); setExpandedId(expandedId === r.id ? null : r.id) }} className="p-1 text-slate-400 hover:text-slate-600">
        {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    )},
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 text-sm">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${filter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {s} {s !== 'all' && <span className="text-xs ml-1 opacity-60">({statusCounts[s] || 0})</span>}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, phone..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <DataTable columns={columns} data={filtered} pageSize={20} />

      {/* Expanded booking details */}
      {expandedId && (() => {
        const b = bookings.find(x => x.id === expandedId)
        if (!b) return null
        const isAssigned = b.status === 'assigned'
        const canModify = ['pending', 'approved', 'assigned'].includes(b.status)
        return (
          <div className="mt-4 bg-white rounded-xl border border-slate-200 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div><p className="text-xs text-slate-400 mb-1">Customer</p><p className="font-medium">{b.name}</p><p className="text-sm text-slate-500">{b.phone} {b.email && `• ${b.email}`}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Route</p><p className="font-medium">{b.routeName || b.circuitId || '—'}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Pickup</p><p className="text-sm">{b.pickupLocation || '—'}</p></div>
              {b.groupType && <div><p className="text-xs text-slate-400 mb-1">Group</p><p className="text-sm capitalize">{b.groupType}</p></div>}
              {b.vehicleType && <div><p className="text-xs text-slate-400 mb-1">Vehicle</p><p className="text-sm capitalize">{b.vehicleType}</p></div>}
              {b.homestayName && <div><p className="text-xs text-slate-400 mb-1">Homestay</p><p className="text-sm">{b.homestayName}</p></div>}
              <div><p className="text-xs text-slate-400 mb-1">Date</p><p className="text-sm">{formatDate(b.createdAt)} {formatTime(b.createdAt)}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Total</p><p className="font-semibold text-lg">{fmt(getRevenue(b))}</p></div>
              {b.rider && <div><p className="text-xs text-slate-400 mb-1">Assigned Rider</p><p className="text-sm">{b.rider}</p></div>}
            </div>

            {b.notes && <div className="mb-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600"><p className="text-xs text-slate-400 mb-1">Notes</p>{b.notes}</div>}

            {canModify && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                {STATUS_FLOW.indexOf(b.status) < STATUS_FLOW.length - 1 && (
                  <button onClick={() => updateBookingStatus(b.id, STATUS_FLOW[STATUS_FLOW.indexOf(b.status) + 1])}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >Move to {STATUS_FLOW[STATUS_FLOW.indexOf(b.status) + 1]}</button>
                )}
                {b.status === 'pending' && (
                  <button onClick={() => updateBookingStatus(b.id, 'approved')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >Approve</button>
                )}
                {(b.status === 'pending' || b.status === 'approved') && (
                  <div className="flex items-center gap-2">
                    <input type="text" value={assignInput[b.id] || ''} onChange={e => setAssignInput(p => ({ ...p, [b.id]: e.target.value }))}
                      placeholder="Rider name" className="w-32 px-2 py-1.5 border border-slate-200 rounded text-sm"
                    />
                    <button onClick={() => handleAssign(b.id)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >Assign</button>
                  </div>
                )}
                {['pending', 'approved', 'assigned'].includes(b.status) && (
                  <button onClick={() => updateBookingStatus(b.id, 'cancelled')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >Cancel</button>
                )}
                <button onClick={() => setWhatsAppTarget(b)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={() => setDeleteTarget(b)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        )
      })()}

      <ConfirmDialog open={!!deleteTarget} title="Delete Booking" message={`Are you sure you want to delete booking #${deleteTarget?.id?.slice(-6)}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {whatsAppTarget && <WhatsAppTemplateSelector booking={whatsAppTarget} onClose={() => setWhatsAppTarget(null)} />}
    </div>
  )
}
