import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Hero from '../components/Hero';

export default function Home() {
  const { places, loading } = useData();

  return (
    <div className="bg-white">
      <Hero />
      
      {/* Catalog Section */}
      <section className="py-16 lg:py-24 px-4 scroll-mt-24" id="explore">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-anton leading-none mb-6">
                EXPLORE THE <span className="text-yellow-500">CATALOG</span>
              </h2>
              <p className="text-xl font-bold text-slate-600">
                From hidden waterfalls to living root bridges, discover the spots that make Meghalaya magical. 
                Select your favorites and build your journey.
              </p>
            </div>
            <Link to="/booking" className="neo-btn-primary text-2xl whitespace-nowrap rotate-3">
              START BOOKING →
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="neo-card h-96 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
              {places?.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  viewport={{ once: true }}
                  className="neo-card p-0 overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden border-b-4 border-black">
                    <img 
                      src={`https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=600&id=${place.id}`} 
                      alt={place.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 font-anton text-xs uppercase tracking-widest rotate-3">
                      {place.category || 'Must Visit'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-anton leading-none">{place.name}</h3>
                      <span className="neo-badge-accent whitespace-nowrap">Popular</span>
                    </div>
                    <p className="font-bold text-slate-600 mb-6 line-clamp-2">
                      {place.description || 'Experience the raw beauty and serene atmosphere of this iconic Meghalaya destination.'}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>📍 {place.region || 'Meghalaya'}</span>
                      <span>•</span>
                      <span>{place.vibe || 'Nature'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-20 text-center">
            <Link to="/booking" className="neo-btn-primary text-3xl px-12 py-6">
              BUILD YOUR ITINERARY NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="py-12 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="font-anton text-4xl">SHILLONG RIDE</div>
          <div className="flex gap-8 font-black uppercase text-sm tracking-widest">
            <a href="#" className="hover:text-orange-500">Instagram</a>
            <a href="#" className="hover:text-orange-500">Twitter</a>
            <a href="#" className="hover:text-orange-500">Facebook</a>
          </div>
          <div className="text-xs font-bold opacity-50 uppercase tracking-widest">
            © 2026 SHILLONG RIDE STARTUP
          </div>
        </div>
      </div>
    </div>
  );
}
