import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToastContext from '../context/ToastContext';
import { IconCheck, IconClose } from './icons/PixelIcons';

export { useToast } from '../context/ToastContext';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className={`retro-toast ${t.type}`}
            onClick={() => removeToast(t.id)}
            role="status"
            aria-live="polite"
          >
            {t.type === 'success' ? <IconCheck size={16} style={{ color: 'var(--color-pine)' }} /> : <IconClose size={16} style={{ color: 'var(--color-error)' }} />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
