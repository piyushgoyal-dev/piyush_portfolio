import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { projects } from '@/data/resume';
import { Page } from '@/components/layout/Page';
import { PageHeader, Reveal } from './Section';

type Project = (typeof projects)[number];

// Soft pastel tile colours: playful but calm on the eyes (dark ink text on top).
const TILE_COLORS = ['#F6D9C9', '#D6E6D0', '#E2DAF4', '#F6E6B8', '#CDE4EB', '#F2D4DF'];
const EASE = [0.16, 1, 0.3, 1] as const;
const MAGNET_RADIUS = 100; // px around the arrow button where the cursor gets pulled in

/** True on devices with a real mouse (custom cursor makes no sense on touch). */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}

/*
 * Row text turns dark when the row is lit. Each "lit" style is written for:
 *   group-hover:…                 mouse over the row
 *   group-has-[:focus-visible]:…  keyboard focus on the row's button
 * (Tailwind needs full class names, so they can't be generated.)
 */
function ProjectRow({ project, index, onOpen, setButtonRef }: { project: Project; index: number; onOpen: () => void; setButtonRef: (el: HTMLButtonElement | null) => void }) {
  return (
    <li
      data-row={index}
      onClick={onOpen}
      style={{ '--tile': TILE_COLORS[index % TILE_COLORS.length] } as CSSProperties}
      className="group relative border-t border-white/10 transition-opacity duration-500 last:border-b group-hover/list:[&:not(:hover)]:opacity-45"
    >
      {/* keyboard-focus fill (mouse hover uses the shared glider) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 inset-y-1 rounded-2xl bg-(--tile) opacity-0 transition-opacity duration-300 group-has-[:focus-visible]:opacity-100 md:-inset-x-5"
      />
      <div className="relative grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 py-3 xshort:py-2 md:grid-cols-[2.5rem_minmax(0,5fr)_minmax(0,4fr)_auto] md:gap-x-6 md:py-4 short:md:py-2.5">
        <span className="font-mono text-sm text-primary/45 transition-colors duration-500 group-hover:text-ink/50 group-has-[:focus-visible]:text-ink/50">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-medium xshort:text-base tracking-tight text-primary transition-colors duration-500 group-hover:text-ink group-has-[:focus-visible]:text-ink md:text-xl lg:text-2xl short:lg:text-xl">
            {project.title}
          </h2>
          <p className="text-sm text-primary/55 transition-colors duration-500 group-hover:text-ink/60 group-has-[:focus-visible]:text-ink/60">{project.category}</p>
        </div>
        <ul className="hidden flex-wrap gap-1.5 md:flex" aria-label="Tech stack">
          {project.tech.slice(0, 4).map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-primary transition-colors duration-500 group-hover:border-ink/20 group-hover:text-ink group-has-[:focus-visible]:border-ink/20 group-has-[:focus-visible]:text-ink"
            >
              {t}
            </li>
          ))}
          {project.tech.length > 4 && (
            <li className="px-1 py-1 text-[13px] text-primary/50 transition-colors duration-500 group-hover:text-ink/60">+{project.tech.length - 4}</li>
          )}
        </ul>
        <button
          ref={setButtonRef}
          type="button"
          aria-haspopup="dialog"
          aria-label={`View ${project.title} details`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-primary transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-ink group-hover:bg-ink group-hover:text-(--tile) group-has-[:focus-visible]:border-ink group-has-[:focus-visible]:bg-ink group-has-[:focus-visible]:text-(--tile) md:h-12 md:w-12"
        >
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
        </button>
      </div>
    </li>
  );
}

/** Slide-in panel with the full résumé bullets for one project. */
function ProjectDrawer({ project, index, onClose }: { project: Project; index: number; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const tile = TILE_COLORS[index % TILE_COLORS.length];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-white/10 bg-[#0b0b0c] shadow-2xl"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="p-6 md:p-8" style={{ backgroundColor: tile }}>
          <div className="flex items-start justify-between gap-4">
            <span className="font-mono text-sm text-ink/60">
              {String(index + 1).padStart(2, '0')} · {project.category}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="-mr-2 -mt-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <h2 id="drawer-title" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink">
            {project.title}
          </h2>
          <p className="mt-2 text-base text-ink/75">{project.summary}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-primary/60">Tech stack</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li key={t} className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm text-primary">{t}</li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-medium uppercase tracking-[0.12em] text-primary/60">What I built</h3>
          <ul className="mt-4 space-y-3">
            {project.points.map((p) => (
              <li key={p} className="flex gap-3 text-base leading-relaxed text-primary/85">
                <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: tile }} />
                {p}
              </li>
            ))}
          </ul>
          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black">
                  Live demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-primary">
                  Source code <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}

export function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const cursorOn = fine && !reduce;

  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  // Shared highlight that glides between rows.
  const gliderY = useSpring(0, { stiffness: 260, damping: 32 });
  const gliderH = useSpring(0, { stiffness: 260, damping: 32 });
  // Floating "View" cursor (springy lag = the soft, magnetic feel).
  const cursorX = useSpring(0, { stiffness: 320, damping: 28, mass: 0.6 });
  const cursorY = useSpring(0, { stiffness: 320, damping: 28, mass: 0.6 });

  const placeGlider = useCallback(
    (index: number | null, jump: boolean) => {
      const row = index === null ? null : listRef.current?.querySelector<HTMLElement>(`li[data-row="${index}"]`);
      if (!row) return;
      const top = row.offsetTop + 3;
      const h = row.offsetHeight - 6;
      if (jump) {
        gliderY.jump(top);
        gliderH.jump(h);
      } else {
        gliderY.set(top);
        gliderH.set(h);
      }
    },
    [gliderY, gliderH]
  );

  useLayoutEffect(() => {
    if (hovered === null || !listRef.current) return;
    const row = listRef.current.querySelector<HTMLElement>(`li[data-row="${hovered}"]`);
    if (!row) return;
    const ro = new ResizeObserver(() => placeGlider(hovered, false));
    ro.observe(row);
    return () => ro.disconnect();
  }, [hovered, placeGlider]);

  // Pull the cursor toward the hovered row's button, and nudge the button toward the cursor.
  const update = useCallback(
    (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      const row = el?.closest<HTMLElement>('li[data-row]');
      const index = row && listRef.current?.contains(row) ? Number(row.dataset.row) : null;

      setHovered((prev) => {
        if (index !== prev) placeGlider(index, prev === null);
        return index;
      });

      buttonRefs.current.forEach((b, i) => {
        if (b && i !== index) b.style.transform = '';
      });

      let tx = x;
      let ty = y;
      const btn = index === null ? null : buttonRefs.current[index];
      if (btn && cursorOn) {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        if (Math.hypot(dx, dy) < MAGNET_RADIUS) {
          tx = cx + dx * 0.25;
          ty = cy + dy * 0.25;
          btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
        } else {
          btn.style.transform = '';
        }
      }
      cursorX.set(tx);
      cursorY.set(ty);
    },
    [cursorOn, cursorX, cursorY, placeGlider]
  );

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (!pointer.current) {
      cursorX.jump(e.clientX);
      cursorY.jump(e.clientY);
    }
    pointer.current = { x: e.clientX, y: e.clientY };
    update(e.clientX, e.clientY);
  };

  const onPointerLeave = () => {
    pointer.current = null;
    setHovered(null);
    buttonRefs.current.forEach((b) => b && (b.style.transform = ''));
  };

  const open = (i: number) => {
    onPointerLeave();
    setOpenIndex(i);
  };
  const close = useCallback(() => {
    setOpenIndex((i) => {
      if (i !== null) requestAnimationFrame(() => buttonRefs.current[i]?.focus({ preventScroll: true }));
      return null;
    });
  }, []);

  const tile = hovered === null ? TILE_COLORS[0] : TILE_COLORS[hovered % TILE_COLORS.length];
  const showCursor = cursorOn && hovered !== null && openIndex === null;

  return (
    <Page>
      <PageHeader eyebrow="03 — Projects" title="Selected work." />

      <Reveal>
        <ul
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className={`group/list relative ${cursorOn ? 'cursor-none [&_*]:cursor-none' : 'cursor-pointer'}`}
        >
          {/* gliding colour highlight */}
          <motion.li
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-3 top-0 rounded-2xl md:-inset-x-5"
            style={{ y: gliderY, height: gliderH }}
            initial={false}
            animate={{ backgroundColor: tile, opacity: hovered === null ? 0 : 1 }}
            transition={{ backgroundColor: { duration: 0.45, ease: 'easeOut' }, opacity: { duration: 0.35, ease: 'easeOut' } }}
          />
          {projects.map((p, i) => (
            <ProjectRow
              key={p.id}
              project={p}
              index={i}
              onOpen={() => open(i)}
              setButtonRef={(el) => {
                buttonRefs.current[i] = el;
              }}
            />
          ))}
        </ul>
      </Reveal>

      {/* floating magnetic cursor + drawer live on <body> so page transforms can't offset them */}
      {cursorOn &&
        createPortal(
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 flex h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-ink text-sm font-medium shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)]"
          style={{ x: cursorX, y: cursorY, color: tile }}
          initial={false}
          animate={{ scale: showCursor ? 1 : 0, opacity: showCursor ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          View
          <ArrowUpRight className="h-4 w-4" />
        </motion.div>,
          document.body
        )}

      {createPortal(
        <AnimatePresence>
          {openIndex !== null && <ProjectDrawer key={projects[openIndex].id} project={projects[openIndex]} index={openIndex} onClose={close} />}
        </AnimatePresence>,
        document.body
      )}
    </Page>
  );
}
