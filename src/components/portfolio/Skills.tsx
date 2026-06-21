// Skills.tsx – Bento layout for Tech Stack
import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Brain,
  Database,
  Wrench,
  BarChart2,
  Sparkles,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { Section } from "./Section";
import { cn } from "../../lib/utils";

// Gradient background for each category icon
const iconBg: Record<string, string> = {
  "Programming Languages": "bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600",
  "Machine Learning & Deep Learning": "bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600",
  "AI Specializations (NLP, GenAI & Computer Vision)": "bg-gradient-to-br from-pink-500 via-pink-400 to-pink-600",
  "Data Visualization": "bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600",
  "Tools & Platforms": "bg-gradient-to-br from-teal-500 via-cyan-400 to-teal-600",
  "Core Competencies": "bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600",
};

// Data for each card
const groups: { title: string; icon: LucideIcon; items: string[] }[] = [
  {
    title: "Machine Learning & Deep Learning",
    icon: Brain,
    items: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "XGBoost",
      "LightGBM",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "ANN",
      "CNN",
      "RNN/LSTM",
      "Transfer Learning",
      "Regression/Classification/Clustering",
      "Feature Engineering",
      "Hyperparameter Tuning (GridSearchCV)",
    ],
  },
  {
    title: "AI Specializations (NLP, GenAI & Computer Vision)",
    icon: Sparkles,
    items: [
      "Hugging Face Transformers",
      "BERT",
      "Word Embeddings",
      "Prompt Engineering",
      "LangChain",
      "Retrieval-Augmented Generation (RAG)",
      "OpenCV",
      "Image Classification & Object Detection",
      "CNN Architectures (ResNet, VGG, YOLO)",
      "Fine-Tuning",
      "APIs",
    ],
  },
  { title: "Programming Languages", icon: Code2, items: ["Python", "Java", "C++", "SQL", "HTML", "CSS", "JavaScript"] },
  { title: "Data Visualization", icon: BarChart2, items: ["Matplotlib", "Seaborn", "Plotly"] },
  { title: "Tools & Platforms", icon: Wrench, items: ["Jupyter Notebook", "Google Colab", "Anaconda", "Git", "GitHub", "VS Code"] },
  {
    title: "Core Competencies",
    icon: Lightbulb,
    items: [
      "Predictive Modeling",
      "Data Wrangling & Cleaning",
      "Exploratory Data Analysis (EDA)",
      "Model Evaluation & Validation",
      "Problem Solving",
    ],
  },
];

// Mapping for grid spans per breakpoint (lg = desktop, md = tablet)
const tileConfig: Record<
  string,
  { colLg: string; rowLg: string; colMd: string; rowMd: string; size: "large" | "medium" | "small" | "smallMedium" }
> = {
  "Machine Learning & Deep Learning": { colLg: "col-span-2", rowLg: "row-span-2", colMd: "col-span-2", rowMd: "row-span-2", size: "large" },
  "AI Specializations (NLP, GenAI & Computer Vision)": { colLg: "col-span-2", rowLg: "", colMd: "col-span-2", rowMd: "", size: "medium" },
  "Programming Languages": { colLg: "col-span-2", rowLg: "", colMd: "col-span-2", rowMd: "", size: "medium" },
  "Data Visualization": { colLg: "", rowLg: "", colMd: "", rowMd: "", size: "small" },
  "Tools & Platforms": { colLg: "", rowLg: "", colMd: "", rowMd: "", size: "small" },
  "Core Competencies": { colLg: "col-span-2", rowLg: "", colMd: "col-span-2", rowMd: "", size: "smallMedium" },
};

// Top‑skill highlights (bold background)
const topSkillsMap: Record<string, string[]> = {
  "Machine Learning & Deep Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "XGBoost"],
  "AI Specializations (NLP, GenAI & Computer Vision)": [
    "Hugging Face Transformers",
    "BERT",
    "Prompt Engineering",
    "LangChain",
    "APIs",
  ],
};

// Border accent per category (top border)
const borderAccent: Record<string, string> = {
  "Programming Languages": "border-t-blue-500",
  "Machine Learning & Deep Learning": "border-t-indigo-500",
  "AI Specializations (NLP, GenAI & Computer Vision)": "border-t-pink-500",
  "Data Visualization": "border-t-orange-500",
  "Tools & Platforms": "border-t-teal-500",
  "Core Competencies": "border-t-emerald-500",
};

export function Skills() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  // IntersectionObserver for fade‑up entrance
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
    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleExpand = (title: string) => {
    setExpanded((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <Section
      id="skills"
      eyebrow="// 05"
      title="Tech Stack"
      subtitle="The tools I reach for when building intelligent systems"
    >
      {/* Responsive grid: 1 column (mobile), 2 columns (tablet), 4 columns (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((g, i) => {
          const Icon = g.icon;
          const bgClass = iconBg[g.title] ?? "bg-gradient-to-br from-accent via-primary to-secondary";
          const cfg = tileConfig[g.title] ?? {
            colLg: "",
            rowLg: "",
            colMd: "",
            rowMd: "",
            size: "small",
          };
          const borderClass = borderAccent[g.title] ?? "";
          const topList = topSkillsMap[g.title] ?? [];

          const isExpanded = expanded.includes(g.title);
          const isExpandable = cfg.size !== "large"; // small/medium tiles can be expanded

          // Condensed one‑line tag summary for collapsed state
          const condensed = g.items.slice(0, 4).join(" · ") + (g.items.length > 4 ? ` · +${g.items.length - 4}` : "");

          return (
            <div
              key={g.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={cn(
                "glass-card rounded-2xl p-6 hover:border-primary/40 transition transform duration-300 ease-out hover:shadow-lg hover:-translate-y-1 fade-up border-t-2",
                cfg.colLg,
                cfg.rowLg,
                cfg.colMd,
                cfg.rowMd,
                borderClass,
                // subtle background wash for the large hero tile
                cfg.size === "large" && "bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-indigo-600/10"
              )}
              style={isExpandable ? { cursor: "pointer" } : undefined}
              onClick={isExpandable ? () => toggleExpand(g.title) : undefined}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground", bgClass)}>
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-mono uppercase tracking-wider text-primary">
                  {g.title}
                </h3>
              </div>

              {/* Tag area */}
              {cfg.size === "large" || isExpanded ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {g.items.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-mono transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_8px_oklch(0.72_0.21_305/0.5)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary/80">{condensed}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}