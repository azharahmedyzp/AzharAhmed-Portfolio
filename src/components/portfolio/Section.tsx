import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), obs.disconnect()),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={cn("relative py-28 px-6", className)}>
      <div className="mx-auto max-w-6xl">
        <div className={`text-center mb-16 transition-all duration-700 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {eyebrow && (
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </span>
          )}
          <h2
            className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-gradient"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className={`transition-all duration-700 delay-200 ${seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {children}
        </div>
      </div>
    </section>
  );
}