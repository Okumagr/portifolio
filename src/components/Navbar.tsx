import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Menu, X } from 'lucide-react';
import { nav, profile } from '../data';

const sections = ['home', 'about', 'projects', 'contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-line/70 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-6">
        <a href="#home" className="group text-lg font-medium tracking-tight text-teal">
          Gabriel <span className="text-aqua transition group-hover:text-mist">Renan</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted transition hover:-translate-y-0.5 hover:text-aqua">
            <FaLinkedin size={22} />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted transition hover:-translate-y-0.5 hover:text-aqua">
            <FaGithub size={22} />
          </a>
          {nav.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative text-sm transition ${isActive ? 'text-aqua' : 'text-mist/80 hover:text-aqua'}`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-aqua shadow-[0_0_8px_rgb(94_231_224)]"
                  />
                )}
              </a>
            );
          })}
          <a href="#contact" className="btn-outline !px-4 !py-2">
            Let&apos;s Connect
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer rounded-lg p-2 text-mist md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line/70 bg-ink/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[...nav, { label: "Let's Connect", href: '#contact' }].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-mist/90 transition hover:bg-teal/10 hover:text-aqua"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-5 px-3 text-muted">
                <a href={profile.linkedin} aria-label="LinkedIn"><FaLinkedin size={22} /></a>
                <a href={profile.github} aria-label="GitHub"><FaGithub size={22} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
