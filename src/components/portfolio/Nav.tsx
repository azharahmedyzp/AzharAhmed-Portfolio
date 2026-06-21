import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#certifications", label: "Certifications" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
      setScrolled(scrollTop > 20);
      for (const l of links) {
        const el = document.querySelector(l.href);
        if (el) {
          const r = (el as HTMLElement).getBoundingClientRect();
          if (r.top <= 96 && r.bottom > 96) setActive(l.href.slice(1));
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
        <div className="h-full bg-gradient-to-r from-accent via-primary to-secondary transition-all duration-150 ease-out animate-progress-glow" style={{ width: `${progress}%` }} />
      </div>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all ${
            scrolled ? "glass-card shadow-[0_6.4px_25.6px_oklch(0_0_0/0.4)]" : ""
          }`}
        >
          <a href="#home" className="font-bold tracking-tight text-gradient text-lg">
            AA<span className="opacity-80">.AI</span>
          </a>
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    active === l.href.slice(1)
                      ? "text-foreground bg-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="text-xs md:text-sm px-4 py-2 rounded-full bg-gradient-to-r from-accent via-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition"
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
    </>
  );
}