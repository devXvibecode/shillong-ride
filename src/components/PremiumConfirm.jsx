import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { calculatePremiumPrice } from '../engines/pricingEngine';

function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function validatePhone(v) {
  const cleaned = v.replace(/[\s\-\(\)]/g, '').replace(/^\+?91?/, '');
  return /^[0-9]{10}$/.test(cleaned) ? cleaned : null;
}

const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export default function PremiumConfirm() {
  const {
    selectedCircuit, selectedSpots, formData, updateFormField,
    groupType, selectedHomestay, vehicleType, submitting, submitPremiumBooking,
    setStep, timeSlot,
  } = useBooking();
  const { places } = useData();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const price = useMemo(() => calculatePremiumPrice(vehicleType), [vehicleType]);
  const spotPlaces = selectedSpots.map(id => places.find(p => p.id === id)).filter(Boolean);

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
      await submitPremiumBooking();
      setStep(9);
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Something went wrong. Please try again.' }));
    }
  };

  const groupLabels = { solo: 'Solo Explorer', couple: 'Couple Escape', friends: 'Friends Trip', family: 'Family Journey' };

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="brut-card-accent p-5 sm:p-6 mb-5 border-orange-500/30"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 border-2 border-orange-500/30 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h3 className="font-['Anton'] text-white text-lg uppercase tracking-wider">Premium Package Summary</h3>
            <p className="text-white/55 text-xs">{selectedCircuit?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {[
            { label: 'Group', value: groupLabels[groupType] },
            { label: 'Vehicle', value: vehicleType === 'bike' ? '2-Wheeler' : '4-Wheeler' },
            { label: 'Stay', value: selectedHomestay?.name?.split(' ').slice(0, 2).join(' ') || 'Homestay' },
            { label: 'Spots', value: `${selectedSpots.length} destinations` },
          ].map(s => (
            <div key={s.label} className="bg-[#16161f] p-2.5 rounded-lg border border-[#2e2e44]">
              <p className="text-white/40 text-[8px] font-['Anton'] uppercase tracking-wider">{s.label}</p>
              <p className="text-white font-['Bebas_Neue'] text-sm tracking-wider truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="brut-card p-5 sm:p-6 mb-5"
      >
        <h3 className="font-['Anton'] text-xs uppercase tracking-[0.15em] mb-4 border-b-2 border-[#2e2e44] pb-2 text-white/55">Your Details</h3>
        <div className="grid grid-cols-2 gap-3">
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
        <h3 className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4 border-b-2 border-orange-500/20 pb-2">Premium Package — ₹12,500</h3>
        <div className="space-y-2">
          {price.breakdown.map((item, i) => (
            <div key={item.id} className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44] last:border-b-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Anton'] text-white/50 text-xs italic">{roman[i]}.</span>
                <div>
                  <p className="font-['Anton'] text-xs sm:text-sm tracking-wider text-white/80">{item.label}</p>
                  <p className="text-white/35 text-[9px] sm:text-[10px] font-mono">{item.desc}</p>
                </div>
              </div>
              <span className="font-['Anton'] text-xs sm:text-sm text-white">{fmt(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-orange-500/20">
          <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
          <span className="font-['Anton'] text-white text-2xl tracking-wider">{fmt(price.total)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="brut-card p-4 sm:p-5 mb-5 border-yellow-500/30"
      >
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="font-['Anton'] text-yellow-400 text-xs uppercase tracking-wider mb-1">Emergency Support Disclaimer</p>
            <p className="text-yellow-300/70 text-[11px] leading-relaxed">
              Emergency accidental support is provided during trips for immediate assistance and coordination only.
              This does <strong>not</strong> include medical insurance, hospital charges, or medical bill coverage.
            </p>
          </div>
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
        ) : 'Confirm Premium Package →'}
      </motion.button>

      <p className="text-white/30 text-[10px] text-center mt-4 font-mono uppercase tracking-widest">
        Pay after the ride — cash or UPI
      </p>
    </div>
  );
}
