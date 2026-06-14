import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import BookingPageLayout from './BookingPageLayout';
import { IconCheck } from '../../components/icons/PixelIcons';

function AnimatedPriceDisplay({ value }) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      const duration = 800;
      const start = performance.now();
      const frame = requestAnimationFrame(function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        setDisplay(Math.round(progress * value));
        if (progress < 1) requestAnimationFrame(animate);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [value]);

  return <span>₹{display.toLocaleString('en-IN')}</span>;
}

function RevealId({ id }) {
  const [revealed, setRevealed] = useState('');

  useEffect(() => {
    if (!id) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealed(id.slice(0, i));
      if (i >= id.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <span style={{ color: 'var(--color-orange)', fontWeight: 700, fontSize: 12 }}>
      {revealed}
      <span className="animate-blink" style={{ color: 'var(--color-orange)' }}>|</span>
    </span>
  );
}

export default function Confirmed() {
  const navigate = useNavigate();
  const { booking, reset } = useBooking();

  if (!booking) {
    return (
      <BookingPageLayout>
        <div className="retro-card" style={{ textAlign: 'center', padding: 32, maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'var(--color-gray)', marginBottom: 16 }}>
            No booking found.
          </div>
          <button onClick={() => { reset(); navigate('/'); }} className="retro-btn retro-btn-primary">
            Book a Tour
          </button>
        </div>
      </BookingPageLayout>
    );
  }

  const isPremium = booking.bookingType === 'premium';
  const p = booking.priceBreakdown;

  return (
    <BookingPageLayout>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        {/* Clashing success icon */}
        <div style={{
          width: 80, height: 80, margin: '0 auto 12px',
          border: '5px solid var(--color-black)',
          background: isPremium ? 'var(--color-hotpink)' : 'var(--color-pine)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '8px 8px 0 0 rgba(0,0,0,0.85)',
          transform: 'rotate(2deg)',
        }}>
          <IconCheck size={44} style={{ color: 'white' }} />
        </div>

        {/* Stamp overlay */}
        <div className="brutal-stamp" style={{
          position: 'relative', display: 'inline-block', margin: '0 auto 10px',
          background: isPremium ? 'var(--color-hotpink)' : 'var(--color-navy)',
          fontSize: 9, padding: '5px 16px',
        }}>
          {isPremium ? '★ PREMIUM CONFIRMED' : '✓ ADVENTURE CONFIRMED'}
        </div>

        <h1 className="retro-dialog-title" style={{ fontSize: 22, marginBottom: 6, borderLeft: 'none', paddingLeft: 0 }}>
          {isPremium ? 'YOUR RIDE IS SET!' : "LET'S RIDE!"}
        </h1>

        <p style={{ fontSize: 11, color: 'var(--color-gray)', marginBottom: 16 }}>
          {isPremium
            ? 'Pack your bags — your premium Meghalaya experience awaits.'
            : 'Pack your bags — your ShillongRide adventure awaits.'}
        </p>

        {/* Booking Details */}
        <div className="retro-card" style={{ textAlign: 'left', marginBottom: 8 }}>
          <div className="brutal-stripe-orange" style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            padding: '6px 8px', margin: -16, marginBottom: 8,
            color: 'white',
          }}>
            Booking Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'Booking ID', value: <RevealId id={booking.id} /> },
              { label: 'Package', value: isPremium ? 'Premium' : 'Standard' },
              { label: 'Circuit', value: booking.circuitName },
              { label: 'Name', value: booking.name },
              { label: 'Phone', value: booking.phone },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid var(--color-black)', paddingBottom: 4 }}>
                <span style={{ color: 'var(--color-gray)', fontWeight: 700, textTransform: 'uppercase', fontSize: 9 }}>{item.label}</span>
                <span style={{ fontWeight: 700 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt with torn edge */}
        <div className="retro-card" style={{ textAlign: 'left', marginBottom: 16, position: 'relative', paddingBottom: 20 }}>
          <div className="brutal-split" style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            padding: '6px 8px', margin: -16, marginBottom: 12,
            color: 'white',
          }}>
            {isPremium ? '★ RECEIPT' : 'PAYMENT RECEIPT'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Total</span>
            <span style={{
              fontSize: 32, fontWeight: 700,
              fontFamily: "'Press Start 2P', monospace",
              color: 'var(--color-hotpink)',
              background: 'var(--color-black)',
              padding: '4px 12px',
              lineHeight: 1.4,
            }}>
              <AnimatedPriceDisplay value={p?.total || p?.groupTotal || 0} />
            </span>
          </div>
          <div className="retro-divider" style={{ margin: '8px 0' }} />
          <div style={{ textAlign: 'center', fontSize: 8, color: 'var(--color-gray)' }}>
            PACK YOUR BAGS — YOUR ADVENTURE AWAITS
          </div>
        </div>

        <div className="brutal-stamp" style={{
          position: 'relative', display: 'inline-block', margin: '0 auto 16px',
          background: 'var(--color-yellow)',
          color: 'var(--color-ink)',
          fontSize: 8, transform: 'rotate(2deg)',
        }}>
          PAY AFTER RIDE
        </div>

        <div style={{ fontSize: 9, color: 'var(--color-gray)', marginBottom: 16, maxWidth: 350, margin: '0 auto 16px' }}>
          Payment is collected after the ride — cash or UPI. A confirmation has been sent to our team. 
          We are a small Shillong startup, and every booking means the world to us.
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { reset(); navigate('/'); }} className="retro-btn retro-btn-brutal retro-btn-clash">
            Book Another Tour
          </button>
          <button onClick={() => navigate('/my-bookings')} className="retro-btn retro-btn-brutal">
            View My Bookings
          </button>
        </div>
      </div>
    </BookingPageLayout>
  );
}
