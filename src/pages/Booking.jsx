import { AnimatePresence, motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import BookingTypeSelector from '../components/BookingTypeSelector';
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
  'Vibe', 'Group', 'Region', 'Spots', 'Stay', 'Transport', 'Timing', 'Review', 'Confirm'
];

export default function Booking() {
  const { step, booking, isPremium, setStep } = useBooking();

  if (booking) return <Confirmation />;

  const currentMaxStep = isPremium ? 8 : 7;
  const progress = ((step + 1) / (currentMaxStep + 1)) * 100;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h1 className="font-anton text-4xl sm:text-6xl tracking-tighter">
              BOOKING <span className="text-stroke">WIZARD</span>
            </h1>
            <div className="font-black text-sm uppercase tracking-widest bg-black text-white px-4 py-1 rotate-[-2deg]">
              {step + 1} / {currentMaxStep + 1}
            </div>
          </div>
          <div className="h-6 bg-white border-4 border-black overflow-hidden relative">
            <motion.div 
              className="h-full bg-orange-500 border-r-4 border-black"
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
                  step === i ? 'text-orange-500 underline decoration-2 underline-offset-4' : 
                  step > i ? 'text-black cursor-pointer hover:text-orange-500' : 'text-slate-300'
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
            {step === 0 && <BookingTypeSelector key="btype" />}
            {step === 1 && <GroupTypeSelector key="group" />}
            {step === 2 && <RegionSelector key="region" />}
            {step === 3 && <SpotSelector key="spots" maxSpots={isPremium ? 4 : 3} />}
            {step === 4 && <StayDecision key="stay" />}

            {step === 5 && (isPremium ? <VehicleSelector key="vehicle" /> : <NodalPicker key="nodal" />)}
            {step === 6 && (isPremium ? <HomestaySelector key="homestay" /> : <TimeSlotPicker key="timeslot" />)}
            {step === 7 && (isPremium ? <TimelinePreview key="timeline" /> : <NormalConfirm key="nconfirm" />)}
            {step === 8 && isPremium && <PremiumConfirm key="pconfirm" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
