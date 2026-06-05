import { AnimatePresence } from 'framer-motion';
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
import ProgressIndicator from '../components/ProgressIndicator';
import PricePreview from '../components/PricePreview';

export default function Booking() {
  const { step, booking, isPremium } = useBooking();

  if (booking) return <Confirmation />;

  return (
    <div className="min-h-screen px-5 pb-20">
      <ProgressIndicator />
      <PricePreview />
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 0 && <BookingTypeSelector key="btype" />}
          {step === 1 && <GroupTypeSelector key="group" />}
          {step === 2 && <RegionSelector key="region" />}
          {step === 3 && <SpotSelector key="spots" maxSpots={isPremium ? 4 : 3} />}
          {step === 4 && <StayDecision key="stay" />}

          {step === 5 && (isPremium ? <VehicleSelector key="vehicle" /> : <NodalPicker key="nodal" />)}
          {step === 6 && (isPremium ? <HomestaySelector key="homestay" /> : <TimeSlotPicker key="timeslot" />)}
          {step === 7 && (isPremium ? <TimelinePreview key="timeline" /> : <NormalConfirm key="nconfirm" />)}
          {step === 8 && isPremium && <PremiumConfirm key="pconfirm" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
