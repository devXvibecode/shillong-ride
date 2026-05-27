export default function BrutCard({ children, accent, elevated, className = '', ...props }) {
  let base = 'brut-card';
  if (accent) base = 'brut-card-accent';
  else if (elevated) base = 'brut-card-lg';

  return (
    <div className={`${base} p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
