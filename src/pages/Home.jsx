import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import circuits from '../data/circuits.json';

const serviceRotations = [-1, 1.5, -0.5, 1];

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Your Local Guide',
    description: 'Every trip includes a guide who knows the terrain, the weather patterns, and the best viewpoints. One person dedicated to your experience — from driving to storytelling.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Photo Stops, Always',
    description: 'Your guide knows exactly where to pause — those unmarked viewpoints, the light hitting the valley just right, the frame no map shows. No rush, no missed shots.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Smart Routing',
    description: 'Pick a direction and up to 4 spots. Our engine maps the most efficient loop so you spend time at destinations, not on the road between them.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Transparent Pricing',
    description: 'A flat ₹1,200 Processing & Platform Fee, a fixed Rider Cost (₹400–₹600), plus Fuel at ₹10/km. No surge pricing, no bargaining, no surprises.',
  },
];

const whyRotations = [-0.8, 1.2, -1.5, 0.5, -0.3, 0.8];

const circuitIcons = {
  sohra:
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>,
  dawki_mawlynnong:
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12h20" /><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="m19.07 4.93-14.14 14.14" />
    </svg>,
  jaintia_hills:
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h16" /><path d="M4 20l3-16h10l3 16" /><path d="M9 20l1-8h4l1 8" />
    </svg>,
  shillong_local:
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="10" r="2" /><path d="M12 12v6" />
    </svg>,
};

export default function Home() {
  return (
    <div>
      <Hero />

      <section id="about" className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-6">
                <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">About ShillongRide</span>
              </div>
              <h2 className="font-['Anton'] text-3xl sm:text-4xl lg:text-5xl text-white uppercase leading-tight mb-6 tracking-[0.02em]">
                Your Ride into<br />
                <span className="text-orange-500">MEGHALAYA'S SOUL</span>
              </h2>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-6 border-l-2 border-orange-500/30 pl-4">
                We bridge travelers with the raw, untamed beauty of Northeast India. 
                Every ShillongRide experience is built around one idea — you should 
                never have to choose between safety and spontaneity.
              </p>
              <p className="text-white/55 text-base leading-relaxed mb-8">
                Our local guides handle the road, the route, and the logistics. 
                You get the waterfalls, the misty valleys, the living root bridges, 
                and the quiet moments between destinations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { value: '50+', label: 'DESTINATIONS' },
                  { value: '4', label: 'CURATED ROUTES' },
                  { value: '100%', label: 'TRANSPARENT PRICING' },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="glass-card px-5 py-3"
                    style={{ transform: `rotate(${i === 0 ? -1 : i === 1 ? 0.8 : -0.5}deg)` }}
                  >
                    <p className="text-orange-500 font-['Anton'] text-2xl sm:text-3xl">{s.value}</p>
                    <p className="text-white/55 text-xs tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >

            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Four Ways to Experience<br />
              <span className="text-orange-500">MEGHALAYA</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
              Each route is a different direction, a different rhythm, a different Meghalaya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {circuits.map((circuit, i) => (
              <motion.div
                key={circuit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 sm:p-6"
                style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg glass-card"
                    style={{ backgroundColor: `${circuit.color}22` }}
                  >
                    <span style={{ color: circuit.color }}>{circuitIcons[circuit.id]}</span>
                  </div>
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-white text-lg tracking-wider">{circuit.shortName}</h3>
                    <p className="text-white/55 text-xs font-['Anton'] uppercase tracking-wider">{circuit.tagline}</p>
                  </div>
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{circuit.description}</p>
                <p className="text-white/55 text-xs italic leading-relaxed border-l-2 border-orange-500/20 pl-3">{circuit.travelReality}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 glass text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">
                    {circuit.spots.length} SPOTS
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-4">
              <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">What We Offer</span>
            </div>
            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Everything You Need<br />
              <span className="text-orange-500">FOR THE ROAD AHEAD</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card group p-6 sm:p-8 hover:border-orange-500/40 transition-all duration-500"
                style={{ transform: `rotate(${serviceRotations[i]}deg)` }}
              >
                <div className="text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-['Bebas_Neue'] text-white text-xl sm:text-2xl tracking-wider mb-2">{service.title}</h3>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-4">
              <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">How It Works</span>
            </div>
            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Three Moves, One<br />
              <span className="text-orange-500">UNFORGETTABLE DAY</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
              No accounts. No downloads. Just pick, confirm, and go.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Pick a Direction',
                description: 'Sohra, Dawki, Jaintia, or Shillong — choose the world you want to explore today. Each route has its own character.',
              },
              {
                num: '02',
                title: 'Choose Your Spots',
                description: 'Select up to 4 destinations within that route. Review the distance, pricing, and itinerary before you confirm.',
              },
              {
                num: '03',
                title: 'Ride & Explore',
                description: 'Your guide meets you in Shillong. Timing is coordinated post-booking. All you have to do is show up and take it all in.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass-card p-6 sm:p-8 relative"
                style={{ transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0 : 0.5}deg)` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="font-['Anton'] text-black text-xl font-black">{item.num}</span>
                  </div>
                  <div className="w-8 h-0.5 bg-orange-500/30" />
                </div>
                <h3 className="font-['Bebas_Neue'] text-white text-xl sm:text-2xl tracking-wider mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg mb-4">
              <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">Why ShillongRide</span>
            </div>
            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Built for Travelers<br />
              <span className="text-orange-500">WHO WANT MORE</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
              We solved the friction so you can focus on what matters — the journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: 'Fixed, Not Flexible',
                description: 'A flat ₹1,200 Processing & Platform Fee, a fixed Rider Cost (₹400–₹600), plus Fuel at ₹10/km. No surge pricing, no bargaining, no surprises.',
              },
              {
                title: 'Local Knowledge, Real Insights',
                description: 'Our guides live here. They know when the waterfalls are fullest, which caves are worth the trek, and where to find the view that isn\'t on the map.',
              },
              {
                title: 'Fully Personalized',
                description: 'You pick the direction and the spots. The route is optimized around your choices — not a pre-packaged tour script.',
              },
              {
                title: 'No Logistics, Just Experience',
                description: 'No renting a vehicle, no navigating mountain roads, no worrying about fuel. Every detail is handled so you stay present.',
              },
              {
                title: 'Photo-First Philosophy',
                description: 'Your guide stops at every unmissable viewpoint — marked or not. No one rushes you. The camera rolls as long as you want it to.',
              },
              {
                title: 'Closed-Loop, Zero Worry',
                description: 'Every tour begins and ends in Shillong. No one-way drops, no complicated returns. Just a full-circle experience.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card p-6 sm:p-8"
                style={{ transform: `rotate(${whyRotations[i]}deg)` }}
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-['Bebas_Neue'] text-white text-lg sm:text-xl tracking-wider mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="inline-block px-5 py-3 bg-[#ffd600] rounded-lg shadow-lg mb-6">
              <span className="font-['Anton'] text-black text-base sm:text-lg uppercase tracking-[0.1em]">
                The Road Is Waiting
              </span>
            </div>
            <h2 className="font-['Anton'] text-4xl sm:text-6xl text-white uppercase tracking-[0.02em] mb-4 sm:mb-6">
              Ready to Ride<br />
              <span className="text-orange-500">MEGHALAYA?</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
              Pick your direction, choose your spots, and let a local guide handle the rest.
              Your Meghalaya story starts with a single click.
            </p>
            <Link
              to="/booking"
              className="glass-btn-primary inline-block px-12 sm:px-16 py-4 sm:py-5 text-base sm:text-lg tracking-widest"
            >
              Start Booking →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
