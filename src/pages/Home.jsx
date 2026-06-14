import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PlaceImage from '../components/PlaceImage';
import { IconMotorcycle, IconMap, IconStar, IconMountain, IconUsers, IconCheck } from '../components/icons/PixelIcons';

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
          <h2 className="section-title">Explore Routes</h2>
        </div>

        {loading ? (
          <div className="glass-brutal" style={{ textAlign: 'center', padding: 0 }}>
            <div className="glass-inner glass-heavy" style={{ padding: 40 }}>
            <div className="retro-spinner" style={{ margin: '0 auto 12px' }} />
            <span style={{ fontSize: 11 }}>Loading routes...</span>
            </div>
          </div>
        ) : (
          <div className="circuit-grid">
            {displayCircuits.map((circuit, idx) => (
              <Link key={circuit.id} to="/booking" className="circuit-card glass-brutal" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div className="glass-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <PlaceImage
                    placeId={circuit.spots?.[0]}
                    alt={circuit.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  />
                </div>
                <div style={{ flex: 1 }} />
                <div className="glass-inner glass-heavy" style={{ borderTop: '2px solid var(--color-black)', position: 'relative', zIndex: 1 }}>
                  <div style={{ padding: 14 }}>
                    <h3>{circuit.name}</h3>
                    <p>{circuit.tagline || `Explore the ${circuit.name} region`}</p>
                  </div>
                  <div style={{ borderTop: '2px solid var(--color-black)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700 }}>
                    <IconMap size={12} />
                    <span>{circuit.spots?.length || 0} destinations</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/booking" className="retro-btn retro-btn-primary">
            VIEW ALL ROUTES →
          </Link>
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-number" style={{ background: 'var(--color-hotpink)', color: 'white' }}>02</span>
          <h2 className="section-title">Choose Your Ride</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {/* Standard */}
          <div className="glass-brutal" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div className="glass-inner glass-heavy" style={{ padding: 0 }}>
              <div style={{ padding: 24, textAlign: 'center', borderBottom: '3px solid var(--color-black)' }}>
                <IconMotorcycle size={36} style={{ color: 'var(--color-navy)', marginBottom: 8 }} />
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, textTransform: 'uppercase', lineHeight: 1.1 }}>Standard Ride</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--color-gray)', marginTop: 4 }}>ESSENTIAL EXPLORATION</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, marginTop: 8, color: 'var(--color-orange)' }}>from ₹3,500</div>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Nodal pickup points', icon: '📌' },
                  { label: 'Up to 3 destinations', icon: '📍' },
                  { label: 'Local rider guide', icon: '🏍️' },
                  { label: 'Flexible routing', icon: '🔄' },
                  { label: 'Pay after the ride', icon: '✅' },
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <span>{feat.icon}</span>
                    <span style={{ fontWeight: 700 }}>{feat.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '3px solid var(--color-black)' }}>
                <Link to="/booking" className="retro-btn retro-btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                  RIDE STANDARD →
                </Link>
              </div>
            </div>
          </div>

          {/* Premium */}
          <div className="glass-brutal" style={{ display: 'flex', flexDirection: 'column', position: 'relative', borderColor: 'var(--color-hotpink)' }}>
            <span className="brutal-stamp" style={{ top: -12, right: -8, background: 'var(--color-hotpink)', fontSize: 7, padding: '3px 8px' }}>
              ★ BEST VALUE
            </span>
            <div className="glass-inner glass-heavy" style={{ padding: 0 }}>
              <div style={{ padding: 24, textAlign: 'center', borderBottom: '3px solid var(--color-black)' }}>
                <IconStar size={36} style={{ color: 'var(--color-yellow)', marginBottom: 8 }} />
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, textTransform: 'uppercase', lineHeight: 1.1 }}>Premium Journey</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--color-gray)', marginTop: 4 }}>CURATED EXCELLENCE</div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 28, marginTop: 8, color: 'var(--color-orange)' }}>from ₹12,500</div>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Doorstep pickup', icon: '🏠' },
                  { label: 'Up to 4 destinations', icon: '📍' },
                  { label: 'Premium homestay & meals', icon: '🍽️' },
                  { label: 'Personal local buddy', icon: '🤝' },
                  { label: '24/7 medical cover', icon: '🏥' },
                  { label: 'Pay after the ride', icon: '✅' },
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                    <span>{feat.icon}</span>
                    <span style={{ fontWeight: 700 }}>{feat.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '3px solid var(--color-black)' }}>
                <Link to="/booking" className="retro-btn retro-btn-brutal retro-btn-clash" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                  GO PREMIUM →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="brutal-stripe-color" style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="section-header">
            <span className="section-number" style={{ background: 'var(--color-yellow)', color: 'var(--color-black)' }}>03</span>
            <h2 className="section-title" style={{ color: 'white' }}>How It Works</h2>
          </div>
          <div className="steps-row">
            <div className="step-card glass-brutal">
              <div className="glass-inner glass-heavy" style={{ padding: 24, textAlign: 'center' }}>
              <div className="step-number-block">01</div>
              <IconMap size={28} />
              <h3>Pick a Route</h3>
              <p>Choose your preferred route — Sohra, Dawki, or Jaintia Hills</p>
              </div>
            </div>
            <div className="step-card glass-brutal">
              <div className="glass-inner glass-heavy" style={{ padding: 24, textAlign: 'center' }}>
              <div className="step-number-block">02</div>
              <IconStar size={28} />
              <h3>Select Spots</h3>
              <p>Pick up to 4 spots from your chosen route</p>
              </div>
            </div>
            <div className="step-card glass-brutal">
              <div className="glass-inner glass-heavy" style={{ padding: 24, textAlign: 'center' }}>
              <div className="step-number-block">03</div>
              <IconMountain size={28} />
              <h3>Ride & Pay</h3>
              <p>Meet your local rider, explore, and pay after the ride — cash or UPI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHY RIDE WITH US */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-number" style={{ background: 'var(--color-cyan)', color: 'var(--color-black)' }}>04</span>
          <h2 className="section-title">Why Ride With Us</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div className="glass-brutal">
            <div className="glass-inner glass-heavy" style={{ padding: 24 }}>
              <div style={{ width: 48, height: 48, border: '4px solid var(--color-black)', background: 'var(--color-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <IconMotorcycle size={26} />
              </div>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 4 }}>No Driving, Just Vibes</h3>
              <p style={{ fontSize: 10, color: 'var(--color-gray)', lineHeight: 1.5 }}>
                Ride pillion with a local. No license needed, no navigation stress. Just show up and soak in Meghalaya's wild beauty.
              </p>
            </div>
          </div>
          <div className="glass-brutal">
            <div className="glass-inner glass-heavy" style={{ padding: 24 }}>
              <div style={{ width: 48, height: 48, border: '4px solid var(--color-black)', background: 'var(--color-hotpink)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <IconCheck size={26} style={{ color: 'white' }} />
              </div>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 4 }}>Pay After the Ride</h3>
              <p style={{ fontSize: 10, color: 'var(--color-gray)', lineHeight: 1.5 }}>
                No upfront payments. Book with confidence, ride with freedom, and pay only after you've experienced the journey — cash or UPI.
              </p>
            </div>
          </div>
          <div className="glass-brutal">
            <div className="glass-inner glass-heavy" style={{ padding: 24 }}>
              <div style={{ width: 48, height: 48, border: '4px solid var(--color-black)', background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <IconUsers size={26} style={{ color: 'white' }} />
              </div>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 4 }}>Local Rider Community</h3>
              <p style={{ fontSize: 10, color: 'var(--color-gray)', lineHeight: 1.5 }}>
                Every ride supports local youth from Meghalaya. Authentic stories, insider tips, and a connection you won't get from a tour bus.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* TESTIMONIALS */}
      <div className="brutal-stripe-color" style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
          <div className="section-header" style={{ marginBottom: 32 }}>
            <span className="section-number" style={{ background: 'var(--color-black)', color: 'var(--color-yellow)' }}>05</span>
            <h2 className="section-title" style={{ color: 'white' }}>Rider Stories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <div className="glass-brutal" style={{ transform: 'rotate(-0.5deg)' }}>
              <div className="glass-inner glass-heavy" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 8, color: 'var(--color-yellow)' }}>"</div>
                <p style={{ fontSize: 10, lineHeight: 1.5, marginBottom: 12, fontStyle: 'italic' }}>
                  All I had to do was show up. My rider took care of everything — route, stops, chai breaks. Felt like travelling with an old friend.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, border: '2px solid var(--color-black)', background: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 8 }}>AK</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Arjun K.</div>
                    <div style={{ fontSize: 8, color: 'var(--color-gray)' }}>Sohra Circuit · Standard</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-brutal" style={{ transform: 'rotate(0.8deg)' }}>
              <div className="glass-inner glass-heavy" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 8, color: 'var(--color-yellow)' }}>"</div>
                <p style={{ fontSize: 10, lineHeight: 1.5, marginBottom: 12, fontStyle: 'italic' }}>
                  The premium package was worth every rupee. Homestay was gorgeous, guide was brilliant, and having someone handle the bike let me actually see everything.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, border: '2px solid var(--color-black)', background: 'var(--color-hotpink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'white' }}>PM</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Priya M.</div>
                    <div style={{ fontSize: 8, color: 'var(--color-gray)' }}>Dawki · Premium Journey</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-brutal" style={{ transform: 'rotate(-0.3deg)' }}>
              <div className="glass-inner glass-heavy" style={{ padding: 20 }}>
                <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 8, color: 'var(--color-yellow)' }}>"</div>
                <p style={{ fontSize: 10, lineHeight: 1.5, marginBottom: 12, fontStyle: 'italic' }}>
                  Went solo, came back with a whole new perspective. The rider was my age, from a village nearby — we're still in touch on Instagram.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, border: '2px solid var(--color-black)', background: 'var(--color-pine)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'white' }}>RS</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Rohan S.</div>
                    <div style={{ fontSize: 8, color: 'var(--color-gray)' }}>Jaintia Hills · Standard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="section-block">
        <div className="section-header">
          <span className="section-number" style={{ background: 'var(--color-orange)', color: 'white' }}>06</span>
          <h2 className="section-title">Quick Answers</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 700, margin: '0 auto' }}>
          {[
            { q: "Do I need to know how to ride a motorcycle?", a: "Not at all! You ride pillion (as a passenger) behind a local rider. No license, no experience needed — just hop on and enjoy the view." },
            { q: "How does pay-after-ride work?", a: "You book online with no upfront payment. After your ride, pay your rider directly via cash or UPI. Simple, trust-based, and risk-free." },
            { q: "What if I need to cancel?", a: "Standard rides can be cancelled up to 2 hours before pickup at no charge. Premium packages have flexible rescheduling — just let us know a day in advance." },
            { q: "Is it safe?", a: "Absolutely. All riders are local, licensed, and vetted. Premium rides include 24/7 medical coordination. Routes are planned with safety as the priority." },
          ].map((faq, idx) => <FAQItem key={idx} question={faq.q} answer={faq.a} />)}
        </div>
      </section>

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

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-brutal" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
      <div className="glass-inner glass-heavy" style={{ padding: open ? '14px 16px 10px' : '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', flex: 1 }}>{question}</span>
          <span style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 8, flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--color-orange)',
          }}>▼</span>
        </div>
        {open && (
          <div style={{
            marginTop: 10, paddingTop: 10, borderTop: '2px solid var(--color-black)',
            fontSize: 10, color: 'var(--color-gray)', lineHeight: 1.6,
          }}>
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}
