import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Projects } from "@/components/portfolio/Projects";
import { Education, Certifications } from "@/components/portfolio/Journey";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Azhar Ahmed — AI & Data Science Portfolio" },
      { name: "description", content: "Aspiring Data Scientist & ML Developer. Building intelligent systems with Python, Deep Learning, NLP & Computer Vision." },
      { property: "og:title", content: "Azhar Ahmed — AI & Data Science Portfolio" },
      { property: "og:description", content: "Aspiring Data Scientist & ML Developer. Building intelligent systems with Python, Deep Learning, NLP & Computer Vision." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Education />
      <Certifications />
      <Skills />
      <Contact />
    </main>
  );
}
