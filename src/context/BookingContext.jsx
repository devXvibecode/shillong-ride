import { createContext, useContext, useState, useCallback } from 'react';
import { createBooking } from '../engines/bookingService';
import { sendBookingEmail } from '../engines/emailService';
import { pushBooking } from '../engines/bookingSyncService';
import places from '../data/places.json';

const BookingContext = createContext();

const EMPTY_FORM = { name: '', phone: '', notes: '', pickupLocation: '' };

function loadBookings() {
  try {
    const saved = localStorage.getItem('sr_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function BookingProvider({ children }) {
  const [step, setStep] = useState(0);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [vehicleType, setVehicleType] = useState('bike');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState(loadBookings);

  const addSpot = useCallback((spotId) => {
    setSelectedSpots(prev => {
      if (prev.includes(spotId)) return prev.filter(id => id !== spotId);
      if (prev.length >= 4) return prev;
      return [...prev, spotId];
    });
  }, []);

  const removeSpot = useCallback((spotId) => {
    setSelectedSpots(prev => prev.filter(id => id !== spotId));
  }, []);

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM);
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setSelectedCircuit(null);
    setSelectedSpots([]);
    setTimeSlot('');
    setVehicleType('bike');
    setBooking(null);
    setFormData(EMPTY_FORM);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedCircuit) {
      setSubmitting(false);
      throw new Error('No circuit selected');
    }
    setSubmitting(true);
    try {
      const circuitName = selectedCircuit.name;
      const spotNames = selectedSpots.map(id => places.find(p => p.id === id)?.name || id);
      const routeNames = ['Shillong City', ...spotNames, 'Shillong City'];

      const bookingData = createBooking({
        name: formData.name,
        phone: formData.phone,
        pickupLocation: formData.pickupLocation,
        circuitId: selectedCircuit.id,
        spotIds: selectedSpots,
        timeSlot,
        vehicleType,
        notes: formData.notes,
      });
      bookingData.circuitName = circuitName;
      bookingData.spotNames = spotNames;
      bookingData.routeNames = routeNames;

      const result = await sendBookingEmail(bookingData);
      bookingData.emailSent = result.success;

      setBookings(prev => {
        const updated = [bookingData, ...prev];
        localStorage.setItem('sr_bookings', JSON.stringify(updated));
        return updated;
      });
      setBooking(bookingData);
      pushBooking(bookingData).catch(() => {});
      return bookingData;
    } finally {
      setSubmitting(false);
    }
  }, [selectedCircuit, selectedSpots, timeSlot, formData, vehicleType]);

  return (
    <BookingContext.Provider value={{
      step, setStep, selectedCircuit, setSelectedCircuit,
      selectedSpots, addSpot, removeSpot, setSelectedSpots,
      timeSlot, setTimeSlot, vehicleType, setVehicleType,
      formData, updateFormField, resetForm,
      booking, submitting,
      submitBooking, reset,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
