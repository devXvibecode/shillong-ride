import { motion } from 'framer-motion';
import PlaceImage from './PlaceImage';

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-0 pb-16 lg:pb-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="pt-8 lg:pt-12"
          >
            <div className="inline-block bg-black text-white px-6 py-2 font-black text-sm uppercase mb-8 rotate-[-2deg] shadow-[4px_4px_0px_#eab308]">
              Shillong's #1 Adventure Startup
            </div>
            <h1 className="text-4xl sm:text-7xl lg:text-9xl font-anton leading-[1.1] sm:leading-[0.95] mb-6 sm:mb-10">
              EXPLORE <br />
              <span className="text-yellow-500 text-stroke">MEGHALAYA</span>
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-slate-700 mb-8 sm:mb-12 max-w-lg leading-tight">
              Curated ride experiences, immersive local stays, and the raw beauty of the clouds. 
              Built for the modern explorer.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <button 
                onClick={scrollToCatalog}
                className="neo-btn-primary text-xl sm:text-2xl px-8 py-4 sm:px-10 sm:py-5 rotate-[-1deg]"
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
              <PlaceImage
                placeId="hero"
                alt="Shillong Ride"
                className="w-full h-[600px] object-cover transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-yellow-500 text-black p-8 neo-card rotate-[-5deg] shadow-[8px_8px_0px_#000000]">
              <p className="font-anton text-5xl mb-1">AUTHENTIC</p>
              <p className="font-black text-xs uppercase tracking-[0.2em]">Meghalaya Vibe Only</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="mt-20 sm:mt-40 neo-marquee bg-black border-y-8 border-black">
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
