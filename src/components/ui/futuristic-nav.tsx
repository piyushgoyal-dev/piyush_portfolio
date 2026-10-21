import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Home, Search, Bell, User, Settings, Bookmark } from "lucide-react";
import { useFinePointer, useReducedMotionPref } from "@/hooks";

// Floating "LumaBar" dock (adapted from 21st.dev "futuristic-nav").
// Changes vs. the original:
//  - items come from props and render as real links (href)
//  - can be controlled (`active` + `onChange`) so the page can drive it
//  - macOS-style magnification near the cursor (mouse only, off for reduced motion)
//  - active item: warm radial highlight + glowing amber dot, centred on the measured icon
//  - tooltips on hover and keyboard focus, never clipped
//  - 44px icons at ≤900px so 6 items fit small phones
//  - no "use client" (Next.js-only)

export interface NavItem {
  id: string | number;
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const defaultItems: NavItem[] = [
  { id: 0, icon: <Home size={24} />, label: "Home" },
  { id: 1, icon: <Search size={24} />, label: "Search" },
  { id: 2, icon: <Bell size={24} />, label: "Alerts" },
  { id: 3, icon: <User size={24} />, label: "Profile" },
  { id: 4, icon: <Bookmark size={24} />, label: "Saved" },
  { id: 5, icon: <Settings size={24} />, label: "Settings" },
];

const MAX_SCALE = 1.45;
const FALLOFF = 130; // px from the icon centre where magnification fades to 1

interface LumaBarProps {
  items?: NavItem[];
  /** Controlled active index. Omit to let the bar manage it itself. */
  active?: number;
  onChange?: (index: number) => void;
  "aria-label"?: string;
}

interface DockItemProps {
  item: NavItem;
  isActive: boolean;
  mouseX: MotionValue<number>;
  onSelect: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

function DockItem({ item, isActive, mouseX, onSelect, setRef }: DockItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Scale from horizontal distance to the cursor (Infinity = cursor not over the dock).
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-FALLOFF, 0, FALLOFF], [1, MAX_SCALE, 1]);
  const scale = useSpring(target, { stiffness: 380, damping: 28, mass: 0.4 });

  const className = `relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors min-[901px]:h-14 min-[901px]:w-14 ${
    isActive ? "text-bone" : "text-bone-dim hover:text-bone"
  }`;

  return (
    <div
      ref={(el) => {
        ref.current = el;
        setRef(el);
      }}
      className="group relative flex flex-col items-center"
    >
      {item.href ? (
        <motion.a href={item.href} aria-label={item.label} aria-current={isActive ? "page" : undefined} onClick={onSelect} style={{ scale, originY: 0.85 }} className={className}>
          {item.icon}
        </motion.a>
      ) : (
        <motion.button type="button" aria-label={item.label} aria-pressed={isActive} onClick={onSelect} style={{ scale, originY: 0.85 }} className={className}>
          {item.icon}
        </motion.button>
      )}

      {/* glowing amber dot under the active icon */}
      {isActive && (
        <span aria-hidden="true" className="absolute -bottom-1 h-1 w-1 rounded-full bg-amber shadow-[0_0_6px_2px_rgba(242,180,106,0.7)] min-[901px]:-bottom-1.5" />
      )}

      {/* tooltip (hover + keyboard focus) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full mb-4 whitespace-nowrap rounded-md bg-bone px-2 py-1 font-display text-xs font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
      >
        {item.label}
      </span>
    </div>
  );
}

const LumaBar = ({ items = defaultItems, active: controlled, onChange, "aria-label": ariaLabel = "Main" }: LumaBarProps) => {
  const [internal, setInternal] = useState(0);
  const active = controlled ?? internal;
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [glowX, setGlowX] = useState<number | null>(null);
  const mouseX = useMotionValue(Infinity);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const magnify = fine && !reduce;

  // Centre the highlight on the active icon (re-measured on resize).
  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current[active];
      if (el) setGlowX(el.offsetLeft + el.offsetWidth / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, items.length]);

  const select = (index: number) => {
    setInternal(index);
    onChange?.(index);
  };

  return (
    <nav aria-label={ariaLabel} className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 font-display min-[901px]:bottom-6">
      <div
        onPointerMove={(e) => {
          if (magnify && e.pointerType === "mouse") mouseX.set(e.clientX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
        className="glass relative flex items-center justify-center gap-1 rounded-full px-3 py-2 shadow-xl min-[901px]:gap-5 min-[901px]:px-5 min-[901px]:py-3"
      >
        {/* warm radial highlight behind the active icon (clipped to the pill; tooltips are not) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          {glowX !== null && (
            <motion.div
              className="absolute top-1/2 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(242,180,106,0.55),rgba(242,180,106,0)_70%)] blur-md"
              initial={false}
              animate={{ left: glowX, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </div>

        {items.map((item, index) => (
          <DockItem
            key={item.id}
            item={item}
            isActive={index === active}
            mouseX={mouseX}
            onSelect={() => select(index)}
            setRef={(el) => {
              itemRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </nav>
  );
};

export default LumaBar;
