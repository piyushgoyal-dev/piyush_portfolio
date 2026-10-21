import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun } from 'lucide-react';
import { about } from '@/data/resume';
import { useMediaQuery } from '@/hooks';
import { Page } from '@/components/layout/Page';
import { Reveal } from './Section';

const EASE = [0.16, 1, 0.3, 1] as const;
const PHONE_PAGE_SIZE = 1; // paragraphs per page on phones, so the page never scrolls

/** Words wrapped in a hand-drawn amber circle that draws itself in. */
function Circled({ children }: { children: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[7%] -inset-y-[22%] h-[144%] w-[114%] overflow-visible text-amber"
      >
        <motion.path
          d="M162 9C78 4 9 19 8 50c-1 33 79 45 154 43 76-2 132-17 130-47-2-27-62-41-150-37"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: 'easeInOut' }}
        />
      </motion.svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** Small hand-drawn spiral doodle. */
const Spiral = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className={className}>
    <path d="M32 32c0-2 2-3 4-2s2 5-1 6-7-1-7-5 4-8 9-7 9 6 8 11-6 10-12 10-12-5-12-12 6-14 14-14 15 6 15 14" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line key={a} x1="32" y1="3" x2="32" y2="7" transform={`rotate(${a} 32 32)`} />
    ))}
  </svg>
);

/** The illustration: gently floats, with a soft shadow on the "ground" that breathes with it. */
function FloatingPortrait() {
  return (
    <figure className="relative mx-auto w-[min(150px,18dvh)] tiny:max-sm:w-[14dvh] sm:w-[min(220px,26dvh)] lg:w-[min(340px,46dvh)] xl:w-[min(440px,54dvh)]">
      <Spiral className="absolute -left-6 -top-6 z-10 h-10 w-10 text-primary/45 lg:-left-9 lg:-top-9 lg:h-16 lg:w-16" />
      <Sun aria-hidden="true" className="absolute -right-4 -top-4 z-10 h-8 w-8 text-amber [animation:spin_18s_linear_infinite] lg:-right-7 lg:-top-7 lg:h-14 lg:w-14" />

      <div className="[animation:float-y_5s_ease-in-out_infinite]">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9),0_20px_80px_-30px_rgba(110,200,150,0.45)] lg:rounded-[2rem]">
          <img src={about.image} alt={about.imageAlt} width={900} height={900} decoding="async" className="block aspect-square w-full object-cover" />
        </div>
      </div>
      {/* ground shadow: shrinks and fades as the picture rises */}
      <div aria-hidden="true" className="mx-auto mt-4 h-3 w-3/4 rounded-[50%] bg-black/80 blur-lg [animation:float-shadow_5s_ease-in-out_infinite] lg:mt-7 lg:h-5" />
    </figure>
  );
}

export function About() {
  const phone = useMediaQuery('(max-width: 639px)');
  const [page, setPage] = useState(0);
  const { heading, paragraphs } = about;

  const perPage = phone ? PHONE_PAGE_SIZE : paragraphs.length;
  const pageCount = Math.ceil(paragraphs.length / perPage);
  const shown = paragraphs.slice(page * perPage, page * perPage + perPage);
  useEffect(() => setPage(0), [phone]);
  const turn = (dir: number) => setPage((p) => Math.min(pageCount - 1, Math.max(0, p + dir)));
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 40) turn(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <Page>
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-16">
        {/* text */}
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary/55">01 — About</p>
          <h1 className="font-display text-[2.1rem] font-semibold tiny:max-sm:text-[1.8rem] leading-[1.08] tracking-[-0.035em] text-primary sm:text-5xl lg:text-[3.4rem] short:lg:text-5xl tiny:lg:text-[2.6rem]">
            {heading.before} <Circled>{heading.highlight}</Circled>
            {heading.after}
          </h1>

          <motion.div onPanEnd={onPanEnd} style={{ touchAction: 'pan-y' }} className="mt-6 lg:mt-8 short:lg:mt-6 tiny:max-sm:mt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="space-y-4 short:space-y-3"
              >
                {shown.map((p) => (
                  <p
                    key={p}
                    className={`text-[15px] leading-relaxed md:text-[17px] short:md:text-base tiny:md:text-[15px] ${
                      p === paragraphs[0] ? 'text-primary/90' : 'text-primary/70'
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-xs text-primary/60" aria-live="polite">
                {page + 1} / {pageCount}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => turn(-1)} disabled={page === 0} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-primary transition disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => turn(1)} disabled={page === pageCount - 1} aria-label="Read more" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-primary transition disabled:opacity-30">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </Reveal>

        {/* illustration */}
        <Reveal delay={0.1} className="order-first lg:order-none">
          <FloatingPortrait />
        </Reveal>
      </div>
    </Page>
  );
}
