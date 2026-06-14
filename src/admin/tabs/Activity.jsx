import { useState, useMemo } from 'react'
import { Search, Download, Trash2 } from 'lucide-react'
import { addActivity } from '../../engines/storageService'

export default function Activity({ log }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const actionTypes = useMemo(() => {
    const types = new Set()
    log.forEach(e => types.add(e.action))
    return ['all', ...Array.from(types).sort()]
  }, [log])

  const filtered = useMemo(() => {
    let r = log
    if (filter !== 'all') r = r.filter(e => e.action === filter)
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(e => e.action.toLowerCase().includes(q) || (e.details || '').toLowerCase().includes(q)) }
    return r
  }, [log, filter, search])

  const clearLog = () => {
    try { localStorage.removeItem('sr_activity_log'); addActivity('Activity Log Cleared', 'All entries removed') } catch {}
    window.location.reload()
  }

  const exportLog = () => {
    const headers = ['Action', 'Details', 'Timestamp']
    const rows = filtered.map(e => [e.action, e.details || '', e.timestamp])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'activity-log.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const getColor = (action) => {
    const a = action.toLowerCase()
    if (a.includes('added') || a.includes('activated') || a.includes('completed')) return 'bg-green-100 text-green-700'
    if (a.includes('removed') || a.includes('deactivated') || a.includes('cancelled') || a.includes('deleted')) return 'bg-red-100 text-red-700'
    if (a.includes('updated') || a.includes('approved')) return 'bg-blue-100 text-blue-700'
    return 'bg-amber-100 text-amber-700'
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activity..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          {actionTypes.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
        </select>
        <button onClick={exportLog} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">{filtered.length} entries</p>
        <button onClick={clearLog} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
          <Trash2 className="w-3.5 h-3.5" /> Clear Log
        </button>
      </div>

      <div className="space-y-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12">No activity recorded.</p>
        ) : filtered.map(entry => (
          <div key={entry.id} className="flex items-center justify-between bg-white rounded-lg border border-slate-100 px-4 py-3 text-sm hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getColor(entry.action)}`}>{entry.action}</span>
              {entry.details && <span className="text-slate-500">{entry.details}</span>}
            </div>
            <span className="text-xs text-slate-400">{formatDate(entry.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
