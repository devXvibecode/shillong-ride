import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FEATURES = [
  { title: 'Local Buddies', desc: 'Ride with someone who knows the hidden gems.', icon: '🏍️' },
  { title: 'Curated Spots', desc: 'Handpicked destinations for the best views.', icon: '📍' },
  { title: 'Safe & Secure', desc: 'Medical emergency cover and 24/7 support.', icon: '🛡️' },
  { title: 'Authentic Stays', desc: 'Premium homestays for a local feel.', icon: '🏠' },
];

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-anton mb-16 text-center">
            WHY <span className="text-orange-500">SHILLONG RIDE?</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="neo-card-accent group"
              >
                <div className="text-5xl mb-6 group-hover:scale-125 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-2xl font-anton mb-4">{f.title}</h3>
                <p className="font-bold text-slate-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl sm:text-9xl font-anton mb-12 tracking-tighter">
            READY TO <span className="text-orange-500">RIDE?</span>
          </h2>
          <p className="text-xl sm:text-2xl font-bold mb-12 max-w-2xl mx-auto opacity-80">
            Join hundreds of explorers who discovered the real Meghalaya with us. 
            No hidden costs. Pure adventure.
          </p>
          <Link to="/booking" className="neo-btn bg-orange-500 text-black text-2xl px-12 py-6 hover:bg-white transition-colors">
            BOOK YOUR RIDE NOW
          </Link>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="font-anton text-[20vw] leading-none select-none whitespace-nowrap">
            ADVENTURE ADVENTURE ADVENTURE
          </div>
          <div className="font-anton text-[20vw] leading-none select-none whitespace-nowrap text-right">
            EXPLORE EXPLORE EXPLORE
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
