interface CardProps {
  children: React.ReactNode;
  /** Tighter vertical rhythm for text-heavy cards (the invitation message). */
  dense?: boolean;
  className?: string;
}

/**
 * The invitation card: a sheet of translucent ivory "paper" with torn
 * top and bottom edges, laid over the photo. The photo blurs softly
 * through it (backdrop-filter) and a thin gold frame sits inside the
 * torn margin.
 *
 * Structure matters here:
 *  - `.card-shadow` is a *sibling* behind the card, not a filter on a
 *    wrapper — a `filter` on any ancestor would stop the card's
 *    backdrop blur from seeing the photo.
 *  - `.scene-motion` (transform only) carries the scroll-driven
 *    rise/recede set by ScrollDirector; the entrance fade lives on the
 *    card itself. Opacity is never put on an ancestor for the same
 *    reason as above.
 */
export function Card({ children, dense = false, className = '' }: CardProps) {
  return (
    <div className={`scene-motion relative w-full max-w-md ${className}`}>
      <div aria-hidden className="card-shadow torn" />
      <div className={`card torn ${dense ? 'card-dense' : ''}`}>
        <div aria-hidden className="card-frame" />
        <div
          className={`relative flex flex-col items-center text-center ${dense ? 'gap-4' : 'gap-7'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
