import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="text-center py-12 max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12 }}
          className="w-28 h-28 mx-auto mb-8 rounded-2xl bg-surface-lighter border-3 border-border flex items-center justify-center shadow-neo"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-anton text-7xl sm:text-8xl text-primary mb-2"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-anton text-2xl sm:text-3xl text-text-primary uppercase mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-muted text-sm mb-8 leading-relaxed"
        >
          It seems the page you're looking for doesn't exist or has been moved. 
          Please check the URL or return to the homepage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className="neo-btn-primary px-10 py-4 text-base inline-block">
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
