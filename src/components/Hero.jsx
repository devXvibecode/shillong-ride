import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-40 pb-20 px-4 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="inline-block bg-black text-white px-6 py-2 font-black text-sm uppercase mb-8 rotate-[-2deg] shadow-[4px_4px_0px_#f97316]">
              Shillong's #1 Adventure Startup
            </div>
            <h1 className="text-7xl sm:text-9xl font-anton leading-[0.85] mb-10">
              EXPLORE <br />
              <span className="text-orange-500 text-stroke">MEGHALAYA</span>
            </h1>
            <p className="text-2xl font-bold text-slate-700 mb-12 max-w-lg leading-tight">
              Curated ride experiences, immersive local stays, and the raw beauty of the clouds. 
              Built for the modern explorer.
            </p>
            <div className="flex flex-wrap gap-8">
              <button 
                onClick={scrollToCatalog}
                className="neo-btn-primary text-2xl px-10 py-5 rotate-[-1deg]"
              >
                VIEW CATALOG ↓
              </button>
              <div className="flex flex-col justify-center">
                <span className="font-anton text-3xl leading-none">50+</span>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Destinations</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-anton text-3xl leading-none">100%</span>
                <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Local Guides</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div className="neo-card-accent p-0 overflow-hidden rotate-3 shadow-[12px_12px_0px_#000000]">
              <img 
                src="https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800" 
                alt="Shillong Ride"
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-orange-500 text-black p-8 neo-card rotate-[-5deg] shadow-[8px_8px_0px_#000000]">
              <p className="font-anton text-5xl mb-1">AUTHENTIC</p>
              <p className="font-black text-xs uppercase tracking-[0.2em]">Meghalaya Vibe Only</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="mt-40 neo-marquee bg-black border-y-8 border-black">
        <div className="neo-marquee-content py-4">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-12 text-white">
              SHILLONG • SOHRA • DAWKI • MAWLYNNONG • JAINTIA HILLS • 
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
