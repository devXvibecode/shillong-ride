import { useState, useEffect } from 'react'
import { Menu, Moon, Sun, Cloud, CloudOff, RefreshCw } from 'lucide-react'
import { getLastPublishTime } from '../publishService'

export default function TopBar({ onMenuClick, onSync }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('sr_admin_dark') === '1' }
    catch { return false }
  })
  const [lastSync, setLastSync] = useState(getLastPublishTime())
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const t = getLastPublishTime()
      if (t !== lastSync) setLastSync(t)
    }, 3000)
    return () => clearInterval(interval)
  }, [lastSync])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('sr_admin_dark', dark ? '1' : '0') } catch {}
  }, [dark])

  const handleSync = async () => {
    setSyncing(true)
    await onSync?.()
    setLastSync(getLastPublishTime())
    setTimeout(() => setSyncing(false), 500)
  }

  const timeAgo = lastSync ? Math.floor((Date.now() - new Date(lastSync).getTime()) / 60000) : null

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-700">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {lastSync ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-green-500" />
              <span>Synced {timeAgo === 0 ? 'just now' : `${timeAgo}m ago`}</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Not synced</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`w-4.5 h-4.5 ${syncing ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => setDark(d => !d)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>
    </header>
  )
}
