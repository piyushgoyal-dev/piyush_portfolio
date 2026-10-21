import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMagnetic } from '@/hooks';

/** Bone pill + dark arrow circle. Magnetic, glows on hover, routes to Contact. */
export function HireButton({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, 0.3);
  return (
    <Link
      ref={ref}
      to="/contact"
      className={`group inline-flex items-center gap-2 self-start rounded-full bg-bone py-1 pl-5 pr-1 text-sm font-medium text-ink transition-[box-shadow,gap] duration-300 hover:gap-3 hover:shadow-[0_0_0_6px_rgba(242,180,106,0.18),0_12px_40px_-10px_rgba(242,180,106,0.55)] sm:text-base max-[900px]:pl-4 max-[900px]:text-[13px] ${className}`}
    >
      Hire me
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink transition-transform duration-300 group-hover:-rotate-45 sm:h-10 sm:w-10 max-[900px]:h-8 max-[900px]:w-8">
        <ArrowRight className="h-4 w-4 text-bone" aria-hidden="true" />
      </span>
    </Link>
  );
}
