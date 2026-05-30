import { motion } from 'framer-motion';

export default function QuestionFlow({ question, subtext, children, onBack, showBack, skipLabel, onSkip, decorative }) {
  const slideVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -60, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <motion.div
      className="min-h-[70vh] flex flex-col"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-white/55 hover:text-white transition-colors cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="font-['Anton'] text-xs uppercase tracking-wider">Back</span>
            </button>
          )}
        </div>
        {skipLabel && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-white/40 hover:text-white/70 text-xs font-['Anton'] uppercase tracking-wider transition-colors cursor-pointer"
          >
            {skipLabel}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {decorative && <div className="mb-4">{decorative}</div>}
        <h2 className="font-['Anton'] text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-[0.02em] leading-tight mb-3 max-w-2xl">
          {question}
        </h2>
        {subtext && (
          <p className="text-white/55 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
            {subtext}
          </p>
        )}
        {!subtext && <div className="mb-6" />}
        <div className="w-full max-w-3xl mx-auto">
          {children}
        </div>
      </div>

    </motion.div>
  );
}
