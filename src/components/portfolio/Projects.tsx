import { useCallback, useRef, useState } from "react";
import {
  Stethoscope,
  ShieldCheck,
  HeartPulse,
  Home as HomeIcon,
  Shirt,
  BarChart3,
  Github,
  type LucideIcon,
} from "lucide-react";
import { Section } from "./Section";

type Project = {
  title: string;
  blurb: string;
  bullets: string[];
  stack: string[];
  icon: LucideIcon;
  accent: string;
  github: string;
};

const projects: Project[] = [
  {
    title: "PneumoDetect",
    blurb: "Pneumonia detection from chest X-rays with a fine-tuned Vision Transformer.",
    bullets: [
      "Real-time inference via Flask + Docker",
      "Single-backbone ViT for low latency",
      "Glassmorphic clinical UI with scan animations",
    ],
    stack: ["Python", "PyTorch", "ViT", "Flask", "HuggingFace"],
    icon: Stethoscope,
    accent: "from-accent to-primary",
    github: "https://github.com/azharahmedyzp/PneumoDetect",
  },
  {
    title: "SpamShield",
    blurb: "Email spam detection powered by a fine-tuned DistilBERT transformer.",
    bullets: [
      "Trained on 190k Spam/Ham subset",
      "Analyzes up to 2,500 chars per email",
      "GPU auto-detect for accelerated inference",
    ],
    stack: ["Python", "DistilBERT", "PyTorch", "Flask", "NLP"],
    icon: ShieldCheck,
    accent: "from-primary to-secondary",
    github: "https://github.com/azharahmedyzp/SpamShield-BERT",
  },
  {
    title: "Heart Disease Prediction",
    blurb: "End-to-end ML pipeline for cardiovascular risk classification.",
    bullets: [
      "Logistic Regression, Decision Tree, Random Forest",
      "GridSearchCV hyperparameter tuning",
      "Optimised for low false-negative rate",
    ],
    stack: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
    icon: HeartPulse,
    accent: "from-accent to-secondary",
    github: "https://github.com/azharahmedyzp/Heart_Disease_Prediction_Using_Machine_Learning",
  },
  {
    title: "California Housing ANN",
    blurb: "Deep regression network predicting median housing prices.",
    bullets: [
      "Multi-layer ANN with ReLU + Dropout",
      "Early stopping for generalization",
      "Robust validation strategy",
    ],
    stack: ["TensorFlow", "Keras", "NumPy", "Scikit-learn"],
    icon: HomeIcon,
    accent: "from-secondary to-primary",
    github: "https://github.com/azharahmedyzp/California_Housing_Price_Prediction-ANN",
  },
  {
    title: "Fashion MNIST CNN",
    blurb: "Convolutional classifier hitting 90% accuracy across 10 categories.",
    bullets: [
      "Conv + pooling feature extraction",
      "F1-score of 89.93%",
      "Applied computer-vision fundamentals",
    ],
    stack: ["TensorFlow", "Keras", "CNN", "Python"],
    icon: Shirt,
    accent: "from-primary to-accent",
    github: "https://github.com/azharahmedyzp/Fashion_MNIST-CNN",
  },
  {
    title: "EDA Dashboard",
    blurb: "Interactive Streamlit app for no-code exploratory data analysis.",
    bullets: [
      "Upload any dataset, get instant stats",
      "Missing-value detection & visuals",
      "Downloadable reports for non-tech users",
    ],
    stack: ["Streamlit", "Pandas", "Matplotlib", "Seaborn"],
    icon: BarChart3,
    accent: "from-secondary to-accent",
    github: "https://github.com/azharahmedyzp/Data_Analysis_and_Visualization_Dashboard",
  },
];

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onCardMove = useCallback((e: React.MouseEvent, i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotateX = ((y - r.height / 2) / r.height) * -12;
    const rotateY = ((x - r.width / 2) / r.width) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }, []);

  const onCardLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }, []);

  return (
    <Section
      id="projects"
      eyebrow="// 02"
      title="Featured Projects"
      subtitle="An interactive gallery of AI/ML systems I've built end-to-end"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <article
            key={p.title}
            onMouseEnter={() => setActive(i)}
            onMouseMove={(e) => onCardMove(e, i)}
            onMouseLeave={() => { setActive(null); onCardLeave(i); }}
            ref={(el) => { cardRefs.current[i] = el as HTMLDivElement | null; }}
            className="group relative glass-card rounded-3xl p-6 overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/50 will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}
            />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.accent} flex items-center justify-center text-primary-foreground shadow-[var(--shadow-glow)]`}>
                  <p.icon className="w-7 h-7" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>

              <h3 className="mt-5 text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.blurb}</p>

              <ul
                className={`mt-4 space-y-1.5 text-sm overflow-hidden transition-all duration-500 ${active === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-muted-foreground">
                    <span className="text-primary">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-mono hover:bg-primary/20 hover:border-primary/60 transition-all"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}