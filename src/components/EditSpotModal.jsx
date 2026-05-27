import { useState, useMemo } from 'react';
import places from '../data/places.json';
import circuits from '../data/circuits.json';
import { optimizeRoute } from '../engines/routeOptimizer';
import { calculatePrice } from '../engines/pricingEngine';
import Modal from './Modal';

export default function EditSpotModal({ booking, onClose, onSave }) {
  const circuit = circuits.find(c => c.id === booking.circuitId);
  const circuitSpotIds = circuit?.spots || [];
  const availableSpots = places.filter(p => circuitSpotIds.includes(p.id));

  const [selectedSpots, setSelectedSpots] = useState([...booking.spots]);

  const route = useMemo(() => optimizeRoute(selectedSpots), [selectedSpots]);
  const price = useMemo(() => calculatePrice(route, booking.circuitId), [route, booking.circuitId]);

  const toggleSpot = (spotId) => {
    setSelectedSpots(prev => {
      if (prev.includes(spotId)) return prev.filter(id => id !== spotId);
      if (prev.length >= 4) return prev;
      return [...prev, spotId];
    });
  };

  const handleSave = () => {
    const spotNames = selectedSpots.map(id => places.find(p => p.id === id)?.name || id);
    const routeNames = ['Shillong City', ...spotNames, 'Shillong City'];
    const updatedBooking = {
      ...booking,
      spots: selectedSpots,
      route,
      spotNames,
      routeNames,
      priceBreakdown: price,
    };
    onSave(updatedBooking);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10" style={{background:'rgba(17,17,17,0.95)'}}>
        <div>
          <h2 className="text-white font-bold text-lg font-['Anton'] uppercase tracking-wider">Edit Spots</h2>
          <p className="text-white/55 text-xs mt-0.5">{booking.circuitName || booking.circuitId}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg glass-btn flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider">Select up to 4 spots</p>
          <span className={`px-3 py-1 rounded-lg text-sm font-bold font-['Anton'] tracking-wider ${
            selectedSpots.length === 4 ? 'bg-green-500/20 text-green-400' : 'glass-badge'
          }`}>
            {selectedSpots.length}/4
          </span>
        </div>

        {selectedSpots.length >= 4 && (
          <p className="text-green-400/80 text-xs mb-3 border-l-2 border-green-400/30 pl-3">
            Maximum 4 spots selected. Tap a selected spot to deselect.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {availableSpots.map(spot => {
            const isSelected = selectedSpots.includes(spot.id);
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => toggleSpot(spot.id)}
                disabled={!isSelected && selectedSpots.length >= 4}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/40 text-white'
                    : selectedSpots.length >= 4
                    ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                    : 'glass-card hover:border-white/30'
                }`}
              >
                <p className="font-semibold text-sm">{spot.name}</p>
                <p className="text-[10px] text-white/55 mt-0.5">{spot.category} · {spot.distanceWeight} km</p>
              </button>
            );
          })}
        </div>

        <div className="glass-card p-4 mb-6">
          <p className="text-white/55 text-xs font-bold uppercase tracking-wider mb-3">Updated Price</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/55">Platform Fee</span>
              <span className="text-amber-400 font-bold">₹{price.ownerFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/55">Rider Cost</span>
              <span className="text-white font-bold">₹{price.riderFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/55">Fuel Cost</span>
              <span className="text-white font-bold">₹{price.fuelCost}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-white font-bold">Total</span>
              <span className="text-amber-400 font-bold">₹{price.total}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 glass-btn px-4 py-3 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedSpots.length === 0}
            className="flex-1 glass-btn-primary px-4 py-3 text-sm disabled:opacity-40"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}