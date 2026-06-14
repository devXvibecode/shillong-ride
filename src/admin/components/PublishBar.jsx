import { Cloud, CloudOff, Loader } from 'lucide-react'

export default function PublishBar({ loading, dirty, onPublish, onCancel, status }) {
  if (!dirty && !loading) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg px-4 lg:pl-60 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          {loading ? (
            <Loader className="w-4 h-4 text-blue-500 animate-spin" />
          ) : status === 'published' ? (
            <Cloud className="w-4 h-4 text-green-500" />
          ) : (
            <CloudOff className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-slate-600">
            {loading ? 'Publishing...' : status === 'published' ? 'Published successfully' : 'You have unpublished changes'}
          </span>
        </div>
        {!loading && status !== 'published' && (
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={onPublish} className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Publish Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
