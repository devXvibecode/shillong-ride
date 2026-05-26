import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-black bg-[#141414]">
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-orange-800 via-orange-600 to-orange-800 border-b-2 border-black" />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 mb-10">
            <div>
              <span className="font-['Anton'] text-lg text-white tracking-[0.08em] uppercase">
                Shillong<span className="text-orange-500">Ride</span>
              </span>
              <p className="text-white/35 text-sm mt-3 max-w-xs leading-relaxed border-l-2 border-orange-500/30 pl-3">
                Explore Meghalaya with a local guide who knows the road, the stories, and the spots that aren't on the map.
              </p>
            </div>
            <div>
              <p className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4">Quick Links</p>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-white/35 hover:text-orange-400 transition-colors text-sm">Home</Link>
                <Link to="/contact" className="text-white/35 hover:text-orange-400 transition-colors text-sm">Contact & FAQ</Link>
              </div>
            </div>
            <div>
              <p className="font-['Anton'] text-orange-500 text-xs uppercase tracking-[0.15em] mb-4">Contact</p>
              <div className="space-y-1.5 border-l-2 border-white/10 pl-3">
                <p className="text-white/35 text-sm">Shillong, Meghalaya</p>
                <p className="text-white/35 text-sm">hello@shillongride.in</p>
                <p className="text-white/35 text-sm text-orange-400/60 text-[10px] font-['Anton'] uppercase tracking-wider mt-1.5">Enquiry &amp; Emergency</p>
                <p className="text-white/35 text-sm">+91 9591794044</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-white/20 text-xs font-mono tracking-wider">
              &copy; {new Date().getFullYear()} SHILLONGRIDE — ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
