import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Hero from '../components/Hero';

export default function Home() {
  const { places, loading } = useData();

  return (
    <div className="bg-background min-h-screen">
      <Hero />

      {/* Catalog Section */}
      <section id="explore" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-text-primary uppercase">
              EXPLORE THE <span className="text-primary">CATALOG</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto mt-4">
              From hidden waterfalls to living root bridges, discover the spots that make Meghalaya magical. 
              Select your favorites and build your journey.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="neo-card p-0 overflow-hidden">
                  <div className="h-48 skeleton" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 skeleton rounded w-2/3" />
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {places?.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.5 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="neo-card p-0 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden bg-surface-lighter">
                    {place.imageCount > 0 ? (
                      <img
                        src={`https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop&sig=${place.id}`}
                        alt={place.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted/30">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {place.category && (
                      <span className="absolute top-3 left-3 neo-badge bg-surface/90 text-[10px]">
                        {place.category}
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-anton text-xl sm:text-2xl text-text-primary">{place.name}</h3>
                      <span className="neo-badge bg-primary/10 text-primary text-[10px]">
                        Popular
                      </span>
                    </div>
                    <p className="text-text-muted text-sm line-clamp-2 mb-4 leading-relaxed">
                      {place.description || 'Experience the raw beauty and serene atmosphere of this iconic Meghalaya destination.'}
                    </p>
                    <div className="flex items-center gap-3 text-text-muted text-[10px] font-anton uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {place.region || 'Meghalaya'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span>{place.vibe || 'Nature'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/booking" className="neo-btn-primary px-10 py-4 text-sm sm:text-base inline-block">
              BUILD YOUR ITINERARY NOW →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-text-primary uppercase mb-4">
              Ready to Book <span className="text-primary">Your Adventure?</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Let our local experts craft the perfect Meghalaya experience for you. 
              From misty mountains to living root bridges, we handle every detail.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/booking" className="neo-btn-primary px-10 py-4 text-sm sm:text-base">
                START PLANNING →
              </Link>
              <Link to="/contact" className="neo-btn px-10 py-4 text-sm sm:text-base">
                CONTACT US
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
