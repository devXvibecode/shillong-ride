import { useState } from 'react';
import { IconUser, IconMap, IconCheck } from '../components/icons/PixelIcons';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 4000);
    }, 1500);
  };

  return (
    <div style={{ background: 'var(--color-cream)', minHeight: 'calc(100vh - 52px)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 16px 60px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <span className="brutal-number" style={{ fontSize: 11 }}>CONTACT</span>
          <h1 style={{
            fontFamily: "'Anton', sans-serif", fontSize: 32,
            textTransform: 'uppercase', lineHeight: 1,
          }}>
            Get in Touch
          </h1>
        </div>

        <div className="retro-split" style={{ gap: 24 }}>
          {/* Form */}
          <div>
            <div className="retro-card" style={{ transform: 'rotate(-0.5deg)' }}>
              <div style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                borderLeft: '5px solid var(--color-hotpink)',
                padding: '6px 10px', marginBottom: 10,
                background: 'var(--color-cream-alt)',
              }}>
                Send a Message
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                    Full Name <span style={{ color: 'var(--color-hotpink)', fontSize: 14 }}>*</span>
                  </label>
                  <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)}
                    className={`retro-input ${errors.name ? 'error' : ''}`} placeholder="YOUR NAME"
                    style={{ borderLeft: errors.name ? '6px solid var(--color-error)' : '6px solid var(--color-yellow)' }} />
                  {errors.name && <div style={{ color: 'var(--color-error)', fontSize: 9, marginTop: 2 }}>{errors.name}</div>}
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                    Email <span style={{ color: 'var(--color-hotpink)', fontSize: 14 }}>*</span>
                  </label>
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                    className={`retro-input ${errors.email ? 'error' : ''}`} placeholder="YOU@EMAIL.COM"
                    style={{ borderLeft: errors.email ? '6px solid var(--color-error)' : '6px solid var(--color-yellow)' }} />
                  {errors.email && <div style={{ color: 'var(--color-error)', fontSize: 9, marginTop: 2 }}>{errors.email}</div>}
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                    Phone (Optional)
                  </label>
                  <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                    className="retro-input" placeholder="+91 12345 67890"
                    style={{ borderLeft: '6px solid var(--color-gray-light)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                    Message <span style={{ color: 'var(--color-hotpink)', fontSize: 14 }}>*</span>
                  </label>
                  <textarea value={form.message} onChange={(e) => updateField('message', e.target.value)}
                    className={`retro-input ${errors.message ? 'error' : ''}`} placeholder="YOUR MESSAGE..."
                    style={{ minHeight: 80, resize: 'vertical', borderLeft: errors.message ? '6px solid var(--color-error)' : '6px solid var(--color-yellow)' }} />
                  {errors.message && <div style={{ color: 'var(--color-error)', fontSize: 9, marginTop: 2 }}>{errors.message}</div>}
                </div>

                {submitStatus === 'success' && (
                  <div className="retro-card" style={{
                    background: '#EEFFEE', padding: 10,
                    display: 'flex', gap: 8, alignItems: 'center',
                    borderLeft: '6px solid var(--color-pine)',
                  }}>
                    <IconCheck size={16} style={{ flexShrink: 0, color: 'var(--color-pine)' }} />
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700 }}>Thank you!</div>
                      <div style={{ fontSize: 9, color: 'var(--color-gray)' }}>We'll get back to you within 24 hours.</div>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isSubmitting}
                  className="retro-btn retro-btn-brutal retro-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', transform: 'rotate(0.5deg)' }}>
                  {isSubmitting ? 'SENDING...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="retro-card" style={{ transform: 'rotate(0.8deg)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                background: 'var(--color-cream-alt)',
                padding: '6px 8px', margin: -16, marginBottom: 10,
                borderBottom: '3px solid var(--color-black)',
              }}>
                <IconMap size={20} style={{ color: 'var(--color-orange)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Our Office</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-gray)', lineHeight: 1.6 }}>
                Police Bazaar, Shillong<br />Meghalaya 793001, India
              </div>
              <div className="retro-divider" style={{ margin: '8px 0' }} />
              <div style={{ fontSize: 10, color: 'var(--color-gray)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  +91 12345 67890
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  info@shillongride.com
                </div>
              </div>
            </div>

            <div className="retro-card" style={{ transform: 'rotate(-0.5deg)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                background: 'var(--color-cream-alt)',
                padding: '6px 8px', margin: -16, marginBottom: 10,
                borderBottom: '3px solid var(--color-black)',
              }}>
                <IconUser size={20} style={{ color: 'var(--color-orange)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Follow Us</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-gray)', marginBottom: 10 }}>
                Stay updated with our latest adventures, travel tips, and special offers.
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Instagram', 'Twitter', 'YouTube'].map((s, i) => (
                  <a key={s} href="#"
                    className="retro-btn retro-btn-sm"
                    style={{
                      fontSize: 8, padding: '3px 8px',
                      transform: `rotate(${i * 2 - 1.5}deg)`,
                      background: i === 0 ? 'var(--color-hotpink)' : i === 1 ? 'var(--color-cyan)' : 'var(--color-orange)',
                      color: 'white',
                    }}
                  >{s}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
