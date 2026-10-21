import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks';

type Mode = 'default' | 'link' | 'about';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';
const NOT_BACKGROUND = 'a, button, nav, input, textarea, select, label, [data-no-about]';
const LERP = 0.18;
const RIPPLE_MS = 250;

/** Go to About: smooth-scroll if this is a one-page site with an #about section, else use the router. */
function useGoToAbout() {
  const navigate = useNavigate();
  return () => {
    const section = document.getElementById('about');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    else navigate('/about');
  };
}

/**
 * Home-only cursor: an amber ring that trails the mouse. Grows over links/buttons,
 * shows "About →" over the empty hero background, and a click there opens About.
 * Not rendered on touch devices, where taps keep their native behaviour.
 */
export function CustomCursor() {
  const touch = useMediaQuery('(hover: none), (pointer: coarse)');
  if (touch) return null;
  return <CursorInner />;
}

function CursorInner() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [visible, setVisible] = useState(false);
  const [rippling, setRippling] = useState(false);
  const goToAbout = useGoToAbout();
  const goRef = useRef(goToAbout);
  goRef.current = goToAbout;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('hide-native-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let navTimer = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const modeFor = (el: Element | null): Mode => {
      if (!el) return 'default';
      if (el.closest(INTERACTIVE)) return 'link';
      if (el.closest('[data-hero-bg]') && !el.closest(NOT_BACKGROUND)) return 'about';
      return 'default';
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      setMode(modeFor(e.target as Element));
    };
    const onLeaveWindow = () => setVisible(false);

    const onClick = (e: MouseEvent) => {
      const el = e.target as Element;
      if (e.button !== 0 || !el.closest('[data-hero-bg]') || el.closest(NOT_BACKGROUND)) return; // real links/buttons work as usual
      setRippling(true);
      navTimer = window.setTimeout(() => goRef.current(), RIPPLE_MS);
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeaveWindow);
    document.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(navTimer);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeaveWindow);
      document.removeEventListener('click', onClick);
      root.classList.remove('hide-native-cursor'); // native cursor back when leaving Home
    };
  }, []);

  const size = mode === 'about' ? 90 : mode === 'link' ? 64 : 28;

  return (
    <div ref={dotRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-amber transition-[width,height,background-color,opacity] duration-300 ease-out ${
          mode === 'about' ? 'bg-amber/90' : mode === 'link' ? 'bg-amber/25 mix-blend-difference' : 'mix-blend-difference'
        }`}
        style={{ width: size, height: size, animation: rippling ? `cursor-ripple ${RIPPLE_MS}ms ease-out forwards` : undefined }}
      >
        {mode === 'about' && <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink">About →</span>}
      </div>
    </div>
  );
}
