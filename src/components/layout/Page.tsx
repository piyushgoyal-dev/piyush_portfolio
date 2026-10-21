import type { ReactNode } from 'react';

/**
 * One full-screen page. Content is centred in the viewport, with room for the
 * top bar and the floating navbar. If a screen is too short for the content,
 * the page scrolls inside itself as a fallback so nothing is ever cut off.
 */
export function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-dvh overflow-y-auto overscroll-contain">
      <div className={`mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-4 pb-[5.5rem] pt-16 sm:px-6 sm:pb-28 md:px-10 ${className}`}>
        {children}
      </div>
    </div>
  );
}
