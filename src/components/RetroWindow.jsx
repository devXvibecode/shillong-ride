import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function RetroWindow({
  title = 'Window',
  icon,
  children,
  footer,
  showMenu = false,
  className = '',
  onClose,
  titleVariant = 'navy',
  fullscreen = false,
  zigzag = false,
}) {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) onClose();
    else navigate('/');
  };

  const variantClass = {
    navy: '',
    orange: 'variant-orange',
    pine: 'variant-pine',
    split: 'variant-split',
    clash: 'variant-clash',
  }[titleVariant] || '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`retro-window ${fullscreen ? 'fullscreen' : ''} ${className}`}
    >
      {/* Title Bar */}
      <div className={`retro-titlebar ${variantClass} ${zigzag ? 'zigzag' : ''}`}>
        <div className="retro-titlebar-left">
          {icon && <span className="retro-titlebar-icon">{icon}</span>}
          <span className="retro-titlebar-text">{title}</span>
        </div>
        <div className="retro-titlebar-controls">
          <button className="retro-control" aria-label="Minimize">_</button>
          <button className="retro-control" aria-label="Maximize">□</button>
          <button className="retro-control retro-control-close" onClick={handleClose} aria-label="Close">×</button>
        </div>
      </div>

      {/* Menu Bar */}
      {showMenu && (
        <div className="retro-menubar">
          {['File', 'Edit', 'View', 'Help'].map(item => (
            <span key={item} className="retro-menuitem">{item}</span>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="retro-window-body">
        {children}
      </div>

      {/* Status Bar */}
      {footer && (
        <div className="retro-statusbar">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
