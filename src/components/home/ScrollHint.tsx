import { Link } from 'react-router-dom';

/** "Scroll" label with an amber drop running down a thin line. Scrolling on Home opens About. */
export function ScrollHint({ className = '' }: { className?: string }) {
  return (
    <Link to="/about" aria-label="Scroll to About" className={`group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone ${className}`}>
      <span className="relative h-10 w-px overflow-hidden bg-bone/20" aria-hidden="true">
        <span className="absolute inset-x-0 top-0 h-3 rounded-full bg-amber [animation:scroll-drop_1.8s_ease-in-out_infinite]" />
      </span>
      Scroll
    </Link>
  );
}
