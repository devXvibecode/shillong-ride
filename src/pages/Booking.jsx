import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import GroupTypeSelector from '../components/GroupTypeSelector';
import RegionSelector from '../components/RegionSelector';
import SpotSelector from '../components/SpotSelector';
import StayDecision from '../components/StayDecision';
import NodalPicker from '../components/NodalPicker';
import VehicleSelector from '../components/VehicleSelector';
import TimeSlotPicker from '../components/TimeSlotPicker';
import HomestaySelector from '../components/HomestaySelector';
import TimelinePreview from '../components/TimelinePreview';
import NormalConfirm from '../components/NormalConfirm';
import PremiumConfirm from '../components/PremiumConfirm';
import Confirmation from '../components/Confirmation';

const STEPS = [
  'Group', 'Region', 'Spots', 'Stay', 'Transport', 'Timing', 'Review', 'Confirm'
];

export default function Booking() {
  const { step, booking, isPremium, setStep } = useBooking();

  if (booking) return <Confirmation />;

  // Dynamic step logic based on package type
  // Step 0: Group Selection
  // Step 1: Region Selection
  // Step 2: Spot Selection
  // Step 3: Stay Decision
  
  // Normal Flow:
  // Step 4: Nodal Pickup
  // Step 5: Time Slot
  // Step 6: Review (NormalConfirm)
  
  // Premium Flow:
  // Step 4: Vehicle Selection
  // Step 5: Homestay Selection
  // Step 6: Timeline Preview
  // Step 7: Review (PremiumConfirm)

  const currentMaxStep = isPremium ? 7 : 6;
  const progress = ((step + 1) / (currentMaxStep + 1)) * 100;

  return (
    <div className="min-h-screen bg-white pb-20 px-4 pt-10">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h1 className="font-anton text-3xl sm:text-5xl lg:text-6xl tracking-tighter">
              BOOKING <span className="text-stroke">WIZARD</span>
            </h1>
            <div className="font-black text-sm uppercase tracking-widest bg-black text-white px-4 py-1 rotate-[-2deg]">
              {step + 1} / {currentMaxStep + 1}
            </div>
          </div>
          <div className="h-4 lg:h-6 bg-white border-4 border-var-border overflow-hidden relative">
            <motion.div 
              className="h-full bg-yellow-500 border-r-4 border-var-border"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
          <div className="flex justify-between mt-2 overflow-x-auto pb-2 scrollbar-hide">
            {STEPS.slice(0, currentMaxStep + 1).map((s, i) => (
              <button
                key={s}
                onClick={() => step > i && setStep(i)}
                className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-2 ${
                  step === i ? 'text-yellow-500 underline decoration-2 underline-offset-4' : 
                  step > i ? 'text-black cursor-pointer hover:text-yellow-500' : 'text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && <GroupTypeSelector key="group" />}
            {step === 1 && <RegionSelector key="region" />}
            {step === 2 && <SpotSelector key="spots" maxSpots={isPremium ? 4 : 3} />}
            {step === 3 && <StayDecision key="stay" />}

            {/* Branching Logic */}
            {!isPremium ? (
              <>
                {step === 4 && <NodalPicker key="nodal" />}
                {step === 5 && <TimeSlotPicker key="timeslot" />}
                {step === 6 && <NormalConfirm key="nconfirm" />}
              </>
            ) : (
              <>
                {step === 4 && <VehicleSelector key="vehicle" />}
                {step === 5 && <HomestaySelector key="homestay" />}
                {step === 6 && <TimelinePreview key="timeline" />}
                {step === 7 && <PremiumConfirm key="pconfirm" />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
