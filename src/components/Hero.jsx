import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const BASE = import.meta.env.BASE_URL || '/';
const heroBg = `${BASE.replace(/\/+$/, '')}/images/hero-bg.jpg`;

export default function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-10" style={{ opacity }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-orange-500/3 blur-[80px]" />
      </motion.div>

      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        {!imgLoaded && !imgError && <div className="w-full h-full bg-[#0b0b12]"><div className="w-full h-full skeleton" /></div>}
        <motion.img
          src={imgError ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80' : heroBg}
          alt="" role="presentation"
          className={`w-full h-full object-cover object-top transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)} onError={() => setImgError(true)}
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20 pb-24 sm:pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 glass rounded-full border-orange-500/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
            </span>
            <span className="font-['Anton'] text-orange-400 text-xs sm:text-sm uppercase tracking-[0.15em]">Built For Travelers Who Want More</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" style={{ animationDelay: '1s' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-4 sm:mb-6">
          <h1 className="font-['Anton'] text-6xl sm:text-7xl md:text-9xl text-white tracking-[0.06em] leading-none">EXPLORE</h1>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Bebas_Neue'] text-5xl sm:text-7xl md:text-9xl text-gradient tracking-[0.04em] leading-none mb-4">SHILLONG</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          We are a Shillong-based startup building a new way to explore Meghalaya. Your personal guide takes you deep into breathtaking landscapes — waterfalls, living roots, ancient forests, and skies that touch the earth.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/booking" className="brut-btn-primary inline-flex items-center gap-2 px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg tracking-widest btn-bounce group">
            <span>Start Your Journey</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
          <Link to="/contact" className="brut-btn inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 text-sm tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Got Questions?
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }} className="mt-12 flex items-center justify-center gap-6 sm:gap-10">
          {['Solo', 'Couple', 'Friends', 'Family'].map(type => (
            <div key={type} className="flex items-center gap-2 text-white/30 text-sm font-['Anton'] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />{type}
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none scroll-indicator" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#e65100" stroke="#111" strokeWidth="1"><polygon points="12,19 3,5 21,5" /></svg>
      </motion.div>
    </section>
  );
}