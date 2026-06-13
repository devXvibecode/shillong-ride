import { motion } from 'framer-motion';
import PlaceImage from './PlaceImage';

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-0 pb-20 px-4 bg-surface">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8 lg:mb-12"
          >
            <div className="inline-block bg-primary-transparent text-primary text-xs font-medium px-3 py-1 rounded-md mb-6">
              Shillong's #1 Adventure Startup
            </div>
            <h1 className="h1 font-serif text-text-primary mb-6">
              EXPLORE <br />
              <span className="text-primary">MEGHALAYA</span>
            </h1>
            <p className="body-lg text-text-secondary mb-8 max-w-lg">
              Curated ride experiences, immersive local stays, and the raw beauty of the clouds. 
              Built for the modern explorer.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToCatalog}
                className="btn btn-primary btn-lg"
              >
                VIEW CATALOG ↓
              </button>
              <div className="flex flex-col items-start gap-2">
                <span className="h3 font-semibold text-text-primary">50+</span>
                <span className="body-sm text-text-muted">Destinations</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="h3 font-semibold text-text-primary">100%</span>
                <span className="body-sm text-text-muted">Local Guides</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div className="rounded-xl shadow-lg overflow-hidden">
              <PlaceImage
                placeId="hero"
                alt="Shillong Ride"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 start-8 bg-surface p-6 rounded-xl shadow-lg w-64">
              <p className="h2 font-serif text-text-primary mb-2">AUTHENTIC</p>
              <p className="body-sm text-text-secondary">Meghalaya Vibe Only</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="mt-20 bg-primary">
        <div className="neo-marquee-content py-4">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-12 text-white/90">
              SHILLONG • SOHRA • DAWKI • MAWLYNNONG • JAINTIA HILLS • 
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
