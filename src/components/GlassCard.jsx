export default function GlassCard({ children, accent, elevated, className = '', ...props }) {
  const base = accent
    ? 'glass-card-accent'
    : elevated
    ? 'glass-elevated'
    : 'glass-card';

  return (
    <div className={`${base} p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}