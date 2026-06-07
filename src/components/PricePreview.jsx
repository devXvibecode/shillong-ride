import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { calculateNormalPrice, calculatePremiumPrice } from '../engines/pricingEngine';
import { useData } from '../context/DataContext';

export default function PricePreview() {
  const { selectedCircuit, selectedSpots, groupType, isPremium, vehicleType } = useBooking();
  const { places } = useData();

  if (!selectedCircuit || !groupType) return null;

  let pricing = null;

  if (isPremium) {
    pricing = calculatePremiumPrice(vehicleType);
  } else if (selectedSpots.length > 0) {
    const route = selectedSpots.map(spotId => {
      const place = places?.find(p => p.id === spotId);
      return { spotId, placeId: place?.placeId || spotId };
    });
    pricing = calculateNormalPrice(route, selectedCircuit.id, groupType);
  }

  if (!pricing) return null;

  const displayPrice = isPremium ? pricing.total : pricing.perPerson;
  const label = isPremium ? 'Total Price' : 'Price per Person';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-24 right-5 z-30 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-2xl p-4 max-w-xs"
      >
        <div className="text-white">
          <p className="text-xs font-semibold opacity-90 mb-1">{label}</p>
          <motion.div
            key={displayPrice}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-2xl font-bold"
          >
            ₹{displayPrice.toLocaleString('en-IN')}
          </motion.div>

          {!isPremium && pricing.groupSize > 1 && (
            <p className="text-xs opacity-80 mt-2">
              Group Total: ₹{pricing.groupTotal.toLocaleString('en-IN')} ({pricing.groupSize} people)
            </p>
          )}

          {selectedSpots.length > 0 && (
            <p className="text-xs opacity-80 mt-1">
              {selectedSpots.length} spot{selectedSpots.length > 1 ? 's' : ''} selected
            </p>
          )}

          <details className="mt-3 text-xs">
            <summary className="cursor-pointer font-semibold hover:opacity-90 transition-opacity">
              Breakdown
            </summary>
            <div className="mt-2 space-y-1 opacity-90 text-xs">
              {isPremium ? (
                pricing.breakdown.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.label}</span>
                    <span>₹{item.amount}</span>
                  </div>
                ))
              ) : (
                <>
                  {pricing.fuelCost > 0 && (
                    <div className="flex justify-between">
                      <span>Fuel ({pricing.routeDistance}km)</span>
                      <span>₹{pricing.fuelCost}</span>
                    </div>
                  )}
                  {pricing.riderFee > 0 && (
                    <div className="flex justify-between">
                      <span>Rider Fee</span>
                      <span>₹{pricing.riderFee}</span>
                    </div>
                  )}
                  {pricing.serviceTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Services</span>
                      <span>₹{pricing.serviceTotal}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </details>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
