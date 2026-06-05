import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="inline-block bg-black text-white px-4 py-1 font-black text-sm uppercase mb-6 rotate-[-2deg]">
              Adventure Awaits in Meghalaya
            </div>
            <h1 className="text-6xl sm:text-8xl font-anton leading-none mb-8">
              RIDE THE <br />
              <span className="text-orange-500 text-stroke">CLOUDS</span>
            </h1>
            <p className="text-xl font-bold text-slate-700 mb-10 max-w-lg">
              Experience the breathtaking landscapes of Shillong on two wheels. 
              Premium curated tours for the modern explorer.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/booking" className="neo-btn-primary text-xl">
                Start Your Journey
              </Link>
              <Link to="/contact" className="neo-btn bg-white text-xl">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <div className="neo-card-accent p-0 overflow-hidden rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=800" 
                alt="Shillong Ride"
                className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-black text-white p-6 neo-card rotate-[-5deg]">
              <p className="font-anton text-4xl">100%</p>
              <p className="font-black text-xs uppercase tracking-widest">Local Experience</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Marquee Section */}
      <div className="mt-32 neo-marquee">
        <div className="neo-marquee-content">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8">
              SHILLONG • SOHRA • DAWKI • MAWLYNNONG • JAINTIA HILLS • 
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
