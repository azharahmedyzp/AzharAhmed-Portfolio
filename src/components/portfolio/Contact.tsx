import { useMemo, useState } from "react";
import { z } from "zod";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Bot,
  Send,
  Check,
  Copy,
  ArrowRight,
  AlertCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Section } from "./Section";
import { sendContactEmail } from "../../lib/api/contact.functions";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(160, "Email is too long"),
  subject: z.string().trim().min(3, "Subject is too short").max(120, "Keep it under 120 chars"),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(1200, "Message is too long"),
});

type FormState = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "sending" | "sent";

const intents = [
  "Project collaboration",
  "Internship / role",
  "Research / paper",
  "Just saying hi",
];

const EMAIL = "azharahmedyzp@gmail.com";

const links: { label: string; href: string; icon: LucideIcon }[] = [
  { label: EMAIL, href: `mailto:${EMAIL}`, icon: Mail },
  { label: "+92 333 2626501", href: "tel:+923332626501", icon: Phone },
  { label: "GitHub", href: "https://github.com/azharahmedyzp", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/azharahmedyzp/", icon: Linkedin },
  { label: "Hugging Face", href: "https://huggingface.co/azharahmedyzp", icon: Bot },
];

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(
    () => (form.message.trim() ? form.message.trim().split(/\s+/).length : 0),
    [form.message],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setStatus("sending");
    try {
      await sendContactEmail({ data: parsed.data });
      setStatus("sent");
      toast.success("Email sent successfully! I'll get back to you soon.");
      // Reset form after successful submission
      setTimeout(() => {
        setForm({ name: "", email: "", subject: "", message: "" });
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("idle");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send email. Please try again.";
      toast.error(errorMessage);
      console.error("Email submission error:", error);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  const inputCls = (key: keyof FormState) =>
    `w-full bg-input/40 border rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm outline-none transition ${errors[key]
      ? "border-destructive focus:border-destructive"
      : "border-border focus:border-primary"
    }`;

  return (
    <Section
      id="contact"
      eyebrow="// 05"
      title="Let's Connect"
      subtitle="Ready to collaborate on the next AI breakthrough? Let's build something exceptional."
    >
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-4 md:gap-6">
        <form onSubmit={submit} noValidate className="glass-card rounded-2xl md:rounded-3xl p-5 md:p-8">
          <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Send a Message
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
            Pick an intent or write your own — I usually reply within 24 hours.
          </p>

          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
            {intents.map((i) => {
              const active = form.subject === i;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => update("subject", active ? "" : i)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-xs font-mono border transition ${active
                      ? "bg-primary/20 border-primary/50 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                >
                  {i}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className={inputCls("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className={inputCls("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Subject"
                className={inputCls("subject")}
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.subject}
                </p>
              )}
            </div>

            <div>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value.slice(0, 1200))}
                placeholder="Tell me about your project or idea..."
                className={`${inputCls("message")} resize-none`}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                {errors.message ? (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{wordCount} words</span>
                )}
                <span
                  className={`font-mono text-xs ${form.message.length > 1100 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {form.message.length}/1200
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-accent via-primary to-secondary text-primary-foreground text-xs md:text-sm font-semibold hover:opacity-90 hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" && <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />}
              {status === "sent" && <Check className="w-3 h-3 md:w-4 md:h-4" />}
              {status === "idle" && <Send className="w-3 h-3 md:w-4 md:h-4" />}
              {status === "sent"
                ? "Message Sent!"
                : status === "sending"
                  ? "Sending..."
                  : "Send Message"}
            </button>
          </div>
        </form>

        <div className="space-y-4 md:space-y-6">
          <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <Bot className="w-8 md:w-10 h-8 md:h-10 text-primary mb-2 md:mb-3" />
              <p className="font-mono text-xs md:text-sm text-muted-foreground">
                <span className="text-primary">{">"}</span> Ready to process your ideas into reality.
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="mt-3 md:mt-4 inline-flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-mono hover:bg-primary/20 transition"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy email"}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8">
            <h3 className="text-xs md:text-sm font-mono uppercase tracking-wider text-primary mb-3 md:mb-5">Connect With Me</h3>
            <ul className="space-y-2">
              {links.map((l) => {
                const Icon = l.icon;
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/30 transition group"
                    >
                      <Icon className="w-4 md:w-5 h-4 md:h-5 text-primary flex-shrink-0" />
                      <span className="text-xs md:text-sm flex-1 truncate">{l.label}</span>
                      <ArrowRight className="w-3 md:w-4 h-3 md:h-4 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Azhar Ahmed </p>
      </footer>
    </Section>
  );
}