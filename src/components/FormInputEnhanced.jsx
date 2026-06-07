import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormInputEnhanced({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  pattern,
  maxLength,
  onBlur,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const showError = touched && error;
  const isValid = value && !error;

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div className="relative mb-4">
      <motion.label
        className={`block text-sm font-semibold mb-2 transition-colors ${
          isFocused ? 'text-yellow-500' : 'text-slate-300'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </motion.label>

      <div className="relative">
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-slate-900 text-white placeholder-slate-500 focus:outline-none ${
            showError
              ? 'border-red-500 focus:border-red-400'
              : isValid
                ? 'border-green-500 focus:border-green-400'
                : isFocused
                  ? 'border-yellow-500 focus:border-yellow-500'
                  : 'border-slate-700 focus:border-slate-600'
          }`}
          whileFocus={{ scale: 1.01 }}
        />

        {/* Status Icons */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-red-400 text-xs mt-2 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint Text */}
      {hint && !showError && (
        <p className="text-slate-400 text-xs mt-2">{hint}</p>
      )}
    </div>
  );
}
