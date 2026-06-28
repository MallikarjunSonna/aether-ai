import { motion } from "framer-motion";
import { Network } from "lucide-react";

export function DashboardPage() {
  return (
    <section className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white shadow-sm">
          <Network className="h-5 w-5 text-accent" aria-hidden="true" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-normal text-ink sm:text-6xl">
            Aether AI
          </h1>
          <p className="max-w-2xl text-xl leading-8 text-muted">
            Enterprise AI Operating System
          </p>
        </div>
      </motion.div>

      <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div className="h-3 w-28 rounded-full bg-line" />
          <div className="h-24 rounded-md bg-canvas" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-md bg-canvas" />
            <div className="h-16 rounded-md bg-canvas" />
            <div className="h-16 rounded-md bg-canvas" />
          </div>
        </div>
      </div>
    </section>
  );
}
