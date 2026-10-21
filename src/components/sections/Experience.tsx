import { useEffect, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks';
import { experience } from '@/data/resume';
import { Page } from '@/components/layout/Page';
import { PageHeader, Reveal } from './Section';

/** "Healee – R&D · Remote" → "Healee" (short label for the phone tabs). */
const shortName = (company: string) => company.split(/\s[–·-]\s|\s·/)[0];

// On phones and short laptop screens the bullets are shown a few at a time
// so every role fits one screen without scrolling.
const PHONE_PAGE_SIZE = 2;
const SMALL_PHONE_PAGE_SIZE = 1; // e.g. iPhone SE
const SHORT_PAGE_SIZE = 4;

export function Experience() {
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);
  const phone = useMediaQuery('(max-width: 639px)');
  const shortScreen = useMediaQuery('(max-height: 740px)');
  const smallPhone = phone && shortScreen;
  const job = experience[active];

  const perPage = smallPhone ? SMALL_PHONE_PAGE_SIZE : phone ? PHONE_PAGE_SIZE : shortScreen ? SHORT_PAGE_SIZE : job.points.length;
  const pageCount = Math.ceil(job.points.length / perPage);
  const shown = job.points.slice(page * perPage, page * perPage + perPage);
  useEffect(() => setPage(0), [active, phone, shortScreen]);
  const turn = (dir: number) => setPage((p) => Math.min(pageCount - 1, Math.max(0, p + dir)));
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 40) turn(info.offset.x < 0 ? 1 : -1);
  };

  // Arrow keys move between roles (ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + experience.length) % experience.length;
    setActive(next);
    document.getElementById(`role-tab-${next}`)?.focus();
  };

  return (
    <Page>
      <PageHeader eyebrow="02 — Experience" title="Where I've worked." />

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        {/* role list */}
        <Reveal className="lg:col-span-4">
          <div role="tablist" aria-orientation="vertical" aria-label="Roles" onKeyDown={onKeyDown} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {experience.map((r, i) => {
              const isActive = i === active;
              return (
                <button
                  key={r.role}
                  id={`role-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="role-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 rounded-2xl text-left transition-colors duration-300 lg:w-full lg:p-4 lg:pl-6 short:lg:py-3 ${
                    isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  } max-lg:rounded-full max-lg:border max-lg:px-4 max-lg:py-2 ${isActive ? 'max-lg:border-primary/50' : 'max-lg:border-white/15'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="role-indicator"
                      aria-hidden="true"
                      className="absolute inset-y-3 left-0 hidden w-[3px] rounded-full bg-primary lg:block"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="text-sm font-medium text-primary lg:hidden">{shortName(r.company)}</span>
                  <span className="hidden lg:block">
                    <span className={`block font-mono text-xs uppercase tracking-widest ${isActive ? 'text-primary/70' : 'text-primary/45'}`}>{r.period}</span>
                    <span className={`mt-1.5 block text-lg font-medium leading-snug ${isActive ? 'text-primary' : 'text-primary/60'}`}>{r.role}</span>
                    <span className={`mt-0.5 block text-sm ${isActive ? 'text-primary/70' : 'text-primary/45'}`}>{r.company}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* selected role */}
        <Reveal delay={0.1} className="lg:col-span-8">
          <div id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${active}`} className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 xshort:p-4 md:p-8 short:md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={job.role}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 border-b border-white/10 pb-4 md:pb-5">
                  <div>
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-primary sm:text-2xl md:text-[28px]">{job.role}</h2>
                    <p className="mt-1 text-base text-primary/70">{job.company}</p>
                  </div>
                  <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary/75">{job.period}</span>
                </div>
                <motion.div onPanEnd={onPanEnd} style={{ touchAction: 'pan-y' }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={page}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-5 space-y-3 short:mt-4 short:space-y-2"
                    >
                      {shown.map((p) => (
                        <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-primary/85 md:text-base">
                          <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                          {p}
                        </li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </motion.div>
                {pageCount > 1 && (
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="font-mono text-xs text-primary/60" aria-live="polite">
                      {page + 1} / {pageCount}
                    </span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => turn(-1)} disabled={page === 0} aria-label="Previous points" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-primary transition disabled:opacity-30">
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => turn(1)} disabled={page === pageCount - 1} aria-label="More points" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-primary transition disabled:opacity-30">
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Page>
  );
}
