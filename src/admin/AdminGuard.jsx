import { useState } from 'react'
import { Lock } from 'lucide-react'

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'admin123'

export default function AdminGuard({ children }) {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('sr_admin_auth'))
  const [pass, setPass] = useState('')

  if (authed) return children

  const handleLogin = (e) => {
    e.preventDefault()
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('sr_admin_auth', '1')
      setAuthed(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
            <Lock className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center text-slate-900 mb-2">Admin Access</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Enter password to continue</p>
        <input
          type="password" value={pass} onChange={e => setPass(e.target.value)}
          placeholder="Password" autoFocus
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
          Unlock
        </button>
      </form>
    </div>
  )
}
