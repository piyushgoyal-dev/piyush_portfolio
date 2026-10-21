// One route per section. Order here = order in the navbar and the "Next" link.
export const pages = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/experience', label: 'Experience' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/contact', label: 'Contact' },
] as const;

export const pageIndex = (pathname: string) => Math.max(0, pages.findIndex((p) => p.path === pathname));
