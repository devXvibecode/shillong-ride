import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-['Anton'] text-orange-500">?</span>
        </div>
        <h1 className="font-['Anton'] text-5xl sm:text-6xl text-white uppercase tracking-[0.02em] mb-2">404</h1>
        <p className="text-white/55 text-sm font-['Anton'] uppercase tracking-wider mb-2">Page not found</p>
        <p className="text-white/40 text-sm mb-8">The road you're looking for doesn't exist. Let's get you back on track.</p>
        <Link to="/" className="glass-btn-primary inline-block px-10 py-4 text-sm tracking-widest">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
