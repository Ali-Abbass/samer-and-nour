interface OrnamentProps {
  /** Reveal stagger delay, e.g. "140ms". */
  delay?: string;
  className?: string;
}

/**
 * Gold hairline with a small diamond at its centre — the divider used
 * inside every card. Drawn as SVG so it stays crisp at any size and
 * inherits the metallic gold from `currentColor`.
 */
export function Ornament({ delay = '0ms', className = '' }: OrnamentProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 12"
      className={`reveal-line h-3 w-40 text-gold-deep ${className}`}
      style={{ '--reveal-delay': delay } as React.CSSProperties}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <line x1="0" y1="6" x2="66" y2="6" className="opacity-70" />
      <line x1="94" y1="6" x2="160" y2="6" className="opacity-70" />
      <path d="M80 1.5 84.5 6 80 10.5 75.5 6Z" fill="currentColor" stroke="none" />
      <circle cx="70" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="90" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
