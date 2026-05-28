import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import circuits from '../data/circuits.json';

const serviceRotations = [-1, 1.5, -0.5, 1, -0.8, 0.8];

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Tourist Ride Booking',
    description: 'Book a private pillion tour with a local guide who handles everything — the riding, the navigation, the storytelling. No driving, no planning, just pure exploration.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: 'Curated Local Exploration',
    description: 'Our guides know the unmarked viewpoints, the hidden caves, and the best time of day for every destination. You get experiences no guidebook can list.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Flexible Multi-Spot Tours',
    description: 'Pick a direction and choose up to 4 destinations within it. Our engine maps the most efficient loop so you spend time at the spots, not on the road between them.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Transparent Pricing',
    description: 'A flat ₹1,200 Booking Fee, a fixed Rider Cost (₹400–₹600), plus Fuel at ₹10/km. No surge pricing, no bargaining, no surprises. What you see is what you pay.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: 'Pickup & Return Trips',
    description: 'Every tour begins and ends in Shillong. Your guide picks you up from your location, rides with you through the route, and drops you back. No one-way logistics to figure out.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Emergency Accidental Support',
    description: 'Immediate assistance and coordination during your trip.',
  },
];

const whyRotations = [-0.8, 1.2, -1.5, 0.5, -0.3, 0.8];

const circuitIcons = {
  sohra:
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
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

function SectionDivider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-auto max-w-5xl" />;
}

export default function Home() {
  return (
    <div>
      <Hero />

      <section id="about" className="relative py-24 sm:py-32 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="inline-block px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg mb-6">
                <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">About ShillongRide</span>
              </div>
              <h2 className="font-['Anton'] text-3xl sm:text-4xl lg:text-5xl text-white uppercase leading-tight mb-6 tracking-[0.02em]">
                A Shillong Startup<br />
                <span className="text-orange-500">BUILT FOR EXPLORERS</span>
              </h2>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed mb-6 border-l-2 border-orange-500/30 pl-4">
                We are a Shillong-based startup building a new way to explore Meghalaya.
                ShillongRide connects travelers with curated local ride experiences, immersive destinations,
                and flexible trip planning designed around real exploration — not rushed tourism.
              </p>
              <p className="text-white/55 text-base leading-relaxed mb-8">
                Our local guides handle the road, the route, and the logistics.
                You get the waterfalls, the misty valleys, the living root bridges,
                and the quiet moments between destinations. Affordable, community-driven, and built with startup energy.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { value: '50+', label: 'DESTINATIONS' },
                  { value: '4', label: 'CURATED ROUTES' },
                  { value: '100%', label: 'TRANSPARENT PRICING' },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="brut-card brut-card-hover px-5 py-3"
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

      <SectionDivider />

      <section className="relative py-24 sm:py-32 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Four Ways to Experience<br />
              <span className="text-orange-500">MEGHALAYA</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
              Each route is a different direction, a different rhythm, a different Meghalaya.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {circuits.map((circuit, i) => (
              <motion.div
                key={circuit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1 }}
                className="brut-card brut-card-hover p-6 sm:p-7"
                style={{ '--rot': `${i % 2 === 0 ? -0.3 : 0.3}deg`, transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg brut-card"
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
                  <span className="px-2.5 py-1 brut-badge text-white/55 text-[10px] font-['Anton'] uppercase tracking-wider">
                    {circuit.spots.length} SPOTS
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-24 sm:py-32 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 mb-4">
              <span className="font-['Anton'] text-orange-400 text-xs uppercase tracking-[0.2em]">What We Provide</span>
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
                className={`brut-card group p-6 sm:p-8 transition-all duration-500 ${
                  service.title === 'Emergency Accidental Support'
                    ? 'brut-card-accent border-yellow-500/40'
                    : 'hover:border-[#f97316]'
                } brut-card-hover`}
                style={{ '--rot': `${serviceRotations[i]}deg`, transform: `rotate(${serviceRotations[i]}deg)` }}
              >
                <div className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  service.title === 'Emergency Accidental Support' ? 'text-yellow-400' : 'text-orange-500'
                }`}>
                  {service.icon}
                </div>
                <h3 className="font-['Bebas_Neue'] text-white text-xl sm:text-2xl tracking-wider mb-2">{service.title}</h3>
                <p className="text-white/55 text-sm sm:text-base leading-relaxed">{service.description}</p>
                {service.title === 'Emergency Accidental Support' && (
                  <div className="mt-4 p-3 border-2 border-yellow-500/30 rounded-lg bg-yellow-500/5">
                    <p className="text-yellow-300/80 text-[11px] leading-relaxed">
                      ⚠ Emergency accidental support is provided during trips for immediate assistance and coordination.
                      This does not include medical insurance, hospital expenses, or medical bill coverage.
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-24 sm:py-32 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <div className="inline-block px-4 py-2 bg-orange-500/10 border-2 border-orange-500/30 mb-4">
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
                className="brut-card brut-card-hover p-6 sm:p-8 relative"
                style={{ '--rot': `${i === 0 ? -0.5 : i === 1 ? 0 : 0.5}deg`, transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0 : 0.5}deg)` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-[#f97316] border-2 border-[#c2410c] flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0_#c2410c]">
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

      <SectionDivider />

      <section className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-10"
          >
            <h2 className="font-['Anton'] text-3xl sm:text-5xl text-white uppercase tracking-[0.02em] mb-4">
              Built for Travelers<br />
              <span className="text-orange-500">WHO WANT MORE</span>
            </h2>
            <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto">
              We solved the friction so you can focus on what matters — the journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Fixed, Not Flexible',
                description: 'A flat ₹1,200 Booking Fee, a fixed Rider Cost (₹400–₹600), plus Fuel at ₹10/km. No surge pricing, no bargaining, no surprises.',
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
                className="brut-card brut-card-hover p-6 sm:p-8"
                style={{ '--rot': `${whyRotations[i]}deg`, transform: `rotate(${whyRotations[i]}deg)` }}
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center mb-4">
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

      <SectionDivider />

      <section className="relative py-16 sm:py-20 overflow-hidden border-y-2 border-[#2e2e44] bg-[#16161f]">
        <div className="marquee-track">
          <div className="flex items-center gap-16 px-8">
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Sohra</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Dawki</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Mawlynnong</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Jaintia Hills</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Shillong Peak</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Living Roots</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Waterfalls</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Sohra</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Dawki</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Mawlynnong</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Jaintia Hills</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Shillong Peak</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Living Roots</span>
            <span className="w-4 h-4 bg-orange-500/30 rotate-45" />
            <span className="text-white/20 font-['Anton'] text-5xl sm:text-7xl uppercase tracking-[0.05em] whitespace-nowrap">Waterfalls</span>
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="inline-block px-5 py-3 bg-[#ffd600] rounded-lg shadow-[3px_3px_0_#b38f00] border-2 border-[#cca300] mb-6">
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
              className="brut-btn-primary inline-block px-12 sm:px-16 py-4 sm:py-5 text-base sm:text-lg tracking-widest btn-bounce"
            >
              Start Booking →
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="sticky-booking-cta">
        <Link
          to="/booking"
          className="brut-btn-primary block w-full text-center py-3.5 text-base tracking-widest"
        >
          Start Booking →
        </Link>
      </div>
    </div>
  );
}
