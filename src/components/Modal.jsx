import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, subtitle, children }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const first = dialogRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (first) first.focus();
        }
      });
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [open, handleEscape]);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white border-4 border-black shadow-[12px_12px_0px_#000] p-6 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-black font-black text-lg leading-tight uppercase tracking-wider">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-black/55 text-xs mt-0.5 font-bold">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="ml-4 w-8 h-8 flex items-center justify-center text-black/40 hover:text-black hover:bg-yellow-400 border-2 border-black transition-all flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}