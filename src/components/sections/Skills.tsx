import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Cloud, GitBranch, LayoutTemplate, Plug, Server, Users } from 'lucide-react';
import { skills } from '@/data/resume';
import { useMediaQuery } from '@/hooks';
import { Page } from '@/components/layout/Page';
import { PageHeader, Reveal } from './Section';

const ICONS = { layout: LayoutTemplate, server: Server, cloud: Cloud, plug: Plug, git: GitBranch, users: Users } as const;
const factLabel = 'text-sm font-medium uppercase tracking-[0.12em] text-primary/60';
const SPRING = { type: 'spring', stiffness: 220, damping: 30, mass: 0.9 } as const;

/** Card edge length: fits the screen's width *and* height so the page never needs to scroll. */
function useCardSize() {
  const pick = () => {
    const h = window.innerHeight;
    const byWidth = window.innerWidth < 640 ? 190 : window.innerWidth < 1024 ? 240 : 290;
    const byHeight = window.innerWidth < 640 ? h * (h < 700 ? 0.17 : 0.21) : h * (h < 800 ? 0.225 : 0.29);
    return Math.round(Math.max(window.innerWidth < 640 ? 110 : 140, Math.min(byWidth, byHeight)));
  };
  const [size, setSize] = useState(pick);
  useEffect(() => {
    const onResize = () => setSize(pick());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// Open on the Frontend card (falls back to the first card if it's renamed).
const START = Math.max(0, skills.findIndex((s) => s.category === 'Frontend'));

/** Shortest signed distance from the active card, wrapping around (e.g. -3…3 for 7 cards). */
const offsetOf = (i: number, active: number, n: number) => {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};

export function Skills() {
  const n = skills.length;
  const [active, setActive] = useState(START);
  const size = useCardSize();
  const prevOffsets = useRef<number[]>(skills.map((_, i) => offsetOf(i, START, n)));
  const panned = useRef(false);

  const go = (i: number) => setActive(((i % n) + n) % n);
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  const offsets = skills.map((_, i) => offsetOf(i, active, n));
  useEffect(() => {
    prevOffsets.current = offsets;
  });

  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 40) return;
    panned.current = true;
    if (info.offset.x < 0) next();
    else prev();
    setTimeout(() => (panned.current = false), 50);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  const phone = useMediaQuery('(max-width: 639px)');
  const [phoneView, setPhoneView] = useState<'skills' | 'details'>('skills');
  const showFacts = !phone || phoneView === 'details';
  const showSkills = !phone || phoneView === 'skills';
  const current = skills[active];
  const CurrentIcon = ICONS[current.icon as keyof typeof ICONS];

  return (
    <Page>
      <PageHeader eyebrow="04 — Skills" title="Tools I use." />
      {/* stage */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Skill groups — use the arrow keys or swipe to browse"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative -mx-4 border-y border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:-mx-6 md:-mx-10"
      >
        <motion.div
          onPanEnd={onPanEnd}
          style={{ touchAction: 'pan-y', height: size + (phone ? 24 : 40), perspective: 1400 }}
          className="relative flex cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
        >
          {skills.map((skill, i) => {
            const d = offsets[i];
            const ad = Math.abs(d);
            const wrapped = Math.abs(d - prevOffsets.current[i]) > n / 2; // jumped from one end to the other
            const Icon = ICONS[skill.icon as keyof typeof ICONS];
            const isActive = d === 0;
            return (
              <motion.button
                key={skill.category}
                type="button"
                onClick={() => !panned.current && go(i)}
                aria-label={`${skill.category} — ${skill.items.length} skills`}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={isActive ? 0 : -1}
                className="absolute overflow-hidden rounded-[1.75rem] text-left"
                style={{ width: size, height: size, zIndex: 10 - ad, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{
                  x: d === 0 ? 0 : Math.sign(d) * (size * 0.96 + (ad - 1) * size * 0.66),
                  rotateY: d === 0 ? 0 : -Math.sign(d) * 24,
                  scale: 1 - Math.min(ad, 3) * 0.09,
                  z: -ad * 60,
                  opacity: ad >= 3 ? 0.35 : 1,
                }}
                transition={wrapped ? { duration: 0 } : SPRING}
              >
                <img src={skill.image} alt="" loading="lazy" decoding="async" draggable={false} className="pointer-events-none h-full w-full select-none object-cover" />
                {/* scrims keep the label + number readable on light images too */}
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 via-45% to-transparent" />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black"
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 0.35 }}
                  transition={{ duration: 0.4 }}
                />
                <span className={`absolute inset-0 rounded-[1.75rem] border transition-colors duration-500 ${isActive ? 'border-primary/40' : 'border-white/10'}`} />

                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-primary backdrop-blur-md sm:left-5 sm:top-5 sm:h-11 sm:w-11">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="absolute right-4 top-5 font-mono text-[11px] text-primary/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] sm:right-5 sm:top-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute inset-x-4 bottom-4 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] sm:inset-x-6 sm:bottom-6">
                  <span className="block text-xl font-medium tracking-tight text-primary sm:text-2xl md:text-3xl">{skill.category}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-primary/60">
                    {skill.items.length} skills
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous skill group"
          className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-primary backdrop-blur-md transition hover:scale-105 hover:border-primary/50 sm:left-5 md:h-12 md:w-12"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next skill group"
          className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-primary backdrop-blur-md transition hover:scale-105 hover:border-primary/50 sm:right-5 md:h-12 md:w-12"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* details for the selected card */}
      <Reveal delay={0.1} className="mx-auto mt-4 w-full max-w-5xl md:mt-6 short:md:mt-4">
        <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={current.category}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 sm:p-5 md:grid-cols-2 md:gap-8 md:p-7 short:md:p-5"
            >
              {/* left: name + facts */}
              <div>
                <header className="flex items-start justify-between gap-4 xshort:max-sm:sr-only">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-primary">
                      <CurrentIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-primary md:text-2xl">{current.category}</h2>
                      <p className="text-[15px] text-primary/70">{current.subtitle}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 font-mono text-sm text-primary/70">
                    {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                  </span>
                </header>
                {phone && (
                  <div role="tablist" aria-label="Show" className="mt-4 grid grid-cols-2 rounded-full border border-white/10 p-1 xshort:mt-0">
                    {(['skills', 'details'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        role="tab"
                        aria-selected={phoneView === v}
                        onClick={() => setPhoneView(v)}
                        className={`rounded-full py-1.5 text-sm font-medium transition-colors ${phoneView === v ? 'bg-primary text-black' : 'text-primary/70'}`}
                      >
                        {v === 'skills' ? `Skills (${current.items.length})` : 'Details'}
                      </button>
                    ))}
                  </div>
                )}
                {showFacts && (
                <dl className="mt-4 space-y-2.5 border-t border-white/10 pt-4 md:mt-5 md:pt-5 max-sm:border-t-0 max-sm:pt-0">
                  <div className="grid grid-cols-[5.75rem_1fr] gap-3 sm:grid-cols-[6.5rem_1fr]">
                    <dt className={factLabel}>Used in</dt>
                    <dd className="text-[15px] leading-snug text-primary md:text-base">{current.usedIn}</dd>
                  </div>
                  <div className="grid grid-cols-[5.75rem_1fr] gap-3 sm:grid-cols-[6.5rem_1fr]">
                    <dt className={factLabel}>Highlight</dt>
                    <dd className="text-[15px] leading-snug text-primary md:text-base">{current.highlight}</dd>
                  </div>
                </dl>
                )}
              </div>

              {/* right: the skills themselves */}
              {showSkills && (
              <div className="border-t border-white/10 pt-4 max-sm:-mt-1 max-sm:border-t-0 max-sm:pt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <h3 className={`${factLabel} max-sm:sr-only`}>
                  What's included <span className="normal-case tracking-normal text-primary/45">· {current.items.length} skills</span>
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${current.category} skills`}>
                  {current.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-white/20 bg-white/[0.03] px-3 py-1 text-[15px] text-primary transition-colors hover:border-primary/60 hover:bg-primary/10 sm:px-3.5 sm:py-1.5"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>

        {/* position dots (the button is a 24px tap target; the visible dot sits inside it) */}
        <div className="mt-2 flex justify-center max-sm:hidden tiny:hidden">
          {skills.map((s, i) => (
            <button
              key={s.category}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.category}`}
              aria-current={i === active ? 'true' : undefined}
              className="group flex h-6 min-w-6 items-center justify-center px-1"
            >
              <span
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-primary' : 'w-1.5 bg-primary/25 group-hover:bg-primary/50'}`}
              />
            </button>
          ))}
        </div>
      </Reveal>
    </Page>
  );
}
