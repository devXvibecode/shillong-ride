import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5">
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-orange-800 via-orange-600 to-orange-800" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 mb-10">
            <div>
              <Link to="/" className="font-['Anton'] text-lg text-white tracking-[0.08em] uppercase hover:text-orange-500 transition-colors">Shillong<span className="text-orange-500">Ride</span></Link>
              <p className="text-white/50 text-sm mt-3 max-w-xs leading-relaxed border-l-2 border-orange-500/30 pl-3">
                Explore Meghalaya with a local guide who knows the road, the stories, and the spots that aren't on the map.
              </p>
              <div className="mt-4 flex gap-3">
                {['f', 'in', 'ig'].map(s => (
                  <span key={s} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-orange-500 hover:border-orange-500/40 transition-all cursor-pointer text-xs font-bold">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4">Quick Links</p>
              <nav aria-label="Quick links" className="flex flex-col gap-2.5">
                {[{ to: '/', label: 'Home' }, { to: '/booking', label: 'Start Booking' }, { to: '/my-bookings', label: 'My Bookings' }, { to: '/contact', label: 'Contact & FAQ' }].map(l => (
                  <Link key={l.to} to={l.to} className="text-white/55 hover:text-orange-400 transition-colors text-sm hover:translate-x-1 inline-block">{l.label}</Link>
                ))}
              </nav>
            </div>
            <div>
              <p className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4">Contact</p>
              <div className="space-y-2 border-l-2 border-white/10 pl-3">
                <p className="text-white/50 text-sm flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500/60"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>Shillong, Meghalaya</p>
                <a href="mailto:hello@shillongride.in" className="text-white/50 hover:text-orange-400 transition-colors text-sm flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500/60"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>hello@shillongride.in</a>
                <p className="text-orange-400/60 text-[10px] font-['Anton'] uppercase tracking-wider mt-2">Enquiry &amp; Emergency</p>
                <a href="tel:+919591794044" className="text-white/50 hover:text-orange-400 transition-colors text-sm flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500/60"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>+91 9591794044</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/40 text-[10px] font-mono tracking-wider">&copy; {new Date().getFullYear()} SHILLONGRIDE — ALL RIGHTS RESERVED</p>
            <p className="text-white/20 text-[10px] font-mono tracking-wider">Built in Shillong, Meghalaya</p>
          </div>
        </div>
      </div>
    </footer>
  );
}