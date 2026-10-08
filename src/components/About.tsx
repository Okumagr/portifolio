import { useRef } from 'react';
import { motion } from 'motion/react';
import { SiHtml5, SiJavascript, SiReact, SiTypescript } from 'react-icons/si';
import type { IconType } from 'react-icons';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { about, exploring } from '../data';

const skills: { name: string; Icon: IconType; color: string }[] = [
  { name: 'React', Icon: SiReact, color: '#61dafb' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#f7df1e' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3b9bd9' },
  { name: 'HTML5', Icon: SiHtml5, color: '#ff6a3d' },
];

function SkillCard({ name, Icon, color, i }: { name: string; Icon: IconType; color: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="glass group relative overflow-hidden rounded-3xl p-6"
      style={{ ['--c' as string]: color }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(220px circle at var(--x) var(--y), color-mix(in srgb, var(--c) 22%, transparent), transparent 70%)' }}
      />
      <div className="relative flex flex-col items-center gap-4">
        <Icon
          size={52}
          className="text-sea transition duration-500 group-hover:scale-110"
          style={{ filter: 'drop-shadow(0 0 0 transparent)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = color;
            e.currentTarget.style.filter = `drop-shadow(0 0 14px ${color}99)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '';
            e.currentTarget.style.filter = 'drop-shadow(0 0 0 transparent)';
          }}
        />
        <span className="text-sm font-medium text-muted transition group-hover:text-mist">{name}</span>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="eyebrow mb-3">About me</p>
          <h2 className="section-title">
            Get to <span className="text-water">know me</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Here you will find more information about me, what I do, and my current skills mostly in terms of programming and technology.
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2">
          <div className="space-y-5">
            {about.map((p, i) => (
              <Reveal key={i} delay={i * 0.1} x={-24} y={10}>
                <p className="text-[0.95rem] leading-[1.9] text-mist/85">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.35}>
              <a href="#projects" className="btn-outline mt-3">
                Projects <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <h3 className="mb-6 text-center text-lg font-medium">My Skills</h3>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {skills.map((s, i) => (
                <SkillCard key={s.name} {...s} i={i} />
              ))}
            </div>
            <Reveal delay={0.4} className="mt-8 text-center">
              <p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">Currently exploring</p>
              <div className="flex flex-wrap justify-center gap-2">
                {exploring.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-teal/25 bg-teal/5 px-3.5 py-1 text-xs text-aqua/90 transition hover:border-aqua/60 hover:bg-teal/15"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
