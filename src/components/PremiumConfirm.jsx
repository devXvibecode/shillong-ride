import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { calculatePremiumPrice } from '../engines/pricingEngine';

export default function PremiumConfirm() {
  const { 
    selectedSpots, vehicleType, selectedHomestay,
    formData, updateFormField, submitPremiumBooking, setStep
  } = useBooking();
  const [loading, setLoading] = useState(false);

  const price = calculatePremiumPrice(vehicleType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert('Please fill in your name and phone number');
    setLoading(true);
    try {
      await submitPremiumBooking();
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Final <span className="text-yellow-500">Premium Review</span></h2>
      
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 max-w-6xl mx-auto">
        {/* Left: Premium Summary */}
        <div className="space-y-8">
          <div className="neo-card bg-white">
            <h3 className="text-2xl font-anton mb-6 border-b-4 border-black pb-2">Experience Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Package</span>
                <span className="text-yellow-500 uppercase">PREMIUM EXPLORER</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Vehicle</span>
                <span className="uppercase">{vehicleType === 'bike' ? '2-Wheeler' : '4-Wheeler'}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Stay</span>
                <span className="uppercase">{selectedHomestay?.label}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Destinations</span>
                <span className="uppercase">{selectedSpots.length} SPOTS</span>
              </div>
            </div>
          </div>

          <div className="neo-card-accent bg-white">
            <h3 className="text-2xl font-anton mb-6 border-b-4 border-black pb-2">Premium Inclusions</h3>
            <div className="space-y-3 mb-8">
              {price.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-400">✓ {item.label}</span>
                  <span>Included</span>
                </div>
              ))}
            </div>
            <div className="border-t-4 border-black pt-4 flex justify-between items-end">
              <span className="font-anton text-2xl">Package Total</span>
              <span className="font-anton text-5xl text-yellow-500">₹{price.total}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase italic">
              * Includes all fuel, meals, stay, and personal guide fees.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <form onSubmit={handleSubmit} className="neo-card bg-white space-y-8">
          <h3 className="text-2xl font-anton mb-6 border-b-4 border-black pb-2">VIP Contact Info</h3>
          
          <div className="space-y-2">
            <label className="font-black uppercase text-xs tracking-widest">Your Name</label>
            <input 
              type="text"
              required
              className="neo-input"
              placeholder="ENTER FULL NAME"
              value={formData.name}
              onChange={(e) => updateFormField('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-black uppercase text-xs tracking-widest">Phone Number</label>
            <input 
              type="tel"
              required
              className="neo-input"
              placeholder="ENTER PHONE NUMBER"
              value={formData.phone}
              onChange={(e) => updateFormField('phone', e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="neo-btn-primary w-full text-3xl py-6 shadow-[8px_8px_0px_#000000]"
            >
              {loading ? 'RESERVING...' : 'CONFIRM PREMIUM →'}
            </button>
            <div className="bg-yellow-50 p-4 border-2 border-yellow-200 mt-6">
              <p className="text-[9px] font-bold text-yellow-800 uppercase leading-relaxed">
                <span className="text-yellow-600">EMERGENCY SUPPORT:</span> 24/7 coordination included. Limited to immediate assistance and does not include medical bills or insurance.
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => setStep(6)}
          className="font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          ← Back to Itinerary
        </button>
      </div>
    </div>
  );
}
