import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { pages } from '@/routes';
import { profile } from '@/data/resume';

/** Slim bar on inner pages: name (→ home), page counter with progress, and a "Next" link. */
export function TopBar({ index }: { index: number }) {
  const current = pages[index];
  const next = pages[(index + 1) % pages.length];
  const total = pages.length - 1; // Home isn't counted as a numbered page

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:px-10">
        <Link to="/" className="text-sm font-medium tracking-tight text-primary transition-opacity hover:opacity-70 sm:text-base">
          {profile.name}
        </Link>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-3 sm:flex" aria-label={`Page ${index} of ${total}: ${current.label}`}>
            <span className="font-mono text-xs text-primary/60">
              {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="relative h-px w-20 overflow-hidden bg-white/15" aria-hidden="true">
              <motion.span
                className="absolute inset-y-0 left-0 bg-primary"
                initial={false}
                animate={{ width: `${(index / total) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
            <span className="text-sm text-primary">{current.label}</span>
          </div>
          <Link
            to={next.path}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-primary transition-colors hover:border-primary/50"
          >
            <span className="text-primary/60">Next:</span> {next.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
