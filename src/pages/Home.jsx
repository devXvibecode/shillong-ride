import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PlaceImage from '../components/PlaceImage';
import { IconMotorcycle, IconMap, IconStar, IconMountain } from '../components/icons/PixelIcons';

export default function Home() {
  const { circuits, loading } = useData();
  const displayCircuits = circuits?.slice(0, 3) || [];

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-tagline">EXPLORE MEGHALAYA</span>
          <h1 className="hero-heading">
            BEYOND THE<br />ORDINARY
          </h1>
          <p className="hero-sub">
            Private pillion tours with local riders. No driving, no planning — just pure adventure through the living roots, misty valleys, and hidden waterfalls of Meghalaya.
          </p>
          <Link to="/booking"
            className="retro-btn retro-btn-brutal"
            style={{
              background: 'var(--color-yellow)', color: 'var(--color-ink)',
              width: 'fit-content', fontSize: 14,
            }}
          >
            <IconMotorcycle size={18} />
            START YOUR RIDE
          </Link>
        </div>
        <div className="hero-right">
          <div className="hero-icon-box">
            <IconMotorcycle size={60} style={{ color: 'var(--color-black)' }} />
          </div>
          <div style={{
            marginTop: 24, textAlign: 'right',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8, color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.8, maxWidth: 280,
          }}>
            PICK A ROUTE<br />
            CHOOSE YOUR SPOTS<br />
            RIDE WITH A LOCAL<br />
            <span style={{ color: 'var(--color-yellow)', fontWeight: 700 }}>PAY AFTER THE RIDE</span>
          </div>
        </div>
      </section>

      {/* CIRCUITS */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2 className="section-title">Explore Circuits</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="retro-spinner" style={{ margin: '0 auto 12px' }} />
            <span style={{ fontSize: 11 }}>Loading circuits...</span>
          </div>
        ) : (
          <div className="circuit-grid">
            {displayCircuits.map((circuit, idx) => (
              <Link key={circuit.id} to="/booking" className="circuit-card">
                <div className="circuit-card-img">
                  <PlaceImage
                    placeId={circuit.spots?.[0]}
                    alt={circuit.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="circuit-card-body">
                  <h3>{circuit.name}</h3>
                  <p>{circuit.tagline || `Explore the ${circuit.name} region`}</p>
                </div>
                <div className="circuit-card-footer">
                  <IconMap size={12} />
                  <span>{circuit.spots?.length || 0} destinations</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/booking" className="retro-btn retro-btn-primary">
            VIEW ALL CIRCUITS →
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="brutal-stripe-color" style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="section-header">
            <span className="section-number" style={{ background: 'var(--color-yellow)', color: 'var(--color-black)' }}>02</span>
            <h2 className="section-title" style={{ color: 'white' }}>How It Works</h2>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-number-block">01</div>
              <IconMap size={28} />
              <h3>Pick a Route</h3>
              <p>Choose your preferred circuit — Sohra, Dawki, or Jaintia Hills</p>
            </div>
            <div className="step-card">
              <div className="step-number-block">02</div>
              <IconStar size={28} />
              <h3>Select Spots</h3>
              <p>Pick up to 4 destinations from your chosen circuit</p>
            </div>
            <div className="step-card">
              <div className="step-number-block">03</div>
              <IconMountain size={28} />
              <h3>Ride & Pay</h3>
              <p>Meet your local rider, explore, and pay after the ride — cash or UPI</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-item">
          <div className="stats-number">50+</div>
          <div className="stats-label">Destinations</div>
        </div>
        <div className="stats-item">
          <div className="stats-number">1000+</div>
          <div className="stats-label">Happy Riders</div>
        </div>
        <div className="stats-item">
          <div className="stats-number">4.9★</div>
          <div className="stats-label">Rider Rating</div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h2 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(28px, 4vw, 48px)',
          textTransform: 'uppercase', lineHeight: 1.1,
          marginBottom: 12,
        }}>
          Ready to Ride?
        </h2>
        <p style={{ fontSize: 12, color: 'var(--color-gray)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
          Book your private pillion tour now. No upfront payment — just show up and ride.
        </p>
        <Link to="/booking" className="retro-btn retro-btn-brutal retro-btn-clash">
          <IconMotorcycle size={18} />
          BOOK YOUR ADVENTURE
        </Link>
      </div>
    </div>
  );
}
