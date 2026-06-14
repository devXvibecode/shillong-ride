import { FolderOpen } from 'lucide-react'

export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        {Icon ? <Icon className="w-8 h-8 text-slate-400" /> : <FolderOpen className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title || 'Nothing here yet'}</h3>
      {description && <p className="text-sm text-slate-400 mb-4 max-w-xs">{description}</p>}
      {action && (
        <button onClick={onAction} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {action}
        </button>
      )}
    </div>
  )
}
