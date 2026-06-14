import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { calculatePremiumPrice } from '../../engines/pricingEngine';
import BookingPageLayout from './BookingPageLayout';

export default function ConfirmPremium() {
  const navigate = useNavigate();
  const {
    selectedSpots, vehicleType, selectedHomestay, timeSlot,
    formData, updateFormField, submitPremiumBooking, submitting,
  } = useBooking();
  const [errors, setErrors] = useState({});

  const price = calculatePremiumPrice(vehicleType);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s\-()]/g, '').replace(/^\+?91?/, '')))
      e.phone = 'Enter a valid 10-digit number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitPremiumBooking();
      navigate(BOOKING_ROUTES.confirmed);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <BookingPageLayout
      onBack={() => navigate(BOOKING_ROUTES.time)}
      backLabel="Time Slot"
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
        {/* Left: Premium Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="neo-card p-6 sm:p-8">
            <h3 className="font-anton text-xl text-primary mb-5 border-b-3 border-border pb-3 uppercase tracking-wider">
              Premium Experience
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Package', value: 'PREMIUM EXPLORER' },
                { label: 'Vehicle', value: vehicleType === 'bike' ? '2-Wheeler' : '4-Wheeler' },
                { label: 'Stay', value: selectedHomestay?.label },
                { label: 'Time', value: timeSlot },
                { label: 'Destinations', value: `${selectedSpots.length} SPOTS` },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex justify-between items-center py-2 border-b border-border/50"
                >
                  <span className="text-text-muted font-anton text-xs uppercase tracking-wider">{item.label}</span>
                  <span className="text-text-primary font-anton text-sm uppercase">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="neo-card p-6 sm:p-8">
            <h3 className="font-anton text-xl text-primary mb-5 border-b-3 border-border pb-3 uppercase tracking-wider">
              Premium Inclusions
            </h3>
            <div className="space-y-3 mb-5">
              {price.breakdown.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.06 }}
                  className="flex items-center gap-3 py-1.5"
                >
                  <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-text-muted font-anton text-xs uppercase tracking-wider flex-1">{item.label}</span>
                  <span className="text-primary font-anton text-xs">Included</span>
                </motion.div>
              ))}
            </div>
            <div className="border-t-3 border-border pt-4 flex justify-between items-end">
              <span className="font-anton text-2xl text-text-primary">Package Total</span>
              <motion.span
                key={price.total}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-anton text-4xl sm:text-5xl text-primary"
              >
                ₹{price.total}
              </motion.span>
            </div>
            <p className="text-text-muted text-[10px] font-bold mt-4 uppercase italic">
              * Includes all fuel, meals, stay, and personal guide fees.
            </p>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="neo-card p-6 sm:p-8">
            <h3 className="font-anton text-xl text-primary mb-6 border-b-3 border-border pb-3 uppercase tracking-wider">
              VIP Contact Info
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-anton text-xs text-text-secondary uppercase tracking-wider">
                  Your Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => { updateFormField('name', e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                  className={`neo-input ${errors.name ? 'border-error' : ''}`}
                  placeholder="ENTER FULL NAME"
                  aria-label="Full name"
                />
                {errors.name && <p className="text-error text-[10px] font-anton mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-anton text-xs text-text-secondary uppercase tracking-wider">
                  Phone Number <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => { updateFormField('phone', e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
                  className={`neo-input ${errors.phone ? 'border-error' : ''}`}
                  placeholder="ENTER 10-DIGIT NUMBER"
                  aria-label="Phone number"
                />
                {errors.phone && <p className="text-error text-[10px] font-anton mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-anton text-xs text-text-secondary uppercase tracking-wider">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormField('pickupLocation', e.target.value)}
                  className="neo-input"
                  placeholder="HOTEL OR ADDRESS IN SHILLONG"
                  aria-label="Pickup location"
                />
              </div>

              {errors.submit && (
                <div className="neo-card p-4 bg-error/10 border-error">
                  <p className="text-error font-anton text-xs">{errors.submit}</p>
                </div>
              )}

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="neo-btn-primary w-full py-4 sm:py-5 text-lg sm:text-xl tracking-widest flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      RESERVING...
                    </>
                  ) : 'CONFIRM PREMIUM →'}
                </motion.button>
                <div className="neo-card p-4 mt-4 bg-primary/5 border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase leading-relaxed">
                    EMERGENCY SUPPORT: 24/7 coordination included. Limited to immediate assistance.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </BookingPageLayout>
  );
}
