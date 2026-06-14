import { useState, useMemo } from 'react'
import { Upload, Trash2, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react'
import ImageUploader from '../../components/ImageUploader'
import EmptyState from '../components/EmptyState'

export default function Images({ circuits }) {
  const [selectedCircuit, setSelectedCircuit] = useState(circuits[0]?.id || '')
  const [images, setImages] = useState([])
  const [uploadResults, setUploadResults] = useState([])

  const circuitImages = useMemo(() => {
    return images.filter(i => i.circuit === selectedCircuit)
  }, [images, selectedCircuit])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Circuit</label>
          <select value={selectedCircuit} onChange={e => setSelectedCircuit(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option value="">Select circuit</option>
            {circuits.map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}
          </select>
        </div>
      </div>

      {selectedCircuit ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Upload Image</h3>
            <ImageUploader circuit={selectedCircuit} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Uploaded Images</h3>
            {circuitImages.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No images uploaded for this circuit yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {circuitImages.map((img, i) => (
                  <div key={i} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img src={img.url} alt={img.spot} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-1.5 bg-red-500 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">{img.spot}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState title="Select a circuit" description="Choose a circuit above to manage images." />
      )}

      {uploadResults.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Upload Results</h3>
          <div className="space-y-2">
            {uploadResults.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.success ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span className={r.success ? 'text-green-700' : 'text-red-700'}>{r.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
