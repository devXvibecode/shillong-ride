import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { getEffectiveImage } from '../engines/imageService';
import { optimizeRoute } from '../engines/routeOptimizer';
import { calculatePrice } from '../engines/pricingEngine';

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function validatePhone(v) {
  const cleaned = v.replace(/[\s\-\(\)]/g, '').replace(/^\+?91?/, '');
  return /^[0-9]{10}$/.test(cleaned) ? cleaned : null;
}

function AnimatedPrice({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (display === value) return;
    const duration = 600;
    const start = performance.now();
    let frame;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{fmt(display)}</span>;
}

function SpotCard({ place, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const defaultImg = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: 'easeOut' }}
      className="brut-card overflow-hidden flex-shrink-0 w-[260px] sm:w-[280px]"
    >
      <div className="relative h-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        {!imgLoaded && !imgError && (
          <div className="w-full h-full skeleton" />
        )}
        <img
          src={imgError ? defaultImg : getEffectiveImage(place.id)}
          alt={place.name}
          loading="lazy"
          className={`w-full h-full object-cover ${imgLoaded || imgError ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
        <span className="absolute top-2 right-2 z-20 px-2 py-0.5 bg-[#0b0b12]/80 border-2 border-[#2e2e44] text-white/80 text-[10px] font-['Anton'] uppercase tracking-wider rounded-lg">
          {place.category}
        </span>
        <div className="absolute top-2 left-2 z-20 w-6 h-6 bg-[#f97316] border-2 border-[#c2410c] flex items-center justify-center">
          <span className="font-['Anton'] text-black text-[10px]">{index + 1}</span>
        </div>
      </div>
      <div className="p-3 border-t-2 border-[#2e2e44]">
        <h3 className="font-['Bebas_Neue'] text-white text-base tracking-wider mb-1">{place.name}</h3>
        <p className="text-white/55 text-xs leading-[1.4] line-clamp-2">{place.description}</p>
      </div>
    </motion.div>
  );
}

export default function JourneyBuilder() {
  const {
    selectedCircuit, selectedSpots, formData, updateFormField,
    vehicleType, setVehicleType, submitBooking, setStep, submitting,
  } = useBooking();
  const { places } = useData();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [priceVisible, setPriceVisible] = useState(false);
  const contentRef = useRef(null);

  const route = useMemo(() => optimizeRoute(selectedSpots), [selectedSpots]);
  const price = useMemo(() => calculatePrice(route, selectedCircuit?.id), [route, selectedCircuit?.id]);
  const spotIds = route.filter(id => id !== 'police_bazar');
  const spotPlaces = spotIds.map(id => places.find(p => p.id === id)).filter(Boolean);

  useEffect(() => {
    const t = setTimeout(() => setPriceVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const errs = {};
    if (touched.name && !formData.name.trim()) errs.name = 'Name is required';
    if (touched.phone) {
      if (!formData.phone.trim()) errs.phone = 'Phone is required';
      else if (!validatePhone(formData.phone)) errs.phone = 'Enter a valid 10-digit number';
    }
    setErrors(errs);
  }, [formData.name, formData.phone, touched]);

  if (!selectedCircuit || selectedSpots.length === 0) return null;

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    setTouched({ name: true, phone: true });
    if (errors.name || errors.phone || !formData.name.trim() || !validatePhone(formData.phone)) {
      contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
      return;
    }
    try {
      await submitBooking();
      setStep(3);
    } catch {
      setErrors(prev => ({ ...prev, submit: 'Something went wrong. Please try again.' }));
    }
  };

  const routeStops = ['Shillong', ...spotIds, 'Shillong'];

  const overlayVariants = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { type: 'spring', damping: 28, stiffness: 300, mass: 0.8 } },
    exit: { y: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-[#0b0b12]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#2e2e44] bg-[#1e1e2b] flex-shrink-0">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-white/55 hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-['Anton'] text-xs uppercase tracking-wider hidden sm:inline">Back</span>
        </button>
        <h2 className="font-['Anton'] text-sm sm:text-base text-white uppercase tracking-[0.12em]">Build Your Adventure</h2>
        <div className="w-[72px]" />
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="brut-card p-4 sm:p-5 mb-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-orange-500/10 border-2 border-orange-500/30 text-orange-400 text-[10px] font-['Anton'] uppercase tracking-wider rounded-lg">
                {selectedCircuit.shortName}
              </span>
              <span className="text-white/40 text-[10px] font-mono">{price.routeDistance} km round trip</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {routeStops.map((stop, i) => (
                <span key={`${stop}-${i}`} className="flex items-center gap-1.5">
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.3 }}
                    className={`px-2.5 py-1 text-[10px] font-['Anton'] uppercase tracking-wider rounded-lg border-2 ${
                      i === 0 || i === routeStops.length - 1
                        ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                        : 'bg-white/10 border-white/15 text-white'
                    }`}
                  >
                    {stop}
                  </motion.span>
                  {i < routeStops.length - 1 && (
                    <motion.svg
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.12, duration: 0.2 }}
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-500/60"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </motion.svg>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mb-5">
            <h3 className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-3">Your Spots</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
              {spotPlaces.map((place, i) => (
                <div key={place.id} className="snap-start">
                  <SpotCard place={place} index={i} />
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="brut-card p-4 sm:p-5 mb-5"
          >
            <h3 className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-4 border-b-2 border-[#2e2e44] pb-2">Your Details</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => updateFormField('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Your name"
                    className={`brut-input w-full px-3 py-2.5 text-sm ${errors.name ? 'border-red-500/60' : ''}`}
                  />
                  {errors.name && <p className="text-red-400 text-[10px] mt-0.5 font-['Anton'] uppercase tracking-wider">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => updateFormField('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="10-digit"
                    className={`brut-input w-full px-3 py-2.5 text-sm ${errors.phone ? 'border-red-500/60' : ''}`}
                  />
                  {errors.phone && <p className="text-red-400 text-[10px] mt-0.5 font-['Anton'] uppercase tracking-wider">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={e => updateFormField('pickupLocation', e.target.value)}
                  placeholder="Hotel or address in Shillong"
                  className="brut-input w-full px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider mb-1.5">Ride Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['scooty', 'bike'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicleType(v)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all flex items-center justify-center gap-2 ${
                        vehicleType === v
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                          : 'bg-[#16161f] border-[#2e2e44] text-white/50 hover:border-white/25'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {v === 'scooty' ? (
                          <><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M15 6h4l2 4" /><path d="M8 17h7" /><path d="M15 14L14 8H8" /><path d="M5.5 17L3 8h2" /></>
                        ) : (
                          <><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M15 6L13 10h4" /><path d="M8 17l3-9h4" /><path d="M5.5 17l-2-4h2" /></>
                        )}
                      </svg>
                      <span className="font-['Anton'] text-xs tracking-wider">{v === 'scooty' ? 'Scooty' : 'Bike'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: priceVisible ? 1 : 0, y: priceVisible ? 0 : 10 }}
            transition={{ duration: 0.4 }}
            className="brut-card p-4 sm:p-5 mb-5"
          >
            <h3 className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em] mb-4 border-b-2 border-orange-500/20 pb-2">Price Breakdown</h3>
            <div className="space-y-2.5">
              {/* Service Cost section */}
              <div className="pb-1">
                <div className="flex justify-between items-center py-1 mb-1">
                  <p className="font-['Anton'] text-white/55 text-[10px] uppercase tracking-[0.15em]">SERVICE COST</p>
                  <span className="font-['Anton'] text-orange-500 text-sm">
                    <AnimatedPrice value={price.serviceTotal} />
                  </span>
                </div>
                {Object.entries(price.serviceBreakdown).map(([key, svc], i) => (
                  <motion.div
                    key={`svc-${key}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
                    className="flex justify-between items-center py-1 border-b-2 border-[#2e2e44] last:border-b-0"
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-['Anton'] text-white/50 text-xs italic">{['i', 'ii', 'iii', 'iv'][i]}.</span>
                      <div>
                        <p className="font-['Anton'] text-xs sm:text-sm tracking-wider text-white/80">{svc.label}</p>
                        <p className="text-white/35 text-[9px] sm:text-[10px] font-mono">{svc.desc}</p>
                      </div>
                    </div>
                    <span className="font-['Anton'] text-xs sm:text-base text-white">
                      <AnimatedPrice value={svc.amount} />
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                key="rider"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44]"
              >
                <div>
                  <p className="font-['Anton'] text-sm tracking-wider text-white/90">Rider Cost</p>
                  <p className="text-white/40 text-[10px] font-mono">Your personal guide — accompanies you throughout the trip</p>
                </div>
                <span className="font-['Anton'] text-base text-white">
                  <AnimatedPrice value={price.riderFee} />
                </span>
              </motion.div>
              <motion.div
                key="fuel"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="flex justify-between items-center py-1.5 border-b-2 border-[#2e2e44] last:border-b-0"
              >
                <div>
                  <p className="font-['Anton'] text-sm tracking-wider text-white/90">Fuel Cost</p>
                  <p className="text-white/40 text-[10px] font-mono">Calculated at ₹10/km for {price.routeDistance} km round trip</p>
                </div>
                <span className="font-['Anton'] text-base text-white">
                  <AnimatedPrice value={price.fuelCost} />
                </span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.4, type: 'spring' }}
              className="flex justify-between items-center mt-4 pt-3 border-t-2 border-orange-500/20"
            >
              <span className="font-['Anton'] text-white text-base tracking-wider">TOTAL</span>
              <span className="font-['Anton'] text-orange-500 text-2xl tracking-wider">
                <AnimatedPrice value={price.total} />
              </span>
            </motion.div>
          </motion.div>

          {errors.submit && (
            <p className="text-red-400 text-xs text-center font-['Anton'] uppercase tracking-wider mb-4">{errors.submit}</p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t-2 border-[#f97316] bg-[#1e1e2b] p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="brut-btn px-4 py-3 text-xs uppercase tracking-wider flex-shrink-0 hidden sm:block"
          >
            ← Change Spots
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[10px] font-['Anton'] uppercase tracking-wider">Total Trip</p>
            <p className="font-['Anton'] text-orange-500 text-lg tracking-wider">{fmt(price.total)}</p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className={`flex-1 sm:flex-none px-6 py-3 font-['Anton'] text-sm sm:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              submitting ? 'brut-btn-primary opacity-40 cursor-not-allowed' : 'brut-btn-primary btn-bounce'
            }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                PROCESSING...
              </>
            ) : 'Confirm Adventure →'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
