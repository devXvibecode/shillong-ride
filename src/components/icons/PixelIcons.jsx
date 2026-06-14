/* Pixel-art style SVG icons for the 90s Retro OS theme */
/* Each icon uses a 24×24 viewBox with crisp square strokes */

const s = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'miter', fill: 'none' };

export function IconMotorcycle({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="7" cy="17" r="3" {...s} />
      <circle cx="18" cy="17" r="3" {...s} />
      <path d="M11 17h3" {...s} />
      <path d="M14 14L13 8H9" {...s} />
      <path d="M13 8h4l3 4" {...s} />
      <path d="M20 12h-3" {...s} />
      <path d="M7 17l-2-6h3" {...s} />
      <path d="M8 8H5" {...s} />
    </svg>
  );
}

export function IconHelmet({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 14a8 8 0 0116 0v2H4v-2z" {...s} />
      <path d="M4 16h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" {...s} />
      <path d="M10 16v-2a2 2 0 014 0v2" {...s} />
      <path d="M12 8V6" {...s} />
    </svg>
  );
}

export function IconMountain({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 20l7-12 4 6 3-4 6 10H2z" {...s} />
      <path d="M15 10l-3 4" {...s} />
    </svg>
  );
}

export function IconWaterfall({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4v16" {...s} />
      <path d="M10 8v12" {...s} />
      <path d="M16 12v8" {...s} />
      <path d="M4 20h16" {...s} />
      <path d="M4 4h3" {...s} />
      <path d="M10 8h3" {...s} />
      <path d="M16 12h3" {...s} />
    </svg>
  );
}

export function IconTree({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L6 10h12L12 2z" {...s} />
      <path d="M8 10l-3 6h14l-3-6" {...s} />
      <path d="M10 16l-2 6h8l-2-6" {...s} />
      <path d="M12 16v4" {...s} />
    </svg>
  );
}

export function IconHome({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 10l9-8 9 8v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" {...s} />
      <path d="M9 22V12h6v10" {...s} />
    </svg>
  );
}

export function IconFolder({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 6a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" {...s} />
    </svg>
  );
}

export function IconUser({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" {...s} />
      <path d="M4 22a8 8 0 0116 0" {...s} />
    </svg>
  );
}

export function IconUsers({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="7" r="3" {...s} />
      <path d="M3 21a6 6 0 0112 0" {...s} />
      <circle cx="17" cy="9" r="3" {...s} />
      <path d="M15 21a6 6 0 016 0" {...s} />
    </svg>
  );
}

export function IconStar({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l2 7h7l-5.5 5 2 7L12 16l-5.5 3 2-7L3 9h7l2-7z" {...s} />
    </svg>
  );
}

export function IconCheck({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 14l5 5L20 5" {...s} strokeWidth="3" />
    </svg>
  );
}

export function IconClose({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6l12 12M18 6L6 18" {...s} strokeWidth="3" />
    </svg>
  );
}

export function IconMinimize({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 12h16" {...s} strokeWidth="3" />
    </svg>
  );
}

export function IconMaximize({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="16" {...s} strokeWidth="2" />
    </svg>
  );
}

export function IconClock({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 7v5l3 3" {...s} />
    </svg>
  );
}

export function IconMap({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" {...s} />
      <circle cx="12" cy="10" r="3" {...s} />
    </svg>
  );
}

export function IconFloppy({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 2h10l4 4v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" {...s} />
      <path d="M8 2v6h8V2" {...s} />
      <rect x="7" y="14" width="10" height="8" {...s} />
    </svg>
  );
}

export function IconTrash({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6h16" {...s} />
      <path d="M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6" {...s} />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" {...s} />
      <path d="M10 10v6" {...s} />
      <path d="M14 10v6" {...s} />
    </svg>
  );
}

export function IconMyComputer({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="14" {...s} />
      <path d="M2 16h20" {...s} />
      <path d="M8 22h8" {...s} />
      <path d="M12 16v6" {...s} />
      <rect x="6" y="5" width="12" height="7" {...s} />
    </svg>
  );
}

export function IconWarning({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L2 20h20L12 3z" {...s} />
      <path d="M12 9v5" {...s} strokeWidth="3" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSun({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4" {...s} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" {...s} />
    </svg>
  );
}
