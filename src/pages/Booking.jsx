import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const { places, loading } = useData();
  const { booking, setBookingStep, setBookingData } = useBooking();
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [travelers, setTravelers] = useState(1);
  const [date, setDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setBookingData('placeId', place.id);
    setBookingData('placeName', place.name);
  };

  const handleNextStep = () => {
    if (!selectedPlace) {
      alert('Please select a place to visit');
      return;
    }
    if (!date) {
      alert('Please select a date');
      return;
    }
    setBookingData('travelers', travelers);
    setBookingData('date', date);
    setBookingData('specialRequests', specialRequests);
    setBookingStep(2);
  };

  const handleBack = () => {
    setBookingStep(1);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would send data to a server
    alert('Booking confirmed! Thank you for choosing Shillong Ride.');
    navigate('/my-bookings');
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary-transparent rounded-full animate-spin"></div>
            <p className="mt-4 body-md text-text-secondary">Loading destinations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Navigation */}
      <div className="px-4">
        <nav className="flex items-center justify-between mb-8">
          <Link to="/" className="text-text-secondary hover:text-text-primary">
            ← Back to Home
          </Link>
          <span className="text-text-muted">Step 1 of 2: Choose Your Adventure</span>
        </nav>
      </div>

      <div className="container py-8">
        <div className="bg-surface rounded-xl shadow-md overflow-hidden">
          <div className="px-6 pt-8">
            <h1 className="h1 font-serif text-text-primary mb-6">
              Choose Your Destination
            </h1>
            <p className="body-lg text-text-secondary mb-8">
              Select where you'd like to explore in Meghalaya. Each destination offers unique experiences 
              from living root bridges to crystal clear rivers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {places?.map((place) => (
              <div
                key={place.id}
                onClick={() => handlePlaceSelect(place)}
                className={`cursor-pointer bg-surface rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                  selectedPlace?.id === place.id 
                    ? 'border-2 border-primary' 
                    : 'border-border hover:border-primary/20'
                }`}
              >
                <div className="relative">
                  <PlaceImage 
                    placeId={place.id}
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  {place.category && (
                    <span className="absolute top-3 start-3 bg-primary-transparent text-primary text-xs font-medium px-3 py-1 rounded-md">
                      {place.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="h4 font-semibold text-text-primary mb-2">{place.name}</h3>
                  <p className="body-sm text-text-muted line-clamp-2 mb-3">
                    {place.description || 'A beautiful destination in Meghalaya.'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <span>📍 {place.region || 'Meghalaya'}</span>
                    <span className="mx-1 h-0.5 bg-text-muted"></span>
                    <span>{place.vibe || 'Nature'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date and Travelers Selection */}
      {selectedPlace && (
        <div className="container py-8">
          <div className="bg-surface rounded-xl shadow-md overflow-hidden">
            <div className="px-6 pt-6">
              <h2 className="h2 font-serif text-text-primary mb-4">
                Plan Your Trip
              </h2>
              <p className="body-md text-text-secondary mb-6">
                You've selected: <span className="font-semibold text-text-primary">{selectedPlace.name}</span>
              </p>
            </div>

            <div className="px-6 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Special Requests or Questions
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Let us know about any dietary restrictions, accessibility needs, or special occasions..."
                  className="textarea w-full"
                  rows={4}
                />
              </div>

              <div className="flex justify-between items-center mt-8">
                <button onClick={handleBack} className="btn btn-outline btn-md">
                  ← Back to Selection
                </button>
                <button onClick={handleNextStep} className="btn btn-primary btn-md">
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
