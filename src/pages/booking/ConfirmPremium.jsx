import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, BOOKING_ROUTES } from '../../context/BookingContext';
import { useData } from '../../context/DataContext';
import { calculatePremiumPrice } from '../../engines/pricingEngine';
import BookingPageLayout from './BookingPageLayout';
import PlaceImage from '../../components/PlaceImage';
import { IconCheck, IconWarning, IconStar } from '../../components/icons/PixelIcons';

export default function ConfirmPremium() {
  const navigate = useNavigate();
  const {
    selectedSpots, vehicleType, selectedHomestay, timeSlot,
    selectedCircuit, groupType,
    formData, updateFormField, submitPremiumBooking, submitting,
  } = useBooking();
  const { places } = useData();
  const selectedSpotObjects = places?.filter(p => selectedSpots.includes(p.id)) || [];
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
      title="CONFIRM PREMIUM"
      subtitle="Review your premium experience"
      onBack={() => navigate(BOOKING_ROUTES.time)}
      backLabel="Time"
    >
      <div className="retro-split">
        {/* Left: Premium Summary */}
        <div>
          <div className="retro-card glass-brutal" style={{ marginBottom: 12 }}>
            <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-black)',
              paddingBottom: 6, marginBottom: 10,
            }}>
              Premium Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Region', value: selectedCircuit?.name },
                { label: 'Group', value: groupType },
                { label: 'Vehicle', value: vehicleType === 'bike' ? '2-Wheeler' : '4-Wheeler' },
                { label: 'Stay', value: selectedHomestay?.name },
                { label: 'Time', value: timeSlot },
                { label: 'Destinations', value: `${selectedSpots.length} spots` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid var(--color-black)', paddingBottom: 4 }}>
                  <span style={{ color: 'var(--color-gray)', fontWeight: 700, textTransform: 'uppercase', fontSize: 9 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{item.value}</span>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Selected spots */
          selectedSpotObjects.length > 0 && (
            <div className="retro-card glass-brutal" style={{ marginBottom: 12 }}>
            <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                borderBottom: '2px solid var(--color-black)',
                paddingBottom: 6, marginBottom: 10,
              }}>
                Your Destinations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedSpotObjects.map((spot, idx) => (
                  <div key={spot.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 40, height: 30, flexShrink: 0,
                      border: '2px solid var(--color-black)',
                      overflow: 'hidden', position: 'relative',
                      background: 'var(--color-cream-alt)',
                    }}>
                      <PlaceImage placeId={spot.id} alt={spot.name} />
                    </div>
                    <IconStar size={12} style={{ color: 'var(--color-yellow)', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                      {spot.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          <div className="retro-card glass-brutal">
            <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-black)',
              paddingBottom: 6, marginBottom: 10,
            }}>
              Premium Inclusions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {price.breakdown.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 2 }}>
                  <IconCheck size={14} style={{ flexShrink: 0, color: 'var(--color-pine)' }} />
                  <span style={{ fontSize: 10, textTransform: 'uppercase', flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 9, color: 'var(--color-pine)', fontWeight: 700 }}>Included</span>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: '3px solid var(--color-black)', paddingTop: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase' }}>Package Total</span>
              <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Anton', sans-serif", color: 'var(--color-orange)' }}>
                ₹{price.total}
              </span>
            </div>
            <div style={{ fontSize: 8, color: 'var(--color-gray)', marginTop: 6, fontStyle: 'italic' }}>
              * Includes all fuel, meals, stay, and personal guide fees.
            </div>
            </div>
          </div>
        </div>

        {/* Right: VIP Contact Form */}
        <div>
          <div className="retro-card glass-brutal" style={{ border: '4px solid var(--color-orange)' }}>
            <div className="glass-inner glass-heavy" style={{ padding: 14 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              borderBottom: '2px solid var(--color-orange)',
              paddingBottom: 6, marginBottom: 12, color: 'var(--color-orange)',
            }}>
              VIP Contact Info
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
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormField('pickupLocation', e.target.value)}
                  className="retro-input"
                  placeholder="HOTEL OR ADDRESS IN SHILLONG"
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
                      RESERVING...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconCheck size={16} />
                      CONFIRM PREMIUM →
                    </span>
                  )}
                </button>
                <div className="glass-brutal" style={{ marginTop: 8, padding: 8, textAlign: 'center' }}>
                  <div className="glass-inner glass-heavy" style={{ padding: 8 }}>
                  <span style={{ fontSize: 8, color: 'var(--color-orange)', fontWeight: 700 }}>
                    EMERGENCY SUPPORT: 24/7 coordination included.
                  </span>
                  </div>
                </div>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </BookingPageLayout>
  );
}
