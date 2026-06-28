import { motion } from "framer-motion";
import {
  ArrowRight,
  Atom,
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  BrainCircuit,
  Check,
  Container,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Layers3,
  Library,
  LockKeyhole,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";

const stats = [
  { value: "40+", label: "Enterprise Customers" },
  { value: "120M+", label: "Tokens Processed" },
  { value: "99.99%", label: "Availability" },
  { value: "18+", label: "Integrated Models" },
];

const technologies = [
  { name: "React", icon: Atom, color: "text-secondary" },
  { name: "FastAPI", icon: Zap, color: "text-success" },
  { name: "PostgreSQL", icon: Database, color: "text-blue-400" },
  { name: "Docker", icon: Container, color: "text-primary" },
  { name: "LangGraph", icon: GitBranch, color: "text-warning" },
  { name: "OpenAI", icon: BrainCircuit, color: "text-neutral-200" },
  { name: "Anthropic", icon: Sparkles, color: "text-amber-400" },
  { name: "Ollama", icon: Bot, color: "text-neutral-300" },
];

const features = [
  { title: "AI Chat", description: "Production-ready conversations with streaming, memory, and provider flexibility built in.", icon: Bot },
  { title: "Multi-Agent", description: "Design specialized agent teams that reason, collaborate, and execute complex workflows.", icon: Network },
  { title: "Knowledge Base", description: "Turn enterprise content into accurate, permission-aware answers your teams can trust.", icon: Library },
  { title: "Prompt Library", description: "Create, version, test, and share high-performing prompts across every workspace.", icon: FileCode2 },
  { title: "Analytics", description: "Monitor quality, latency, token usage, and cost from one real-time control plane.", icon: BarChart3 },
  { title: "Enterprise Security", description: "Protect every interaction with granular access, audit trails, and isolated workspaces.", icon: ShieldCheck },
];

const workflowNodes = [
  { name: "User", detail: "Natural language request", icon: UserRound },
  { name: "Planner", detail: "Decomposes the objective", icon: Workflow },
  { name: "Research Agent", detail: "Executes parallel tasks", icon: Search },
  { name: "Knowledge Base", detail: "Retrieves trusted context", icon: Database },
  { name: "LLM", detail: "Reasons across providers", icon: Cpu },
  { name: "Response", detail: "Verified enterprise answer", icon: MessageSquare },
];

const trustItems = [
  { title: "Enterprise Security", description: "Granular access controls, audit-ready activity logs, and encryption at every layer.", icon: ShieldCheck },
  { title: "Workspace Isolation", description: "Dedicated data boundaries keep every team, project, and knowledge source separated.", icon: Layers3 },
  { title: "Model Agnostic Architecture", description: "Use the best model for each workload without locking your platform to one provider.", icon: Boxes },
];

const footerLinks = [
  { title: "Product", links: ["Features", "Roadmap", "Pricing"] },
  { title: "Developers", links: ["API", "Docs", "SDK"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

function WorkflowVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg"
      aria-label="Animated Aether AI agent workflow"
    >
      <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-line/80 bg-surface/90 p-4 shadow-lg backdrop-blur-xl sm:p-5">
        <div className="flex items-center justify-between border-b border-line/80 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Live orchestration</p>
            <p className="mt-1 text-sm font-semibold text-ink">Enterprise research flow</p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-success" />
            Processing
          </span>
        </div>

        <div className="mx-auto mt-5 max-w-sm">
          {workflowNodes.map((node, index) => (
            <div key={node.name}>
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.18, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-lg border border-line/80 bg-canvas/70 p-2.5 shadow-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, delay: index * 0.22, repeat: Infinity, repeatDelay: 1.5 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary"
                >
                  <node.icon className="h-4 w-4" aria-hidden="true" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-ink">{node.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted">{node.detail}</p>
                </div>
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              </motion.div>
              {index < workflowNodes.length - 1 && (
                <div className="relative mx-auto h-3 w-px overflow-hidden bg-line" aria-hidden="true">
                  <motion.span
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, delay: index * 0.14, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-primary to-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  return (
    <div id="top">
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-20 opacity-[0.13] [background-image:linear-gradient(to_right,#647084_1px,transparent_1px),linear-gradient(to_bottom,#647084_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <motion.div
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.08, 0.95], x: [0, 28, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[10%] top-[-15%] -z-10 h-[560px] w-[760px] rounded-full bg-primary/20 blur-[150px]"
        />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:px-8 sm:pt-28 lg:px-10 lg:pb-24 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-20">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-blue-300 shadow-sm backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Enterprise AI Platform
              </motion.div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[5.35rem]">
                Enterprise AI.
                <span className="block bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">Unified.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Build AI agents, manage enterprise knowledge, and orchestrate multiple LLM providers from one intelligent platform.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-fast hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                  Start Building
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a href="/docs" className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface/80 px-5 py-3 text-sm font-semibold text-ink backdrop-blur transition-all duration-fast hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                  <BookOpen className="h-4 w-4 text-muted" aria-hidden="true" />
                  View Documentation
                </a>
              </div>
            </motion.div>
            <WorkflowVisual />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 lg:mt-20 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1 + index * 0.1, ease: "easeOut" }}
                className="rounded-lg border border-line/80 bg-surface/50 px-4 py-5 backdrop-blur-sm sm:px-5"
              >
                <p className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[11px] text-muted sm:text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line/70 bg-surface/30 py-14 [content-visibility:auto]" aria-labelledby="technology-heading">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <p id="technology-heading" className="mb-8 text-center text-xs font-medium uppercase tracking-[0.22em] text-muted">Trusted technology. One unified platform.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {technologies.map((technology, index) => (
              <motion.div
                key={technology.name}
                {...fadeUp}
                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group flex h-28 flex-col items-center justify-center gap-3 rounded-lg border border-line/80 bg-canvas/70 px-3 shadow-sm transition-colors duration-normal hover:border-neutral-500 hover:bg-surface"
              >
                <technology.icon className={`h-6 w-6 transition-transform duration-normal group-hover:scale-110 ${technology.color}`} aria-hidden="true" />
                <span className="text-xs font-medium text-neutral-300">{technology.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 [content-visibility:auto] sm:px-8 lg:px-10 lg:py-32">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">One intelligent platform</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Everything required to ship enterprise AI.</h2>
          <p className="mt-5 text-base leading-7 text-muted">Move from prototype to production without stitching together a fragile stack of disconnected tools.</p>
        </motion.div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              {...fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.42, delay: index * 0.05, ease: "easeOut" }}
              className="group rounded-xl bg-gradient-to-br from-line via-line to-neutral-700 p-px shadow-sm transition-shadow duration-normal hover:from-primary/60 hover:via-line hover:to-secondary/40 hover:shadow-lg"
            >
              <div className="h-full rounded-[calc(0.75rem-1px)] bg-surface/95 p-7">
                <motion.div whileHover={{ rotate: -5, scale: 1.08 }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-canvas text-primary shadow-sm transition-colors duration-normal group-hover:border-primary/30 group-hover:bg-primary/10">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </motion.div>
                <h3 className="mt-7 text-lg font-semibold tracking-tight text-ink">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
                <div className="mt-7 flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors group-hover:text-primary">
                  Explore capability <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/30 py-24 [content-visibility:auto]" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Built for the enterprise</p>
            <h2 id="trust-heading" className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Why Enterprise Teams Choose Aether AI</h2>
          </motion.div>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {trustItems.map((item, index) => (
              <motion.article key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }} className="rounded-xl border border-line bg-canvas/70 p-7 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary/10 text-secondary"><item.icon className="h-5 w-5" aria-hidden="true" /></div>
                <h3 className="mt-6 text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="[content-visibility:auto]">
        <motion.div {...fadeUp} className="mx-auto grid max-w-7xl gap-10 px-6 py-24 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Designed for control</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Your models. Your data. One architecture.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">Connect cloud and local models, ground every response in trusted knowledge, and retain complete visibility across the system.</p>
          </div>
          <a href="/docs" className="group inline-flex w-fit items-center gap-2 rounded-md border border-line bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            Explore architecture <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </motion.div>
      </section>

      <footer className="border-t border-line bg-surface/30 [content-visibility:auto]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-primary" aria-hidden="true" /> Aether AI</div>
              <p className="mt-3 max-w-xs text-xs leading-5 text-muted">Enterprise intelligence, orchestrated across every model, agent, and knowledge source.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {footerLinks.map((column) => (
                <div key={column.title}>
                  <h2 className="text-xs font-semibold text-ink">{column.title}</h2>
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => <li key={link}><a href={link === "Features" ? "#features" : "/" + link.toLowerCase()} className="text-xs text-muted transition-colors hover:text-ink">{link}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 border-t border-line pt-6 text-xs text-muted">© 2026 Aether AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
