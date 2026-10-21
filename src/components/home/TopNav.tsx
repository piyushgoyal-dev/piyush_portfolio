import { useRef } from 'react';
import { FileText, Github, Linkedin, type LucideIcon } from 'lucide-react';
import { useMagnetic } from '@/hooks';
import { GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '@/config/links';

interface Item {
  label: string;
  href: string;
  Icon: LucideIcon;
}

const ITEMS: Item[] = [
  { label: 'GitHub', href: GITHUB_URL, Icon: Github },
  { label: 'LinkedIn', href: LINKEDIN_URL, Icon: Linkedin },
  { label: 'Resume', href: RESUME_URL, Icon: FileText },
];

const itemClass =
  'flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium text-bone-dim transition-colors duration-200 hover:bg-white/[0.08] hover:text-bone sm:px-3.5 sm:text-sm';

function NavLink({ label, href, Icon }: Item) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, 0.25);

  const content = (
    <>
      <Icon className="h-[15px] w-[15px]" aria-hidden />
      {label}
    </>
  );

  // Until a URL is filled in (src/config/links.ts) the item shows but isn't a dead link.
  if (!href) {
    return (
      <span aria-disabled="true" title={`Add your ${label} URL in src/config/links.ts`} className={`${itemClass} opacity-50 hover:bg-transparent hover:text-bone-dim`}>
        {content}
      </span>
    );
  }
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={itemClass}>
      {content}
    </a>
  );
}

/** Black pill hanging from the top edge: GitHub · LinkedIn · Resume. */
export function TopNav() {
  return (
    <nav aria-label="Profiles" className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
      <ul className="flex items-center gap-1 rounded-b-2xl bg-black/[0.82] px-2 py-1.5 sm:rounded-b-3xl sm:px-3 sm:py-2">
        {ITEMS.map((item) => (
          <li key={item.label}>
            <NavLink {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
