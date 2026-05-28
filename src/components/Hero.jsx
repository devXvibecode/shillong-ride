import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BASE = import.meta.env.BASE_URL || '/';
const heroBg = `${BASE.replace(/\/+$/, '')}/images/hero-bg.jpg`;

export default function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />

      <div className="absolute inset-0 z-0">
        {!imgLoaded && !imgError && (
          <div className="w-full h-full bg-[#0b0b12]">
            <div className="w-full h-full skeleton" />
          </div>
        )}
        <motion.img
          src={imgError ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80' : heroBg}
          alt=""
          role="presentation"
          className={`w-full h-full object-cover object-top transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20 pb-24 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 brut-card">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
            <span className="font-['Anton'] text-orange-400 text-xs sm:text-sm uppercase tracking-[0.15em]">
              Built For Travelers Who Want More
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" style={{ animationDelay: '1s' }} />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="font-['Anton'] text-6xl sm:text-7xl md:text-8xl text-white tracking-[0.06em] leading-none">
            EXPLORE SHILLONG
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-8xl text-orange-500 tracking-[0.04em] leading-none mb-6"
        >
          BEYOND THE ORDINARY
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          We are a Shillong-based startup building a new way to explore Meghalaya.
          Your personal guide takes you deep into breathtaking landscapes — waterfalls, living roots, ancient forests,
          and skies that touch the earth. Photo stops included. You, the road, and the unknown.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/booking"
            className="brut-btn-primary inline-block px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg tracking-widest btn-bounce"
          >
            Start Your Journey
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none scroll-indicator"
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#e65100" stroke="#111" strokeWidth="1">
          <polygon points="12,19 3,5 21,5" />
        </svg>
      </motion.div>
    </section>
  );
}
