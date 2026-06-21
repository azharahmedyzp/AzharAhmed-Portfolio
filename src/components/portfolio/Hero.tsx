import { useCallback, useEffect, useRef, useState } from "react";
import { Brain, Cpu, Sigma, Download, ArrowRight } from "lucide-react";

function useTypewriter(text: string, speed: number = 45) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
}

function MagneticButton({ children, className, as: Tag = "a", ...props }: { children: React.ReactNode; className?: string; as?: "a" | "button"; [key: string]: any }) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    const dist = Math.hypot(x, y);
    const pull = Math.min(dist, 12);
    const angle = Math.atan2(y, x);
    const tx = Math.cos(angle) * pull;
    const ty = Math.sin(angle) * pull;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return (
    <Tag ref={ref as any} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...props}>
      {children}
    </Tag>
  );
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { displayed, done } = useTypewriter("Welcome to My Portfolio");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 70;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
    const mouse = { x: -1000, y: -1000 };

    const trail: { x: number; y: number; alpha: number }[] = [];

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      trail.push({ x: mouse.x, y: mouse.y, alpha: 0.6 });
      if (trail.length > 20) trail.shift();
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          n.x += (dx / d) * 0.6;
          n.y += (dy / d) * 0.6;
        }
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            const alpha = (1 - d / 130) * 0.35;
            ctx.strokeStyle = `oklch(0.72 0.21 305 / ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "oklch(0.74 0.23 350 / 0.8)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha -= 0.015;
        if (p.alpha <= 0) { trail.splice(i, 1); continue; }
        ctx.fillStyle = `oklch(0.74 0.23 350 / ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute -top-32 -left-16 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[96px] animate-float" />
      <div className="absolute -bottom-32 -right-16 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[96px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs mb-8 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-muted-foreground">Available for opportunities</span>
        </div>

        <h1
          className="font-black tracking-tighter leading-[0.9] text-gradient animate-fade-up whitespace-nowrap"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 10.4vw, 7.2rem)", animationDelay: "0.1s" }}
        >
          AZHAR AHMED
        </h1>

        <div className="mt-6 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />

        <p className="mt-8 text-2xl md:text-3xl font-semibold animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {displayed}<span className={`${done ? "opacity-0" : "animate-blink"}`}>|</span>
        </p>

        <div className="mt-10 flex items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          {[Brain, Cpu, Sigma].map((Icon, i) => (
            <div
              key={i}
              className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-primary animate-pulse-glow"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <Icon className="w-6 h-6" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm uppercase tracking-[0.3em] text-muted-foreground animate-fade-up" style={{ animationDelay: "0.6s" }}>
          Data Scientist · ML Developer · IT Undergraduate
        </p>
        <p className="mt-3 font-mono text-sm text-primary/80 animate-fade-up" style={{ animationDelay: "0.7s" }}>
          Python · Machine Learning · Deep Learning · NLP · Computer Vision · Data Analytics & Visualization
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <MagneticButton href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent via-primary to-secondary text-primary-foreground font-semibold hover:scale-105 transition">
            View My Work <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton
            href="/Azhar_Ahmed_CV.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-primary/10 transition"
          >
            <Download className="w-4 h-4" /> Download CV
          </MagneticButton>
          <MagneticButton href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-primary/10 transition">
            Get in Touch
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-xs flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: "1s" }}>
        <span>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}