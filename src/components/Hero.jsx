import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-lg mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-anton text-[10px] text-primary uppercase tracking-wider">
                Shillong's #1 Adventure Startup
              </span>
            </motion.div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl text-text-primary leading-none mb-6">
              EXPLORE
              <br />
              <span className="text-primary">MEGHALAYA</span>
            </h1>

            <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
              Curated pillion ride experiences, immersive local stays, and the raw beauty of the clouds. 
              Built for the modern explorer.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToCatalog}
                className="neo-btn-primary px-8 py-4 text-sm sm:text-base tracking-widest"
              >
                VIEW CATALOG ↓
              </motion.button>

              <div className="flex gap-6">
                <div className="text-center">
                  <span className="block font-anton text-3xl text-text-primary">50+</span>
                  <span className="text-text-muted font-anton text-[10px] uppercase tracking-wider">Destinations</span>
                </div>
                <div className="w-px bg-border self-stretch" />
                <div className="text-center">
                  <span className="block font-anton text-3xl text-text-primary">100%</span>
                  <span className="text-text-muted font-anton text-[10px] uppercase tracking-wider">Local Guides</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-neo-lg border-3 border-border">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-surface-lighter to-surface flex items-center justify-center">
                <div className="text-center">
                  <div className="font-anton text-8xl text-primary opacity-30">⛰</div>
                  <p className="font-anton text-text-muted text-sm mt-2 uppercase tracking-wider">Meghalaya Awaits</p>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -bottom-6 -left-4 sm:left-6 bg-surface p-5 sm:p-6 rounded-xl shadow-neo border-3 border-border max-w-[200px]"
            >
              <p className="font-anton text-2xl text-primary mb-1">AUTHENTIC</p>
              <p className="text-text-muted font-anton text-[10px] uppercase tracking-wider">Meghalaya Vibe Only</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 sm:mt-20 bg-primary/10 border-y border-primary/20 overflow-hidden"
      >
        <div className="neo-marquee-content py-3">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-8 text-primary font-anton text-sm tracking-widest">
              SHILLONG • SOHRA • DAWKI • MAWLYNNONG • JAINTIA HILLS •
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
