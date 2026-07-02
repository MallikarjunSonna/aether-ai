import { Github, BookOpen, Globe, HardDrive, MessageSquare, Bug, TrendingUp, Puzzle, FileText, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import type { ConnectorProvider } from "../../types/connector";

interface ConnectorSetupModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProviderOption {
  provider: ConnectorProvider;
  label: string;
  description: string;
  icon: typeof Github;
}

const providerOptions: ProviderOption[] = [
  { provider: "github", label: "GitHub", description: "Repositories, issues, pull requests, and files.", icon: Github },
  { provider: "notion", label: "Notion", description: "Pages, databases, and blocks.", icon: FileText },
  { provider: "confluence", label: "Confluence", description: "Pages, blog posts, attachments, and spaces.", icon: BookOpen },
  { provider: "google_drive", label: "Google Drive", description: "Files, folders, documents, and spreadsheets.", icon: HardDrive },
  { provider: "sharepoint", label: "SharePoint", description: "Sites, lists, libraries, and files.", icon: Globe },
  { provider: "slack", label: "Slack", description: "Channels, messages, files, and threads.", icon: MessageSquare },
  { provider: "jira", label: "Jira", description: "Projects, issues, epics, and sprints.", icon: Bug },
  { provider: "linear", label: "Linear", description: "Projects, issues, teams, and cycles.", icon: TrendingUp },
  { provider: "custom", label: "Custom", description: "Bring your own connector implementation.", icon: Puzzle },
];

const providerBgColors: Record<ConnectorProvider, string> = {
  github: "bg-neutral-800 text-neutral-100",
  notion: "bg-neutral-800 text-neutral-100",
  confluence: "bg-blue-900/30 text-blue-400",
  google_drive: "bg-green-900/30 text-green-400",
  sharepoint: "bg-blue-900/30 text-blue-400",
  slack: "bg-purple-900/30 text-purple-400",
  jira: "bg-blue-900/30 text-blue-400",
  linear: "bg-indigo-900/30 text-indigo-400",
  custom: "bg-neutral-800 text-neutral-100",
};

export function ConnectorSetupModal({ open, onClose }: ConnectorSetupModalProps) {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedProvider, setSelectedProvider] = useState<ConnectorProvider | null>(null);

  const handleSelect = (provider: ConnectorProvider) => {
    setSelectedProvider(provider);
    setStep("configure");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedProvider(null);
  };

  const handleDone = () => {
    setStep("select");
    setSelectedProvider(null);
    onClose();
  };

  const selectedOption = providerOptions.find((o) => o.provider === selectedProvider);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Connector setup"
            className="relative z-10 w-full max-w-lg rounded-xl border border-line bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line/60 px-6 py-4">
              <div className="flex items-center gap-3">
                {step === "configure" && (
                  <button
                    onClick={handleBack}
                    aria-label="Back to provider selection"
                    className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <h2 className="text-base font-semibold text-ink">
                  {step === "select" ? "Add Connector" : `Configure ${selectedOption?.label}`}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-7 w-7 items-center justify-center rounded text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              {step === "select" && (
                <div className="grid grid-cols-1 gap-3">
                  {providerOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.provider}
                        onClick={() => handleSelect(option.provider)}
                        className="flex items-center gap-4 rounded-lg border border-line/60 p-4 text-left transition-colors duration-fast hover:border-neutral-500 hover:bg-neutral-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${providerBgColors[option.provider]}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-ink">{option.label}</span>
                          <p className="mt-0.5 text-xs text-muted">{option.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}

              {step === "configure" && selectedOption && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border border-line/60 bg-neutral-900/50 p-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${providerBgColors[selectedOption.provider]}`}
                    >
                      <selectedOption.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="text-sm font-medium text-ink">{selectedOption.label}</span>
                      <p className="mt-0.5 text-xs text-muted">{selectedOption.description}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line/60 bg-neutral-900/30 p-4">
                    <p className="text-sm text-muted">
                      Connector configuration will be available in a future sprint.
                      Authentication via{" "}
                      {selectedOption.provider === "slack" || selectedOption.provider === "google_drive"
                        ? "OAuth"
                        : "API key"}{" "}
                      will be supported.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-md border border-line/60 px-4 py-2 text-sm font-medium text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDone}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
