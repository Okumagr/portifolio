import { motion, type HTMLMotionProps } from 'motion/react';

type Props = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  x?: number;
};

/** Fade + slide in when the element scrolls into view. */
export default function Reveal({ delay = 0, y = 28, x = 0, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
