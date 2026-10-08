import { useEffect, useRef } from 'react';

type Ripple = { x: number; y: number; r: number; max: number; a: number };
type Bubble = { x: number; y: number; r: number; v: number; drift: number; phase: number };

const BLOBS = [
  { x: 0.2, y: 0.25, r: 0.55, c: '31,111,122', a: 0.2, sx: 0.00011, sy: 0.00009 },
  { x: 0.8, y: 0.45, r: 0.5, c: '58,168,181', a: 0.13, sx: 0.00008, sy: 0.00012 },
  { x: 0.5, y: 0.85, r: 0.6, c: '94,231,224', a: 0.07, sx: 0.0001, sy: 0.00007 },
];

export default function WaterBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let lastRipple = 0;
    const mouse = { x: -999, y: -999, sx: -999, sy: -999 };
    const ripples: Ripple[] = [];
    let bubbles: Bubble[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(34, w / 45));
      bubbles = Array.from({ length: count }, () => spawnBubble(true));
    };

    const spawnBubble = (anywhere = false): Bubble => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      r: 1 + Math.random() * 3.2,
      v: 0.15 + Math.random() * 0.45,
      drift: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
    });

    const addRipple = (x: number, y: number, max = 120, a = 0.35) =>
      ripples.push({ x, y, r: 4, max, a });

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (mouse.sx < 0) {
        mouse.sx = e.clientX;
        mouse.sy = e.clientY;
      }
      const now = performance.now();
      if (now - lastRipple > 140) {
        lastRipple = now;
        addRipple(e.clientX, e.clientY, 70, 0.18);
      }
    };
    const onDown = (e: PointerEvent) => {
      addRipple(e.clientX, e.clientY, 220, 0.5);
      addRipple(e.clientX, e.clientY, 140, 0.35);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // Slow drifting light blobs (the "deep water" glow)
      for (const b of BLOBS) {
        const x = (b.x + Math.sin(t * b.sx * 6) * 0.12) * w;
        const y = (b.y + Math.cos(t * b.sy * 6) * 0.1) * h;
        const r = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Soft light that follows the cursor
      mouse.sx += (mouse.x - mouse.sx) * 0.08;
      mouse.sy += (mouse.y - mouse.sy) * 0.08;
      if (mouse.sx > -500) {
        const g = ctx.createRadialGradient(mouse.sx, mouse.sy, 0, mouse.sx, mouse.sy, 320);
        g.addColorStop(0, 'rgba(94,231,224,0.11)');
        g.addColorStop(1, 'rgba(94,231,224,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += (rp.max - rp.r) * 0.04 + 0.4;
        const life = 1 - rp.r / rp.max;
        if (life <= 0.02) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94,231,224,${rp.a * life})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(58,168,181,${rp.a * life * 0.6})`;
        ctx.stroke();
      }

      // Rising bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.v;
        const x = b.x + Math.sin(t * 0.0006 + b.phase) * b.drift;
        if (b.y < -20) bubbles[i] = spawnBubble();
        const fade = Math.min(1, Math.max(0, b.y / (h * 0.25)));
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(150,240,235,${0.35 * fade})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 * fade})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    if (reduce) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
