import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import Reveal from './Reveal';
import { projects, type Project } from '../data';

function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 20 });
  const sy = useSpring(my, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-colors duration-500 hover:border-aqua/40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(320px circle at var(--x) var(--y), rgb(94 231 224 / 0.14), transparent 70%)' }}
        />
        <div className="relative flex items-start justify-between">
          <span className="font-mono text-xs text-teal">0{i + 1}</span>
          {p.status && (
            <span className="rounded-full border border-aqua/30 bg-aqua/10 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-aqua uppercase">
              {p.status}
            </span>
          )}
        </div>

        <h3 className="relative mt-6 text-xl font-semibold transition group-hover:text-aqua">{p.title}</h3>
        <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>

        <ul className="relative mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="rounded-md bg-teal/10 px-2.5 py-1 font-mono text-[11px] text-teal">
              {t}
            </li>
          ))}
        </ul>

        {(p.href || p.repo) && (
          <div className="relative mt-6 flex items-center gap-4 border-t border-line pt-5 text-sm">
            {p.href && (
              <a href={p.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-mist transition hover:text-aqua">
                Live <ArrowUpRight size={15} />
              </a>
            )}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mist transition hover:text-aqua">
                <FaGithub size={15} /> Code
              </a>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3">Selected work</p>
          <h2 className="section-title">
            My <span className="text-water">Projects</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Early work and experiments from my journey in Full Stack development.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Card key={i} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
