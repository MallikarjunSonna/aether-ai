import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Building2,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const cards = [
  {
    title: "Welcome Back",
    description: "Your AI workspace is ready. Continue where you left off.",
    icon: Sparkles,
    className: "col-span-full lg:col-span-2",
  },
  {
    title: "Organization",
    description: "Manage your team, roles, and billing settings.",
    icon: Building2,
    className: "col-span-full sm:col-span-1",
  },
  {
    title: "Workspace",
    description: "Configure your active workspace and preferences.",
    icon: Layers,
    className: "col-span-full sm:col-span-1",
  },
  {
    title: "Recent Activity",
    description: "No recent activity to display.",
    icon: Activity,
    className: "col-span-full lg:col-span-2",
  },
  {
    title: "Quick Actions",
    description: "Start a new chat, create a prompt, or upload a document.",
    icon: Zap,
    className: "col-span-full lg:col-span-2",
  },
];

export function DashboardHome() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your AI workspace.
          </p>
        </div>
        <a
          href="/dashboard/chat"
          className="hidden items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:border-neutral-500 hover:bg-neutral-800 sm:flex"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          New Chat
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            {...fadeUp}
            transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
            className={`rounded-xl border border-line/60 bg-surface p-6 ${card.className}`}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-ink">{card.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {card.description}
                </p>
              </div>
            </div>
            {card.title === "Quick Actions" && (
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {["New Chat", "New Prompt", "Upload"].map((action) => (
                  <a
                    key={action}
                    href="#"
                    className="flex items-center justify-between rounded-lg border border-line/50 bg-canvas px-3.5 py-2.5 text-sm text-muted transition-colors duration-fast hover:border-neutral-500 hover:text-ink"
                  >
                    {action}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
            {card.title === "Recent Activity" && (
              <div className="mt-5 rounded-lg border border-dashed border-line/40 bg-canvas/50 px-4 py-6 text-center">
                <Activity className="mx-auto h-6 w-6 text-muted/50" aria-hidden="true" />
                <p className="mt-2 text-xs text-muted/60">No recent activity</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
