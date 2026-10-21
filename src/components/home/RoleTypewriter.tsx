import { useEffect, useState } from 'react';
import { useReducedMotionPref } from '@/hooks';

const ROLES = ['Full Stack Developer', 'Shopify Developer', 'Figma UI/UX Designer', 'DevOps Developer'];

const TYPE_MS = 60;
const DELETE_MS = 35;
const HOLD_MS = 1600;

/** "› Full Stack Developer|" — types, holds, deletes, next role, forever. */
export function RoleTypewriter() {
  const reduce = useReducedMotionPref();
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const role = ROLES[roleIndex];
    let delay = deleting ? DELETE_MS : TYPE_MS;
    let next: () => void;

    if (!deleting && text === role) {
      delay = HOLD_MS;
      next = () => setDeleting(true);
    } else if (deleting && text === '') {
      next = () => {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      };
    } else {
      next = () => setText(deleting ? role.slice(0, text.length - 1) : role.slice(0, text.length + 1));
    }
    const t = window.setTimeout(next, delay);
    return () => window.clearTimeout(t);
  }, [text, deleting, roleIndex, reduce]);

  const shown = reduce ? ROLES[0] : text;

  return (
    <p className="flex h-6 items-center font-mono text-[15px] text-amber max-[900px]:h-5 max-[900px]:text-[13px]">
      <span className="sr-only">Roles: {ROLES.join(', ')}</span>
      <span aria-hidden="true" className="whitespace-pre">
        › {shown}
        <span className="[animation:caret-blink_0.8s_step-end_infinite]">|</span>
      </span>
    </p>
  );
}
