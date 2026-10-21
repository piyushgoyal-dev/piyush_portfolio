import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotionPref } from '@/hooks';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';
const VIDEO_ASPECT = 1924 / 1076; // intrinsic size of the clip

/**
 * Laptop screen glow, in % of the video frame (not of the browser window), so it
 * stays on the laptop at every screen size. Tweak these by eye.
 * left/top = the screen's top-left corner; the box is then rotated/skewed around that corner.
 */
const LAPTOP_SCREEN = {
  left: 51.25, // % from the frame's left edge
  top: 48.73, // % from the frame's top edge
  width: 2.76, // % of frame width
  height: 4.97, // % of frame height
  rotate: 23.6, // deg — slope of the screen's top edge
  skew: 7.2, // deg — lean of the screen's side edges
};

const PARALLAX = { x: 28, y: 18 }; // max px the scene drifts opposite the cursor
const BLEED = 80; // extra px around the viewport so parallax never shows an edge

/** Glowing laptop screen: soft blue-white light + a few lines "typing" in a loop. */
function LaptopGlow() {
  const s = LAPTOP_SCREEN;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: `${s.width}%`,
        height: `${s.height}%`,
        transform: `rotate(${s.rotate}deg) skewX(${s.skew}deg)`,
        transformOrigin: 'top left',
      }}
    >
      {/* pulsing radial glow behind the screen */}
      <div className="absolute -inset-[110%] rounded-full bg-[radial-gradient(circle,rgba(170,200,255,0.32),rgba(170,200,255,0)_62%)] mix-blend-screen [animation:glow-pulse_3.2s_ease-in-out_infinite]" />
      {/* the screen itself */}
      <div className="absolute inset-0 overflow-hidden rounded-[2px] bg-[linear-gradient(160deg,rgba(215,230,255,0.42),rgba(120,160,255,0.14))] mix-blend-screen">
        <div className="absolute inset-x-[14%] top-[18%] space-y-[9%]">
          {[70, 45, 85, 55].map((w, i) => (
            <span
              key={i}
              className="block h-[1.5px] origin-left rounded-full bg-white/70"
              style={{ width: `${w}%`, animation: `screen-type 2.6s steps(8) ${i * 0.45}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full-bleed scene: Ken Burns zoom, mouse parallax, vignette, readability gradient and film grain. */
export function SceneBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();

  // Mouse parallax: drift opposite to the cursor (the CSS transition smooths it).
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el || !fine || reduce) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `translate3d(${-nx * 2 * PARALLAX.x}px, ${-ny * 2 * PARALLAX.y}px, 0)`;
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [fine, reduce]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      <div ref={parallaxRef} className="absolute inset-0 transition-transform duration-[600ms] ease-out">
        {/* A box with the video's exact aspect ratio that always covers the screen (+ bleed),
            so % positions inside it (the laptop glow) line up at every size. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `max(calc(100vw + ${BLEED * 2}px), calc((100dvh + ${BLEED * 2}px) * ${VIDEO_ASPECT}))`,
            height: `max(calc(100dvh + ${BLEED * 2}px), calc((100vw + ${BLEED * 2}px) / ${VIDEO_ASPECT}))`,
          }}
        >
          <div className="absolute inset-0 [animation:ken-burns_24s_ease-in-out_infinite_alternate]">
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src={VIDEO_SRC} />
            <LaptopGlow />
          </div>
        </div>
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,11,9,0)_50%,rgba(13,11,9,0.78)_100%)]" />
      {/* bottom-up dark gradient keeps the name and text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 via-35% to-transparent to-65%" />
      {/* film grain */}
      <div className="film-grain absolute -inset-[50%] opacity-[0.09] mix-blend-overlay" />
    </div>
  );
}
