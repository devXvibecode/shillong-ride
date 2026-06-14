import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function SlidePanel({ open, title, children, onClose, width = 'max-w-lg' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (open) {
      ref.current?.focus()
      const handler = (e) => { if (e.key === 'Escape') onClose?.() }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}
      <div
        ref={ref}
        tabIndex={-1}
        className={`fixed top-0 right-0 h-full ${width} w-full bg-white shadow-xl z-50 transform transition-transform duration-200 outline-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-6" style={{ height: 'calc(100% - 56px)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
