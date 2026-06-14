import { motion } from 'framer-motion';
import { IconClose } from './icons/PixelIcons';

export default function Modal({ children, open, onClose, title }) {
  if (!open) return null;

  return (
    <div className="retro-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.12 }}
        className="retro-window"
        style={{ maxWidth: 500, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="retro-titlebar" style={{ background: 'var(--color-navy)' }}>
          <div className="retro-titlebar-left">
            <span className="retro-titlebar-text">{title || 'Dialog'}</span>
          </div>
          <div className="retro-titlebar-controls">
            <button className="retro-control retro-control-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>
        <div className="retro-window-body">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
