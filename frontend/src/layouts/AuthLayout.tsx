import { Boxes } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const workflowCards = [
  { label: "Ask Aether AI", subtitle: "Natural language request", icon: "💬" },
  { label: "AI Processing", subtitle: "Multi-agent orchestration", icon: "⚡" },
  { label: "Enterprise Answer", subtitle: "Verified, grounded response", icon: "✓" },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="hidden w-[44%] flex-col justify-between bg-gradient-to-br from-neutral-950 via-neutral-900 to-primary/5 p-12 lg:flex">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Boxes className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">Aether AI</span>
          </div>

          <div className="mt-20">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">
              Enterprise AI.
              <span className="block bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
                Unified.
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
              Build AI agents, manage enterprise knowledge, and orchestrate multiple LLM
              providers from one intelligent platform.
            </p>
          </div>
        </div>

        <div className="space-y-3" aria-label="AI workflow illustration">
          {workflowCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-lg border border-line/70 bg-surface/50 p-3.5 backdrop-blur-sm"
            >
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, delay: index * 0.25, repeat: Infinity, repeatDelay: 1.2 }}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-sm text-primary"
                aria-hidden="true"
              >
                {card.icon}
              </motion.span>
              <div>
                <p className="text-sm font-semibold text-ink">{card.label}</p>
                <p className="mt-0.5 text-xs text-muted">{card.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-line/60 pt-6">
          <p className="text-xs leading-5 text-muted">
            Enterprise-grade security · SOC 2 compliant · Encrypted at rest
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
