import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToastContext from '../context/ToastContext';

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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`pointer-events-auto neo-card px-6 py-3 font-anton text-xs uppercase tracking-wider cursor-pointer ${
                t.type === 'success'
                  ? 'bg-success/10 border-success/30 text-success'
                  : t.type === 'error'
                  ? 'bg-error/10 border-error/30 text-error'
                  : 'bg-primary/10 border-primary/30 text-primary'
              }`}
              onClick={() => removeToast(t.id)}
              role="status"
              aria-live="polite"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
