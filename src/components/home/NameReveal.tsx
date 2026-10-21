/** Big name: each letter rises from its own mask, staggered (CSS keyframes — GSAP isn't installed). */
export function NameReveal({ name, className = '' }: { name: string; className?: string }) {
  return (
    <h1 aria-label={name} className={`font-display font-semibold leading-[0.85] tracking-[-0.06em] text-bone ${className}`}>
      {name.split('').map((ch, i) => (
        // pb/-mb keep descenders (the "y") inside the mask
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <span
            className="inline-block origin-bottom-left"
            style={{ animation: `letter-rise 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.07}s both` }}
          >
            {ch}
          </span>
        </span>
      ))}
    </h1>
  );
}
