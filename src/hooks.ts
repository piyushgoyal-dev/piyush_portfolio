import { useEffect, useState, type RefObject } from 'react';

/** Reactively match a CSS media query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/** Mouse/trackpad device (not touch-first). */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useReducedMotionPref = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * Magnetic hover: the element drifts toward the cursor (strength × offset from its
 * centre) and springs back on leave. Mouse only; off for reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T>, strength = 0.25) {
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduce) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'; // springy return
      el.style.transform = 'translate(0, 0)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
      el.style.transition = '';
    };
  }, [ref, strength, fine, reduce]);
}
