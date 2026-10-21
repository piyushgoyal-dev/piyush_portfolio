import { useEffect, useRef } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';

// Wireframe globe drawn on a canvas with real country outlines (Natural Earth 1:110m).
// Spins slowly eastward ("to the right"), pauses while off-screen, can be dragged
// (with soft inertia), and stays still for prefers-reduced-motion.

const topo = world as unknown as Topology<{ countries: GeometryCollection; land: GeometryCollection }>;
const land = feature(topo, topo.objects.land);
const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule10();

interface GlobeProps {
  /** [longitude, latitude] of a pulsing marker. */
  marker?: [number, number];
  /** Spin speed in degrees per second. */
  speed?: number;
  /** Latitude the globe is tilted to face. */
  tilt?: number;
  /** Starting centre longitude. */
  startLon?: number;
  color?: string;
  markerColor?: string;
  className?: string;
}

export default function Globe({
  marker,
  speed = 6,
  tilt = 22,
  startLon = 70,
  color = '225, 224, 204',
  markerColor = '242, 212, 223',
  className = '',
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(projection, ctx);

    // rotate([λ, φ]) shows longitude −λ in the centre; increasing λ slides the land to the right.
    let lambda = -startLon;
    let extra = 0; // inertia from dragging, in deg/s
    let size = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let dragging = false;
    let lastX = 0;
    let lastMoveT = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.scale(size / 2 - 2).translate([size / 2, size / 2]);
    };

    const draw = (t: number) => {
      projection.rotate([lambda, -tilt]);
      ctx.clearRect(0, 0, size, size);

      // sphere: faint fill + soft glowing rim
      ctx.beginPath();
      path({ type: 'Sphere' });
      const g = ctx.createRadialGradient(size * 0.4, size * 0.35, size * 0.05, size / 2, size / 2, size / 2);
      g.addColorStop(0, `rgba(${color}, 0.06)`);
      g.addColorStop(1, `rgba(${color}, 0.01)`);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.save();
      ctx.shadowColor = `rgba(${color}, 0.35)`;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = `rgba(${color}, 0.55)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = `rgba(${color}, 0.06)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.beginPath();
      path(land);
      ctx.fillStyle = `rgba(${color}, 0.035)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${color}, 0.8)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      path(borders);
      ctx.strokeStyle = `rgba(${color}, 0.3)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // pulsing marker, only when on the visible hemisphere
      if (marker && geoDistance(marker, [-lambda, tilt]) < Math.PI / 2 - 0.05) {
        const p = projection(marker);
        if (p) {
          const pulse = reduce ? 0.5 : (t / 1600) % 1;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 4 + pulse * 14, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${markerColor}, ${0.35 * (1 - pulse)})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${markerColor})`;
          ctx.shadowColor = `rgb(${markerColor})`;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    const frame = (t: number) => {
      const dt = Math.min(64, t - last) / 1000;
      last = t;
      if (!dragging) {
        lambda += (speed + extra) * dt;
        extra *= Math.pow(0.04, dt); // inertia fades out smoothly (~1s)
      }
      draw(t);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (reduce || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    // drag to spin (horizontal only, so vertical swipes still scroll the page)
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastMoveT = performance.now();
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const deg = dx * (180 / size);
      lambda += deg;
      extra = (deg / Math.max(1, now - lastMoveT)) * 1000 - speed;
      lastX = e.clientX;
      lastMoveT = now;
      if (reduce) draw(now);
    };
    const onUp = () => {
      dragging = false;
      extra = Math.max(-240, Math.min(240, extra));
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [marker, speed, tilt, startLon, color, markerColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    />
  );
}
