import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useData } from '../context/DataContext';
import { calculateNormalPrice } from '../engines/pricingEngine';

export default function NormalConfirm() {
  const { 
    selectedCircuit, selectedSpots, groupType, nodalPoint, timeSlot,
    formData, updateFormField, submitNormalBooking, setStep
  } = useBooking();
  const { hubs } = useData();
  const [loading, setLoading] = useState(false);

  const hub = hubs?.find(h => h.id === nodalPoint);
  const price = calculateNormalPrice(selectedSpots, selectedCircuit?.id, groupType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert('Please fill in your name and phone number');
    setLoading(true);
    try {
      await submitNormalBooking();
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl sm:text-5xl font-anton mb-12 text-center">Review & <span className="text-yellow-500">Confirm</span></h2>
      
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 max-w-6xl mx-auto">
        {/* Left: Journey Summary */}
        <div className="space-y-8">
          <div className="neo-card bg-white">
            <h3 className="text-2xl font-anton mb-6 border-b-4 border-var-border pb-2">Your Journey</h3>
            <div className="space-y-4">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Region</span>
                <span className="uppercase">{selectedCircuit?.name}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Group</span>
                <span className="uppercase">{groupType}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Pickup</span>
                <span className="uppercase">{hub?.name}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400 uppercase text-xs tracking-widest">Time</span>
                <span className="uppercase">{timeSlot}</span>
              </div>
            </div>
          </div>

          <div className="neo-card-accent bg-white">
            <h3 className="text-2xl font-anton mb-6 border-b-4 border-var-border pb-2">Pricing Details</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between font-bold">
                <span>Rider Fee</span>
                <span>₹{price.riderFee}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Fuel (Est.)</span>
                <span>₹{price.fuelCost}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Service Fee</span>
                <span>₹{price.serviceTotal}</span>
              </div>
            </div>
            <div className="border-t-4 border-var-border pt-4 flex justify-between items-end">
              <span className="font-anton text-2xl">Total</span>
              <span className="font-anton text-5xl text-yellow-500">₹{price.groupTotal}</span>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <form onSubmit={handleSubmit} className="neo-card bg-white space-y-8">
          <h3 className="text-2xl font-anton mb-6 border-b-4 border-var-border pb-2">Contact Details</h3>
          
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
              {loading ? 'PROCESSING...' : 'CONFIRM BOOKING →'}
            </button>
            <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase text-center leading-relaxed">
              By confirming, you agree to our terms of service. Our team will contact you within 2 hours to coordinate your ride.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => setStep(5)}
          className="font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
        >
          ← Change Time
        </button>
      </div>
    </div>
  );
}
