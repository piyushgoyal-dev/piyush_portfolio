import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { WordsPullUp } from '@/components/ui/words-pull-up';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
  id?: string;
}

/** Shared page heading: same sizes and spacing on every page. */
export function PageHeader({ eyebrow, title, intro, center = false, id }: PageHeaderProps) {
  return (
    <header className={`mb-6 md:mb-10 short:md:mb-6 xshort:mb-4 ${center ? 'text-center' : ''}`}>
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-primary/55">{eyebrow}</p>
      <h1 id={id} className="text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-primary sm:text-5xl lg:text-6xl short:lg:text-5xl tiny:lg:text-[2.75rem] xshort:max-sm:text-[2rem]">
        <WordsPullUp text={title} className={center ? 'justify-center' : ''} />
      </h1>
      {intro && <p className={`mt-3 max-w-xl text-base leading-relaxed text-primary/65 max-sm:hidden md:text-lg short:hidden ${center ? 'mx-auto' : ''}`}>{intro}</p>}
    </header>
  );
}

/** Fade-up on mount (pages are full-screen, so everything is in view). */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15 + delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
