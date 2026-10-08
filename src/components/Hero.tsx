import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Download } from 'lucide-react';
import { profile } from '../data';

function useTypewriter(words: string[]) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w = 0;
    let i = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        i++;
        setText(word.slice(0, i));
        if (i === word.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 80);
      } else {
        i--;
        setText(word.slice(0, i));
        if (i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
        timer = setTimeout(tick, 40);
      }
    };
    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

export default function Hero() {
  const role = useTypewriter(profile.roles);

  // Mouse-driven 3D tilt on the hero image
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const shineX = useTransform(sx, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
  };
  const item = {
    hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show" className="order-2 lg:order-1 lg:pl-8">
          <motion.p variants={item} className="eyebrow mb-5 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
            </span>
            Available for opportunities
          </motion.p>

          <motion.h1 variants={item} className="text-4xl leading-tight font-light sm:text-5xl">
            <span className="block text-mist">Hi!</span>
            <span className="block">
              I am <span className="text-water font-medium">{profile.name}</span>,
            </span>
            <span className="mt-1 block min-h-[1.3em] text-3xl font-medium text-teal sm:text-4xl">
              <span className="text-water">{role}</span>
              <span className="ml-0.5 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] animate-pulse bg-aqua" />
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted">
            I build clean, fast and thoughtful web experiences — flowing from the interface down to the server.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-solid">
              Let&apos;s Connect <ArrowUpRight size={16} />
            </a>
            <a href={profile.cv} download className="btn-outline">
              Download CV <Download size={16} />
            </a>
          </motion.div>
          <motion.button
            variants={item}
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent('intro:replay'))}
            className="mt-6 cursor-pointer text-xs tracking-wide text-muted transition hover:text-aqua focus-visible:outline focus-visible:outline-aqua focus-visible:outline-offset-4"
          >
            Rever abertura <span aria-hidden="true">↗</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto w-full max-w-lg lg:order-2"
          style={{ perspective: 1000 }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {/* Ripple rings behind the picture */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            {[0, 1.3, 2.6].map((d) => (
              <span
                key={d}
                className="absolute h-[88%] w-[88%] animate-ripple rounded-[3rem] border border-aqua/40"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
            <span className="absolute h-3/4 w-3/4 rounded-full bg-teal/25 blur-[90px]" />
          </div>

          <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="animate-float">
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-teal/30 shadow-[0_30px_80px_-20px_rgb(58_168_181/0.55)]">
              <img
                src="/img/hero.jpg"
                alt="Samurai slicing through a wave of water"
                width={1116}
                height={627}
                fetchPriority="high"
                className="aspect-[4/3] w-full scale-110 object-cover object-[62%_50%] transition duration-700 group-hover:scale-[1.16]"
              />
              <motion.div
                aria-hidden="true"
                style={{ left: shineX }}
                className="pointer-events-none absolute top-0 h-full w-1/3 -translate-x-1/2 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-100"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted uppercase sm:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-aqua"
          />
        </span>
      </motion.a>
    </section>
  );
}
