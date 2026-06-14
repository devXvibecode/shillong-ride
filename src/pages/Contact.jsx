import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useBooking } from '../context/BookingContext';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const { setBookingData } = useBooking();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="h2 font-serif text-text-primary">
              Get In Touch
            </h2>
            <p className="body-lg text-text-secondary max-w-xl mx-auto">
              Have questions about our tours, need help booking, or want to share feedback? 
              We'd love to hear from you. Our team is here to help you plan the perfect 
              Meghalaya adventure.
            </p>
          </div>

          <div className="bg-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="input w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    How Can We Help You?
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share your questions, feedback, or booking inquiry..."
                    className="textarea w-full"
                    minHeight={150}
                  />
                </div>
              </form>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-success-dark mb-1">Thank you!</h3>
                    <p className="body-sm">Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-error-dark mb-1">Oops!</h3>
                    <p className="body-sm">Please fill in all required fields before submitting.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary btn-md ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="h3 font-semibold text-text-primary mb-4">Our Office</h3>
            <p className="body-sm text-text-muted">
              Shillong Ride Adventures<br/>
              Police Bazaar, Shillong<br/>
              Meghalaya 793001<br/>
              India
            </p>
            <p className="body-sm text-text-muted mt-2">
              📞 +91 12345 67890<br/>
              ✉️ info@shillongride.com
            </p>
          </div>
          <div>
            <h3 className="h3 font-semibold text-text-primary mb-4">Follow Us</h3>
            <p className="body-sm text-text-muted">
              Stay updated with our latest adventures, travel tips, and special offers.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-primary-transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M22 12.05a9 9 0 01-2.83 6.22l-1.32-1.32a3 3 0 00-4.24-4.24l-1.3-1.3a9 9 0 01-6.22-2.83M8.04 2.04a9 9 0 00-2.83 6.22l1.32 1.32a3 3 0 014.24 4.24l1.3 1.3a9 9 0 006.22 2.83M12 15a3 3 0 110-6 3 3 0 010 6zM12 3a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary-transition">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M9.612 15.23a11 11 0 01-5.517-1.063 11.9 11 0 01-5.506-1.05" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
