import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Heading words rise in one after another (used by page headings). */
export const WordsPullUp = ({ text, className = '', style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block"
          style={{ marginRight: i === words.length - 1 ? 0 : '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
