import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { optimizeRoute } from '../engines/routeOptimizer';
import { calculateNormalPrice } from '../engines/pricingEngine';
import hubs from '../data/hubs.json';

function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function validatePhone(v) {
  const cleaned = v.replace(/[\s\-\(\)]/g, '').replace(/^\+?91?/, '');
  return /^[0-9]{10}$/.test(cleaned) ? cleaned : null;
}

export default function NormalConfirm() {
  const {
    selectedCircuit, selectedSpots, formData, updateFormField,
    groupType, nodalPoint, timeSlot, submitting, submitNormalBooking,
    setStep,
  } = useBooking();
  const { places } = useData();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const route = useMemo(() => optimizeRoute(selectedSpots, nodalPoint), [selectedSpots, nodalPoint]);
  const price = useMemo(() => calculateNormalPrice(route, selectedCircuit?.id, groupType), [route, selectedCircuit?.id, groupType]);
  const spotIds = route.filter(id => id !== 'police_bazar');
  const spotPlaces = spotIds.map(id => places.find(p => p.id === id)).filter(Boolean);
  const hubName = hubs.find(h => h.id === nodalPoint)?.name || nodalPoint || 'Shillong';
  const timeLabel = timeSlot ? `${timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}` : 'Not set';

  const routeStops = [hubName, ...spotIds, hubName];

  useEffect(() => {
    const errs = {};
    if (touched.name && !formData.name.trim()) errs.name = 'Name is required';
    if (touched.phone) {
      if (!formData.phone.trim()) errs.phone = 'Phone is required';
      else if (!validatePhone(formData.phone)) errs.phone = 'Enter a valid 10-digit number';
    }
    setErrors(errs);
  }, [formData.name, formData.phone, touched]);

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    setTouched({ name: true, phone: true });
    if (errors.name || errors.phone || !formData.name.trim() || !validatePhone(formData.phone)) return;
    try {
      await submitNormalBooking();
      setStep(8);
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Something went wrong. Please try again.' }));
    }
  };

  const groupLabels = { solo: 'Solo', couple: 'Couple', friends: 'Friends', family: 'Family' };
  const timeLabels = { morning: 'Morning (8AM–12PM)', afternoon: 'Afternoon (12PM–4PM)', evening: 'Evening (4PM–8PM)' };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="brut-card p-5 sm:p-6 mb-5"
      >
        <h3 className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4 border-b-2 border-orange-500/20 pb-2">Route Preview</h3>
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {routeStops.map((stop, i) => (
            <span key={`${stop}-${i}`} className="flex items-center gap-1.5">
              <span className={`px-2.5 py-1 text-[9px] font-['Anton'] uppercase tracking-wider rounded-lg border-2 ${
                i === 0 || i === routeStops.length - 1
                  ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                  : 'bg-white/10 border-white/15 text-white'
              }`}>
                {stop.length > 20 ? stop.slice(0, 18) + '…' : stop}
              </span>
              {i < routeStops.length - 1 && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              )}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-[#16161f] p-3 rounded-lg border border-[#2e2e44]">
            <p className="text-white/40 text-[9px] font-['Anton'] uppercase tracking-wider">Group</p>
            <p className="text-white font-['Bebas_Neue'] tracking-wider">{groupLabels[groupType] || groupType}</p>
          </div>
          <div className="bg-[#16161f] p-3 rounded-lg border border-[#2e2e44]">
            <p className="text-white/40 text-[9px] font-['Anton'] uppercase tracking-wider">Pickup</p>
            <p className="text-white font-['Bebas_Neue'] tracking-wider">{hubName}</p>
          </div>
          <div className="bg-[#16161f] p-3 rounded-lg border border-[#2e2e44]">
            <p className="text-white/40 text-[9px] font-['Anton'] uppercase tracking-wider">Time</p>
            <p className="text-white font-['Bebas_Neue'] tracking-wider">{timeLabels[timeSlot] || timeSlot}</p>
          </div>
          <div className="bg-[#16161f] p-3 rounded-lg border border-[#2e2e44]">
            <p className="text-white/40 text-[9px] font-['Anton'] uppercase tracking-wider">Distance</p>
            <p className="text-white font-['Bebas_Neue'] tracking-wider">{price.routeDistance} km</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="brut-card p-5 sm:p-6 mb-5"
      >
        <h3 className="font-['Anton'] text-xs uppercase tracking-[0.15em] mb-4 border-b-2 border-[#2e2e44] pb-2 text-white/55">Your Details</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Name</label>
            <input type="text" value={formData.name} onChange={e => updateFormField('name', e.target.value)} onBlur={() => handleBlur('name')} placeholder="Your name" className={`brut-input w-full px-3 py-2.5 text-sm ${errors.name ? 'border-red-500/60' : ''}`} />
            {errors.name && <p className="text-red-400 text-[10px] mt-0.5 font-['Anton'] uppercase tracking-wider">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Phone</label>
            <input type="tel" value={formData.phone} onChange={e => updateFormField('phone', e.target.value)} onBlur={() => handleBlur('phone')} placeholder="10-digit" className={`brut-input w-full px-3 py-2.5 text-sm ${errors.phone ? 'border-red-500/60' : ''}`} />
            {errors.phone && <p className="text-red-400 text-[10px] mt-0.5 font-['Anton'] uppercase tracking-wider">{errors.phone}</p>}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="brut-card p-5 sm:p-6 mb-5"
      >
        <h3 className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4 border-b-2 border-orange-500/20 pb-2">Price Breakdown</h3>
        <div className="space-y-2.5">
          <div className="pb-1">
            <div className="flex justify-between items-center py-1 mb-1">
              <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em]">SERVICE COST</p>
              <span className="font-['Anton'] text-orange-500 text-sm">{fmt(price.serviceTotal)}</span>
            </div>
            {Object.entries(price.serviceBreakdown).map(([key, svc], i) => (
              <div key={key} className="flex justify-between items-center py-1 border-b-2 border-[#2e2e44] last:border-b-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Anton'] text-white/50 text-xs italic">{['i', 'ii'][i]}.</span>
                  <div>
                    <p className="font-['Anton'] text-xs sm:text-sm tracking-wider text-white/80">{svc.label}</p>
                    <p className="text-white/35 text-[9px] sm:text-[10px] font-mono">{svc.desc}</p>
                  </div>
                </div>
                <span className="font-['Anton'] text-xs sm:text-base text-white">{fmt(svc.amount)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <div>
              <p className="font-['Anton'] text-sm tracking-wider text-white/90">Rider Cost</p>
              <p className="text-white/40 text-[10px] font-mono">Your personal guide</p>
            </div>
            <span className="font-['Anton'] text-base text-orange-500">{fmt(price.riderFee)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]">
            <div>
              <p className="font-['Anton'] text-sm tracking-wider text-white/90">Fuel Cost</p>
              <p className="text-white/40 text-[10px] font-mono">{price.routeDistance} km at ₹10/km</p>
            </div>
            <span className="font-['Anton'] text-base text-orange-500">{fmt(price.fuelCost)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-orange-500/20">
          <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
          <span className="font-['Anton'] text-white text-2xl tracking-wider">{fmt(price.groupTotal || price.total)}</span>
        </div>
      </motion.div>

      {errors.submit && (
        <p className="text-red-400 text-xs text-center font-['Anton'] uppercase tracking-wider mb-4">{errors.submit}</p>
      )}

      <motion.button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        whileHover={!submitting ? { y: -3 } : {}}
        whileTap={!submitting ? { scale: 0.98 } : {}}
        className={`w-full py-4 font-['Anton'] text-base uppercase tracking-widest transition-all btn-bounce cursor-pointer ${
          submitting ? 'brut-btn-primary opacity-40 cursor-not-allowed' : 'brut-btn-primary'
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            PROCESSING...
          </span>
        ) : 'Confirm Adventure →'}
      </motion.button>

      <p className="text-white/30 text-[10px] text-center mt-4 font-mono uppercase tracking-widest">
        Pay after the ride — cash or UPI
      </p>
    </div>
  );
}
