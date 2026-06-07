import { useState } from 'react';
import { motion } from 'framer-motion';
import circuits from '../data/circuits.json';
import places from '../data/places.json';
import { uploadImage, updateManifest } from '../engines/imageSyncService';

export default function ImageUploader() {
  const [circuitId, setCircuitId] = useState('');
  const [spotId, setSpotId] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const circuit = circuits.find(c => c.id === circuitId);
  const availableSpots = circuit
    ? [
        { id: circuit.id, name: "[CIRCUIT HEADER IMAGE]" },
        ...circuit.spots.map(id => places.find(p => p.id === id)).filter(Boolean)
      ]
    : [];

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!circuitId || !spotId || !file) {
      setStatus({ type: 'error', text: 'Select a circuit, spot, and image file.' });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', text: 'Uploading image to GitHub...' });

    const imgResult = await uploadImage(circuitId, spotId, file);
    if (!imgResult.success) {
      setStatus({ type: 'error', text: imgResult.error });
      setUploading(false);
      return;
    }

    setStatus({ type: 'info', text: 'Updating manifest...' });

    const manifestUrl = `/images/places/${circuitId}/${spotId}.${file.name.split('.').pop()}`;
    const manifestResult = await updateManifest(spotId, manifestUrl);

    if (!manifestResult.success) {
      setStatus({ type: 'warn', text: `Image uploaded but manifest failed: ${manifestResult.error}` });
    } else {
      setStatus({
        type: 'success',
        text: `Uploaded! Deploying in ~2 min. Image will appear at "/shillong-ride${manifestUrl}"`,
      });
    }

    setUploading(false);
    setFile(null);
    setPreview(null);
    document.getElementById('image-upload-input').value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6"
    >
      <h2 className="text-xl font-black text-black mb-1 uppercase tracking-wider">Upload Spot Images</h2>
      <p className="text-black/50 text-sm font-bold mb-6">
        Upload a photo from your device. It will be committed to GitHub and deployed automatically.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black/60 text-xs font-black uppercase tracking-wider mb-1.5 block">Circuit</label>
          <select
            value={circuitId}
            onChange={(e) => { setCircuitId(e.target.value); setSpotId(''); }}
            className="w-full px-3 py-2.5 border-4 border-black shadow-[3px_3px_0px_#000] text-black text-sm font-bold focus:outline-none appearance-none"
          >
            <option value="">Select circuit...</option>
            {circuits.map(c => (
              <option key={c.id} value={c.id}>{c.shortName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-black/60 text-xs font-black uppercase tracking-wider mb-1.5 block">Spot</label>
          <select
            value={spotId}
            onChange={(e) => setSpotId(e.target.value)}
            disabled={!circuitId}
            className="w-full px-3 py-2.5 border-4 border-black shadow-[3px_3px_0px_#000] text-black text-sm font-bold focus:outline-none appearance-none disabled:opacity-40"
          >
            <option value="">Select spot...</option>
            {availableSpots.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black/60 text-xs font-black uppercase tracking-wider mb-1.5 block">Image</label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="w-full text-sm text-black/70 file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:bg-yellow-500 file:text-black file:text-xs file:font-black file:uppercase file:tracking-wider file:cursor-pointer hover:file:bg-yellow-300 file:shadow-[3px_3px_0px_#000] file:transition-all"
        />
      </div>

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="max-h-48 border-4 border-black" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !circuitId || !spotId || !file}
        className={`w-full py-3 border-4 border-black shadow-[4px_4px_0px_#000] text-sm font-black uppercase tracking-wider transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
          uploading
            ? 'bg-yellow-300 text-black/50 cursor-not-allowed'
            : 'bg-yellow-500 text-black hover:bg-yellow-300'
        } disabled:opacity-40`}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {status && (
        <div className={`mt-4 px-4 py-3 border-4 border-black font-bold text-sm ${
          status.type === 'success' ? 'bg-green-500 text-white' :
          status.type === 'error' ? 'bg-red-500 text-white' :
          status.type === 'warn' ? 'bg-yellow-500 text-black' :
          'bg-white text-black'
        }`}>
          {status.text}
        </div>
      )}
    </motion.div>
  );
}