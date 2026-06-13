import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Hero from '../components/Hero';
import PlaceImage from '../components/PlaceImage';

export default function Home() {
  const { places, loading } = useData();

  return (
    <div className="bg-background min-h-screen">
      <Hero />
      
      {/* Catalog Section */}
      <section id="explore" className="section-lg">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="h2 font-serif text-text-primary">
              EXPLORE THE <span className="text-primary">CATALOG</span>
            </h2>
            <p className="body-lg text-text-muted max-w-xl mx-auto">
              From hidden waterfalls to living root bridges, discover the spots that make Meghalaya magical. 
              Select your favorites and build your journey.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-surface rounded-lg shadow-md p-8 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places?.map((place, i) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <PlaceImage 
                        placeId={place.id}
                        alt={place.name}
                        className="w-full h-48 object-cover"
                      />
                      {place.category && (
                        <span className="absolute top-3 start-3 bg-primary-transparent text-primary text-xs font-medium px-3 py-1 rounded-md">
                          {place.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="h4 font-semibold text-text-primary">{place.name}</h3>
                        <span className="badge badge-primary">Popular</span>
                      </div>
                      <p className="body-md text-text-muted line-clamp-3 mb-4">
                        {place.description || 'Experience the raw beauty and serene atmosphere of this iconic Meghalaya destination.'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>📍 {place.region || 'Meghalaya'}</span>
                        <span className="mx-2 h-0.5 bg-text-muted"></span>
                        <span>{place.vibe || 'Nature'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/booking" className="btn btn-primary btn-lg">
              BUILD YOUR ITINERARY NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary">
        <div className="container py-16 text-center">
          <h2 className="h2 font-serif text-white">
            Ready to Book Your Adventure?
          </h2>
          <p className="body-lg text-white/90 max-w-2xl mx-auto">
            Let our local experts craft the perfect Meghalaya experience for you. 
            From misty mountains to living root bridges, we handle every detail.
          </p>
          <Link to="/booking" className="btn btn-outline btn-lg mt-8">
            START PLANNING →
          </Link>
        </div>
      </section>
    </div>
  );
}
