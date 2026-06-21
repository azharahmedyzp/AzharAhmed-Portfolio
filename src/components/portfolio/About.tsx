import { useEffect, useRef, useState } from "react";
import { Brain, Coffee, Bot, type LucideIcon } from "lucide-react";
import { Section } from "./Section";
import profileImg from "../../../Profile_Picture.jpg";

function AnimatedCounter({ target, suffix }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {count}{suffix}
    </div>
  );
}

const traits: { icon: LucideIcon; label: string }[] = [
  { icon: Brain, label: "Fluent in algorithms" },
  { icon: Coffee, label: "Powered by curiosity" },
  { icon: Bot, label: "Passionate about AI" },
];

export function About() {
  return (
    <Section id="about" eyebrow="// 01" title="About Me" subtitle="Certified Data Scientist building intelligent systems">
      <div className="grid md:grid-cols-[20rem_1fr] gap-12 items-center">
        <div className="relative mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent via-primary to-secondary blur-2xl opacity-40 animate-pulse-glow" />
          <div className="relative w-72 h-72 rounded-3xl glass-card flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-accent via-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <img src={profileImg} alt="Profile picture" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-semibold leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-gradient">Data Scientist & ML Developer</span>{" "}
            crafting AI solutions for real-world problems
          </h3>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            I'm an Information Technology undergraduate at the University of Sindh, focused on
            Machine Learning, Deep Learning, and Data Analysis. I build predictive models, fine-tune
            transformer architectures, and ship interactive AI applications end-to-end.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From Vision Transformers for medical imaging to DistilBERT-powered spam detection, I love
            turning research-grade models into clean, deployable products.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {traits.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="px-4 py-2 rounded-full glass-card text-sm flex items-center gap-2 hover:bg-primary/10 transition">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{t.label}</span>
                </div>
              );
            })}
          </div>

          <blockquote className="mt-8 pl-4 border-l-2 border-primary italic text-muted-foreground">
            "Engineering the future with AI — one neural network at a time."
          </blockquote>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { target: 10, suffix: "+", label: "Projects" },
              { target: 4, suffix: "+", label: "Certifications" },
              { target: 0, suffix: "", label: "Curiosity", symbol: true },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                {s.symbol ? (
                  <div className="text-3xl font-bold text-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>∞</div>
                ) : (
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                )}
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}