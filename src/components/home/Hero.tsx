import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SceneBackground } from './SceneBackground';
import { TopNav } from './TopNav';
import { AvailabilityBadge } from './AvailabilityBadge';
import { RoleTypewriter } from './RoleTypewriter';
import { NameReveal } from './NameReveal';
import { HireButton } from './HireButton';
import { CustomCursor } from './CustomCursor';
import { AmbientToggle } from './AmbientToggle';
import { ScrollHint } from './ScrollHint';

const DESCRIPTION =
  'Full-stack developer from Fatehabad, Haryana. I build secure, role-based web apps with React, Node.js & MongoDB, and interactive 3D experiences with Three.js & GSAP — shipped to AWS.';

/** Each page is one screen, so "scrolling" down on Home means: go to About. */
function useScrollToAbout() {
  const navigate = useNavigate();
  useEffect(() => {
    let wheel = 0;
    let touchY: number | null = null;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      navigate('/about');
    };
    const onWheel = (e: WheelEvent) => {
      wheel = Math.max(0, wheel + e.deltaY);
      if (wheel > 120) go();
    };
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0]?.clientY ?? null);
    const onTouchEnd = (e: TouchEvent) => {
      const end = e.changedTouches[0]?.clientY;
      if (touchY !== null && end !== undefined && touchY - end > 70) go();
      touchY = null;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate]);
}

export function Hero() {
  useScrollToAbout();

  return (
    <section data-hero-bg aria-label="Introduction" className="relative h-dvh w-full overflow-hidden bg-ink font-display text-bone">
      <SceneBackground />
      <TopNav />

      {/* badge: top-left on desktop; on phones just under the top navbar */}
      <AvailabilityBadge className="absolute left-10 top-6 z-10 max-[900px]:left-4 max-[900px]:top-[58px]" />

      {/* content: name bottom-left, description + CTA bottom-right; one column at ≤900px.
          Bottom padding keeps everything clear of the dock. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-10 px-10 pb-[136px] max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:justify-end max-[900px]:gap-3 max-[900px]:px-4 max-[900px]:pb-[96px]">
        <div className="min-w-0">
          <RoleTypewriter />
          <NameReveal name="Piyush" className="mt-2 text-[clamp(110px,16vw,300px)] max-[900px]:mt-1 max-[900px]:text-[clamp(52px,15vw,104px)]" />
        </div>

        <div className="flex w-[380px] max-w-full shrink-0 flex-col gap-5 pb-3 max-[900px]:w-full max-[900px]:gap-3 max-[900px]:pb-0">
          <p className="text-[15px] leading-relaxed text-bone-dim sm:text-base max-[900px]:text-[13px] max-[900px]:leading-[1.55]">{DESCRIPTION}</p>
          <HireButton className="max-[900px]:self-end" />
        </div>
      </div>

      {/* bottom corners (wide screens only) */}
      <ScrollHint className="absolute bottom-7 left-10 z-10 max-[1099px]:hidden" />
      <AmbientToggle className="absolute bottom-9 right-10 z-10 max-[1099px]:hidden" />

      <CustomCursor />
    </section>
  );
}
