import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import type { ReactNode } from 'react';
import Reveal from './Reveal';
import { profile } from '../data';

// Defina PUBLIC_FORM_ENDPOINT no .env (ex.: https://formspree.io/f/xxxxxx).
// Sem endpoint, o formulário abre o app de e-mail com a mensagem preenchida.
const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

type Status = 'idle' | 'sending' | 'success' | 'error';

function Info({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-linear-to-br from-panel to-ink text-teal transition duration-300 group-hover:border-aqua/50 group-hover:text-aqua group-hover:shadow-[0_0_20px_-4px_rgb(94_231_224/0.6)]">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted">{label}</span>
        <span className="block truncate text-sm text-mist">{value}</span>
      </span>
    </>
  );
  const cls = 'group flex items-center gap-4';
  return href ? (
    <a href={href} className={cls}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Field({ label, name, type = 'text', textarea = false }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const base =
    'peer w-full rounded-xl border border-transparent bg-deep/80 px-4 pt-6 pb-2 text-sm text-mist outline-none transition placeholder-transparent focus:border-teal/70 focus:bg-deep focus:shadow-[0_0_0_4px_rgb(58_168_181/0.12)]';
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={name} name={name} required rows={4} placeholder={label} className={`${base} resize-none`} />
      ) : (
        <input id={name} name={name} type={type} required placeholder={label} className={base} />
      )}
      <label
        htmlFor={name}
        className="pointer-events-none absolute top-2 left-4 text-[11px] text-teal transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-aqua"
      >
        {label} *
      </label>
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!ENDPOINT) {
      const subject = encodeURIComponent(String(data.get('subject')));
      const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const socials = [
    { Icon: FaLinkedin, href: profile.linkedin, label: 'LinkedIn' },
    { Icon: FaGithub, href: profile.github, label: 'GitHub' },
    { Icon: FaWhatsapp, href: profile.whatsapp, label: 'WhatsApp' },
  ];

  return (
    <section id="contact" className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
        <Reveal x={-24} y={10} className="space-y-8">
          <div>
            <p className="eyebrow mb-3">Contact</p>
            <h3 className="text-lg font-medium">Contact Info</h3>
          </div>
          <div className="space-y-6">
            <Info icon={<Mail size={20} />} label="My email" value={profile.email} href={`mailto:${profile.email}`} />
            <Info icon={<Phone size={20} />} label="Contact" value={profile.phone} href={profile.whatsapp} />
            <Info icon={<MapPin size={20} />} label="Location" value={profile.location} />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Social Info</h3>
            <div className="flex gap-4">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -5, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-12 w-12 place-items-center rounded-full border border-line bg-linear-to-br from-panel to-ink text-mist transition-colors hover:border-aqua/60 hover:text-aqua hover:shadow-[0_0_24px_-4px_rgb(94_231_224/0.6)]"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-teal/20 blur-[80px]" />
          <h2 className="relative text-3xl font-light sm:text-4xl">
            Let&apos;s work <span className="text-water font-normal">together.</span>
          </h2>
          <form onSubmit={onSubmit} className="relative mt-8 space-y-4">
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Your Subject" name="subject" />
            <Field label="Your Message" name="message" textarea />
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-sea to-teal text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgb(58_168_181/0.9)] transition hover:shadow-[0_14px_36px_-10px_rgb(94_231_224/0.7)] disabled:opacity-80"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  {status === 'idle' && (<>Send Message <Send size={16} /></>)}
                  {status === 'sending' && (<>Sending <Loader2 size={16} className="animate-spin" /></>)}
                  {status === 'success' && (<>Message sent! <Check size={16} /></>)}
                  {status === 'error' && <>Something went wrong — try again</>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
