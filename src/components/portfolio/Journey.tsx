import { Section } from "./Section";
import { useEffect, useRef } from "react";

type Item = {
  kind: "Education" | "Certification";
  title: string;
  org: string;
  period: string;
  desc?: string;
  tags?: string[];
};

const items: Item[] = [
  {
    kind: "Education",
    title: "BS in Information Technology",
    org: "University of Sindh, Jamshoro",
    period: "2025 — 2029",
  },
  {
    kind: "Education",
    title: "FSc. Pre-Engineering",
    org: "Federal Govt. Degree College, Cantt",
    period: "2022 — 2024",
  },
  {
    kind: "Certification",
    title: "AI & Data Science Training Program",
    org: "Saylani Mass IT Training",
    period: "2025 — 2026",
    desc: "Intensive hands-on program covering the full ML lifecycle: data preprocessing, modeling, evaluation, and deployment.",
    tags: ["Python Foundations", "Data Science with Python", "Statistics & Math for ML", "Machine Learning", "Deep Learning", "MLOps", "Big Data & Cloud", "Generative AI (LLMs)", "Agentic AI"]
  },
  {
    kind: "Certification",
    title: "Introduction to Modern AI",
    org: "Cisco Networking Academy (NetAcad)",
    period: "2025",
    desc: "Foundational concepts in modern AI systems, neural networks, and real-world applications.",
    tags: ["AI Foundations"],
  },
  {
    kind: "Certification",
    title: "PITP Certified Java Developer",
    org: "People's IT Training Programme",
    period: "2025",
    desc: "Object-oriented design, data structures, and Java application development.",
    tags: ["Java", "OOP", "Java Swing"],
  },
  {
    kind: "Certification",
    title: "PITP Certified Web Developer",
    org: "People's IT Training  Programme",
    period: "2024",
    desc: "Full-stack web fundamentals across HTML, CSS, and JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "Tailwind", "Jquery"],
  },
];

function Timeline({ entries, isLarge = false }: { entries: Item[]; isLarge?: boolean }) {
  // Ref array to hold each entry element for IntersectionObserver
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fade‑up on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    entryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
      <div className={isLarge ? "space-y-11" : "space-y-10"}>
        {entries.map((it, i) => {
          const left = i % 2 === 0;
          return (
            <div
              ref={(el) => { entryRefs.current[i] = el; }}
              key={it.title}
              className={`relative md:grid md:grid-cols-2 ${isLarge ? "md:gap-[3.3rem]" : "md:gap-12"
                } ${left ? "" : "md:[&>*:first-child]:order-2"} fade-up`}
            >
              <div className={`pl-12 md:pl-0 ${left ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                <div className={`glass-card rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 ${isLarge ? "p-[1.65rem]" : "p-6"
                  }`}>
                  <div className={`flex items-center ${isLarge ? "gap-[0.55rem] mb-[0.55rem]" : "gap-2 mb-2"} ${left ? "md:justify-end" : ""}`}>
                    <span className={`font-mono bg-primary/20 text-primary border border-primary/30 ${isLarge ? "text-[0.825rem] px-[0.55rem] py-[0.1375rem] rounded-full" : "text-xs px-2 py-0.5 rounded-full"
                      }`}>
                      {it.kind}
                    </span>
                    <span className={isLarge ? "text-[0.825rem] text-muted-foreground" : "text-xs text-muted-foreground"}>{it.period}</span>
                  </div>
                  <h3 className={isLarge ? "text-[1.24rem] font-bold" : "text-lg font-bold"} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {it.title}
                  </h3>
                  <p className={`${isLarge ? "text-[0.96rem]" : "text-sm"} text-primary mt-0.5`}>{it.org}</p>
                  <p className={`${isLarge ? "text-[0.96rem]" : "text-sm"} text-muted-foreground mt-3 leading-relaxed`}>{it.desc}</p>
                  {it.tags && (
                    <div className={`${isLarge ? "mt-[1.1rem] gap-[0.4125rem]" : "mt-4 gap-1.5"} flex flex-wrap ${left ? "md:justify-end" : ""}`}>
                      {it.tags.map((t) => (
                        <span key={t} className={`rounded bg-secondary/10 border border-secondary/20 font-mono ${isLarge ? "text-[0.825rem] px-[0.55rem] py-[0.1375rem]" : "text-xs px-2 py-0.5"
                          }`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden md:block" />
              <div className={`absolute left-4 md:left-1/2 top-6 -translate-x-1/2 rounded-full bg-gradient-to-br from-accent to-primary shadow-[0_0_16px_oklch(0.72_0.21_305/0.8)] ring-4 ring-background ${isLarge ? "w-[1.1rem] h-[1.1rem]" : "w-4 h-4"
                }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Education() {
  const entries = items.filter((i) => i.kind === "Education");
  return (
    <Section
      id="education"
      eyebrow="// 03"
      title="Education"
      subtitle="Academic foundation in technology, mathematics, and computational thinking"
      className="py-[7.7rem]"
    >
      <Timeline entries={entries} isLarge={true} />
    </Section>
  );
}

export function Certifications() {
  const entries = items.filter((i) => i.kind === "Certification");
  return (
    <Section
      id="certifications"
      eyebrow="// 04"
      title="Certifications"
      subtitle="Specialized training and credentials shaping my AI engineering practice"
    >
      <Timeline entries={entries} />
    </Section>
  );
}