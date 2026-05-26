import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { optimizeRoute } from '../engines/routeOptimizer';
import { calculatePrice } from '../engines/pricingEngine';

export default function Checkout() {
  const {
    selectedCircuit, selectedSpots,
    vehicleType, setVehicleType,
    formData, updateFormField, submitBooking, setStep, submitting,
  } = useBooking();
  const { places } = useData();
  const [errors, setErrors] = useState({});

  if (!selectedCircuit || selectedSpots.length === 0) return null;

  const route = optimizeRoute(selectedSpots);
  const price = calculatePrice(route, selectedCircuit.id);
  const spotIds = route.filter(id => id !== 'police_bazar');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.trim())) errs.phone = 'Enter a valid 10-digit number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitBooking();
      setStep(3);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-10 mt-4">
        <p className="text-white/40 font-['Anton'] text-xs uppercase tracking-[0.2em]">Step 3 of 4</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] border-2 border-black grunt-border p-5 sm:p-6 shadow-[0_3px_0_0_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-500/20">
              <div className="w-8 h-8 bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="font-['Bebas_Neue'] text-white text-base tracking-wider">ROUTE MANIFEST</h3>
            </div>

            <div className="mb-2">
              <span className="px-3 py-1.5 bg-orange-500/10 text-orange-400 border-2 border-orange-500/20 text-xs font-['Anton'] uppercase tracking-wider">
                {selectedCircuit.shortName}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-orange-500/15 text-orange-400 border-2 border-orange-500/30 text-xs font-['Anton'] uppercase tracking-wider">Shillong</span>
              {spotIds.map((spotId, i) => {
                const p = places.find(x => x.id === spotId);
                return (
                  <span key={spotId} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="px-3 py-1.5 bg-white/10 text-white border-2 border-white/10 text-xs font-['Anton'] uppercase tracking-wider">{p?.name || spotId}</span>
                  </span>
                );
              })}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="px-3 py-1.5 bg-orange-500/15 text-orange-400 border-2 border-orange-500/30 text-xs font-['Anton'] uppercase tracking-wider">Shillong</span>
            </div>
            <p className="text-white/30 text-xs mt-3 font-mono tracking-wider">
              ROUND TRIP · {price.routeDistance} KM TOTAL
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[#1a1a1a] border-2 border-black grunt-border p-5 sm:p-6 shadow-[0_3px_0_0_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-white/10">
                <div className="w-8 h-8 bg-white/10 border-2 border-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="font-['Bebas_Neue'] text-white text-base tracking-wider">INSPECTION FORM</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-['Anton'] uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => updateFormField('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 bg-[#2a2a2a] border-2 text-white placeholder-white/20 focus:outline-none transition-all ${
                        errors.name ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-['Anton'] uppercase tracking-wider">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-['Anton'] uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => updateFormField('phone', e.target.value)}
                      placeholder="Enter your 10-digit number"
                      className={`w-full px-4 py-3 bg-[#2a2a2a] border-2 text-white placeholder-white/20 focus:outline-none transition-all ${
                        errors.phone ? 'border-red-500/60' : 'border-white/10 focus:border-orange-500/50'
                      }`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1 font-['Anton'] uppercase tracking-wider">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-['Anton'] uppercase tracking-wider mb-1.5">Pickup Location</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={e => updateFormField('pickupLocation', e.target.value)}
                    placeholder="Your hotel or address in Shillong"
                    className="w-full px-4 py-3 bg-[#2a2a2a] border-2 border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-['Anton'] uppercase tracking-wider mb-1.5">Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setVehicleType('scooty')}
                      className={`p-3 border-2 text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                        vehicleType === 'scooty'
                          ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(230,81,0,0.1)]'
                          : 'bg-[#2a2a2a] border-white/10 text-white/50 hover:border-white/25'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5.5" cy="17.5" r="2.5" />
                        <circle cx="18.5" cy="17.5" r="2.5" />
                        <path d="M15 6h4l2 4" />
                        <path d="M8 17h7" />
                        <path d="M15 14L14 8H8" />
                        <path d="M5.5 17L3 8h2" />
                      </svg>
                      <span className="font-['Anton'] text-sm tracking-wider">Scooty</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType('bike')}
                      className={`p-3 border-2 text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                        vehicleType === 'bike'
                          ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 shadow-[0_0_10px_rgba(230,81,0,0.1)]'
                          : 'bg-[#2a2a2a] border-white/10 text-white/50 hover:border-white/25'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5.5" cy="17.5" r="2.5" />
                        <circle cx="18.5" cy="17.5" r="2.5" />
                        <path d="M15 6L13 10h4" />
                        <path d="M8 17l3-9h4" />
                        <path d="M5.5 17l-2-4h2" />
                      </svg>
                      <span className="font-['Anton'] text-sm tracking-wider">Bike</span>
                    </button>
                  </div>
                  <p className="text-white/25 text-[10px] font-mono mt-1.5">Choose your ride — scooty or bike</p>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-['Anton'] uppercase tracking-wider mb-1.5">Special Requests (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => updateFormField('notes', e.target.value)}
                    placeholder="Any special requests..."
                    rows={2}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border-2 border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {errors.submit && (
              <p className="text-red-400 text-sm text-center font-['Anton'] uppercase tracking-wider">{errors.submit}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 bg-[#1a1a1a] text-orange-400 font-['Anton'] text-sm uppercase tracking-wider border-2 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/60 hover:shadow-[2px_2px_0_0_rgba(230,81,0,0.3)] transition-all duration-200"
              >
                ← Change Route
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3.5 font-['Anton'] text-base uppercase tracking-wider transition-all duration-300 ${
                  submitting
                    ? 'bg-orange-500/30 text-white/40 cursor-not-allowed border-2 border-black'
                    : 'industrial-btn rounded-none'
                }`}
              >
                {submitting ? 'PROCESSING...' : 'APPROVE & CONFIRM →'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-[#1a1a1a] border-2 border-black grunt-border p-5 sm:p-6 shadow-[0_3px_0_0_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-orange-500/20">
                  <div className="w-8 h-8 bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="7" y1="7" x2="13" y2="21" />
                      <line x1="8" y1="13" x2="18" y2="13" />
                      <line x1="7" y1="17" x2="16" y2="17" />
                    </svg>
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-white text-base tracking-wider">INVOICE</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <p className="text-white/80 font-['Anton'] text-sm tracking-wider">1. Processing &amp; Platform Fee</p>
                      <p className="text-white/25 text-[10px] font-mono">Flat platform charge</p>
                    </div>
                    <span className="text-orange-400 font-['Anton'] text-base">₹{price.ownerFee}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <p className="text-white/80 font-['Anton'] text-sm tracking-wider">2. Rider Cost</p>
                      <p className="text-white/25 text-[10px] font-mono">Your personal guide</p>
                    </div>
                    <span className="text-orange-400 font-['Anton'] text-base">₹{price.riderFee}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-white/80 font-['Anton'] text-sm tracking-wider">3. Fuel Cost</p>
                      <p className="text-white/25 text-[10px] font-mono">{price.routeDistance} km travelled</p>
                    </div>
                    <span className="text-orange-400 font-['Anton'] text-base">₹{price.fuelCost}</span>
                  </div>
                </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t-2 border-orange-500/20">
                <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
                <span className="font-['Anton'] text-orange-500 text-2xl tracking-wider">₹{price.total}</span>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-dashed border-white/10 text-center">
                <p className="text-white/20 text-[10px] font-mono uppercase tracking-wider">Invoice #SR-{Date.now().toString(36).toUpperCase()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
