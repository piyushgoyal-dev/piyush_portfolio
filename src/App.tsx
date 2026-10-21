import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Briefcase, FolderGit2, Home as HomeIcon, Mail, Sparkles, User } from 'lucide-react';
import LumaBar, { type NavItem } from '@/components/ui/futuristic-nav';
import { Hero } from '@/components/home/Hero';
import { TopBar } from '@/components/layout/TopBar';

// Inner pages load as separate files, so Home downloads only what Home needs.
const loaders = {
  about: () => import('@/components/sections/About').then((m) => ({ default: m.About })),
  experience: () => import('@/components/sections/Experience').then((m) => ({ default: m.Experience })),
  projects: () => import('@/components/sections/Projects').then((m) => ({ default: m.Projects })),
  skills: () => import('@/components/sections/Skills').then((m) => ({ default: m.Skills })),
  contact: () => import('@/components/sections/Contact').then((m) => ({ default: m.Contact })),
};
const About = lazy(loaders.about);
const Experience = lazy(loaders.experience);
const Projects = lazy(loaders.projects);
const Skills = lazy(loaders.skills);
const Contact = lazy(loaders.contact);

/** Once the first page is up and the browser is idle, fetch the other pages so navigation is instant. */
function usePrefetchPages() {
  useEffect(() => {
    const prefetch = () => Object.values(loaders).forEach((load) => void load());
    const idle = window.requestIdleCallback?.(prefetch, { timeout: 4000 });
    const timer = idle === undefined ? window.setTimeout(prefetch, 2500) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);
}
import { profile } from '@/data/resume';
import { pageIndex, pages } from '@/routes';

const ICON = { size: 22, 'aria-hidden': true } as const;
const icons = [HomeIcon, User, Briefcase, FolderGit2, Sparkles, Mail];

const navItems: NavItem[] = pages.map((p, i) => {
  const Icon = icons[i];
  return { id: p.path, label: p.label, href: p.path, icon: <Icon {...ICON} /> };
});

/** Route internal <a href="/…"> clicks through the router (no full page reloads). */
function useClientLinks() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      const href = a?.getAttribute('href');
      if (!a || !href || !href.startsWith('/') || a.target || a.hasAttribute('download') || /\.[a-z0-9]+$/i.test(href)) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
}

export default function App() {
  const location = useLocation();
  const index = pageIndex(location.pathname);
  useClientLinks();
  usePrefetchPages();

  useEffect(() => {
    document.title = index === 0 ? `${profile.name} — Full-Stack Developer` : `${pages[index].label} — ${profile.name}`;
  }, [index]);

  return (
    // reducedMotion="user": framer-motion skips animations for prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      {index !== 0 && <TopBar index={index} />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="h-dvh"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={null}>
            <Routes location={location}>
              <Route path="/" element={<Hero />} />
              <Route path="/about" element={<About />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <LumaBar items={navItems} active={index} aria-label="Pages" />
    </MotionConfig>
  );
}
