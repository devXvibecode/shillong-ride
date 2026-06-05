import { createContext, useContext, useState, useCallback } from 'react';
import { createNormalBooking, createPremiumBooking } from '../engines/bookingService';
import { sendBookingEmail } from '../engines/emailService';
import { pushBooking, updateSingleBooking } from '../engines/bookingSyncService';
import { loadBookings, saveBookings } from '../engines/storageService';

const BookingContext = createContext();

const EMPTY_FORM = { name: '', phone: '', notes: '', pickupLocation: '' };

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
  const [bookingType, setBookingType] = useState('');
  const [groupType, setGroupType] = useState('');
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [nodalPoint, setNodalPoint] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isPremium = bookingType === 'premium';

  const addSpot = useCallback((spotId) => {
    setSelectedSpots(prev => {
      if (prev.includes(spotId)) return prev.filter(id => id !== spotId);
      const maxSpots = isPremium ? 4 : 3;
      if (prev.length >= maxSpots) return prev;
      return [...prev, spotId];
    });
  }, [isPremium]);

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
    setBookingType('');
    setGroupType('');
    setSelectedHomestay(null);
    setNodalPoint('');
    setAgreedToTerms(false);
  }, []);

  const submitNormalBooking = useCallback(async () => {
    if (!selectedCircuit || !groupType || !nodalPoint) {
      throw new Error('Missing required booking fields');
    }
    setSubmitting(true);
    try {
      const bookingData = createNormalBooking({
        name: formData.name,
        phone: formData.phone,
        circuitId: selectedCircuit.id,
        spotIds: selectedSpots,
        groupType,
        nodalPoint,
        timeSlot,
      });
      bookingData.circuitName = selectedCircuit.name || selectedCircuit.shortName || selectedCircuit.id;
      const result = await sendBookingEmail(bookingData);
      bookingData.emailSent = result.success;
      setBookings(prev => {
        const updated = [bookingData, ...prev];
        saveBookings(updated);
        return updated;
      });
      setBooking(bookingData);
      pushBooking(bookingData).catch(() => {});
      return bookingData;
    } finally {
      setSubmitting(false);
    }
  }, [selectedCircuit, selectedSpots, groupType, nodalPoint, timeSlot, formData]);

  const submitPremiumBooking = useCallback(async () => {
    if (!selectedCircuit || !groupType || !selectedHomestay) {
      throw new Error('Missing required premium booking fields');
    }
    setSubmitting(true);
    try {
      const bookingData = createPremiumBooking({
        name: formData.name,
        phone: formData.phone,
        circuitId: selectedCircuit.id,
        spotIds: selectedSpots,
        groupType,
        vehicleType,
        homestay: selectedHomestay,
        timeSlot,
      });
      bookingData.circuitName = selectedCircuit.name || selectedCircuit.shortName || selectedCircuit.id;
      const result = await sendBookingEmail(bookingData);
      bookingData.emailSent = result.success;
      setBookings(prev => {
        const updated = [bookingData, ...prev];
        saveBookings(updated);
        return updated;
      });
      setBooking(bookingData);
      pushBooking(bookingData).catch(() => {});
      return bookingData;
    } finally {
      setSubmitting(false);
    }
  }, [selectedCircuit, selectedSpots, groupType, vehicleType, selectedHomestay, timeSlot, formData]);

  const updateBookingPreference = useCallback(async (field, value) => {
    if (!booking) return;
    const updated = { ...booking, [field]: value };
    setBooking(updated);
    // Update local storage
    setBookings(prev => {
      const updatedList = prev.map(b => b.id === updated.id ? updated : b);
      saveBookings(updatedList);
      return updatedList;
    });
    // Sync to GitHub
    try {
      await updateSingleBooking(updated.id, { [field]: value });
    } catch {
      // Silent fail for sync
    }
  }, [booking]);

  const value = {
    step, setStep,
    selectedCircuit, setSelectedCircuit,
    selectedSpots, addSpot, removeSpot, setSelectedSpots,
    timeSlot, setTimeSlot,
    vehicleType, setVehicleType,
    formData, updateFormField, resetForm,
    booking, submitting,
    submitBooking: submitNormalBooking,
    reset,
    bookings,
    bookingType, setBookingType,
    groupType, setGroupType,
    selectedHomestay, setSelectedHomestay,
    nodalPoint, setNodalPoint,
    agreedToTerms, setAgreedToTerms,
    isPremium,
    submitNormalBooking, submitPremiumBooking,
    updateBookingPreference,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}