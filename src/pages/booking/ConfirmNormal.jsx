import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import { calculateNormalPrice } from '../../engines/pricingEngine';
import BookingPageLayout from './BookingPageLayout';
import { IconCheck, IconWarning } from '../../components/icons/PixelIcons';

export default function ConfirmNormal() {
  const navigate = useNavigate();
  const {
    selectedCircuit, selectedSpots, groupType, nodalPoint, timeSlot,
    formData, updateFormField, submitNormalBooking, submitting,
  } = useBooking();
  const { hubs } = useData();
  const [errors, setErrors] = useState({});

  const hub = hubs?.find(h => h.id === nodalPoint);
  const price = calculateNormalPrice(selectedSpots, selectedCircuit?.id, groupType);

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
      await submitNormalBooking();
      navigate(BOOKING_ROUTES.confirmed);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <BookingPageLayout
      title="CONFIRM BOOKING"
      subtitle="Review your journey and enter your details"
      onBack={() => navigate(BOOKING_ROUTES.time)}
      backLabel="Time"
    >
      <div className="retro-split">
        {/* Left: Journey Summary */}
        <div>
          <div className="retro-card" style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-black)',
              paddingBottom: 6, marginBottom: 10,
            }}>
              Journey Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Region', value: selectedCircuit?.name },
                { label: 'Group', value: groupType },
                { label: 'Pickup', value: hub?.name || nodalPoint },
                { label: 'Time', value: timeSlot },
                { label: 'Spots', value: `${selectedSpots.length} selected` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid var(--color-black)', paddingBottom: 4 }}>
                  <span style={{ color: 'var(--color-gray)', fontWeight: 700, textTransform: 'uppercase', fontSize: 9 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="retro-card">
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-black)',
              paddingBottom: 6, marginBottom: 10,
            }}>
              Pricing
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--color-gray)', textTransform: 'uppercase', fontSize: 9 }}>Rider Fee</span>
                <span>₹{price.riderFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--color-gray)', textTransform: 'uppercase', fontSize: 9 }}>Fuel (Est.)</span>
                <span>₹{price.fuelCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--color-gray)', textTransform: 'uppercase', fontSize: 9 }}>Service Fee</span>
                <span>₹{price.serviceTotal}</span>
              </div>
            </div>
            <div style={{
              borderTop: '3px solid var(--color-black)', paddingTop: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Anton', sans-serif", color: 'var(--color-orange)' }}>
                ₹{price.groupTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <div className="retro-card">
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-black)',
              paddingBottom: 6, marginBottom: 12,
            }}>
              Contact Details
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Your Name <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => { updateFormField('name', e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                  className={`retro-input ${errors.name ? 'error' : ''}`}
                  placeholder="FULL NAME"
                />
                {errors.name && <div style={{ color: 'var(--color-error)', fontSize: 9, marginTop: 2 }}>{errors.name}</div>}
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Phone Number <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => { updateFormField('phone', e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
                  className={`retro-input ${errors.phone ? 'error' : ''}`}
                  placeholder="10-DIGIT NUMBER"
                />
                {errors.phone && <div style={{ color: 'var(--color-error)', fontSize: 9, marginTop: 2 }}>{errors.phone}</div>}
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Special Requests
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="retro-input"
                  placeholder="DIETARY, ACCESSIBILITY, ETC."
                  style={{ minHeight: 50 }}
                />
              </div>

              {errors.submit && (
                <div className="retro-card" style={{ background: '#FFEEEE', padding: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <IconWarning size={16} style={{ flexShrink: 0, color: 'var(--color-error)' }} />
                  <span style={{ fontSize: 10, color: 'var(--color-error)' }}>{errors.submit}</span>
                </div>
              )}

              <div style={{ paddingTop: 4 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="retro-btn retro-btn-primary retro-btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="retro-spinner" />
                      PROCESSING...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconCheck size={16} />
                      CONFIRM BOOKING →
                    </span>
                  )}
                </button>
                <div style={{ fontSize: 8, color: 'var(--color-gray)', textAlign: 'center', marginTop: 8 }}>
                  By confirming, you agree to our terms. Our team will contact you within 2 hours.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </BookingPageLayout>
  );
}
