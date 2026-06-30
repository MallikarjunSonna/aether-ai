import { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import type { ProviderType } from "../../types/ai";

export interface ProviderInfo {
  type: ProviderType;
  name: string;
  supportsStreaming: boolean;
  healthStatus: "healthy" | "unavailable";
}

export interface ModelInfo {
  id: string;
  name: string;
}

interface ProviderSelectorProps {
  currentProvider: ProviderType;
  currentModel: string;
  providers: ProviderInfo[];
  models: ModelInfo[];
  onProviderChange: (type: ProviderType) => void;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  currentProvider,
  currentModel,
  providers,
  models,
  onProviderChange,
  onModelChange,
  disabled,
}: ProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const currentProviderInfo = providers.find((p) => p.type === currentProvider);

  return (
    <div ref={dropdownRef} className="relative ml-auto" onKeyDown={handleKeyDown}>
      <button
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select AI provider"
        className="flex items-center gap-1.5 rounded-lg border border-line/60 bg-surface px-2.5 py-1.5 text-xs font-medium text-ink transition-colors duration-fast hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            currentProviderInfo?.healthStatus === "healthy"
              ? "bg-success"
              : "bg-error"
          }`}
          aria-hidden="true"
        />
        <span className="max-w-[100px] truncate">
          {currentProviderInfo?.name ?? currentProvider}
        </span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-dropdown mt-1 w-64 rounded-xl border border-line/60 bg-surface shadow-lg"
          role="listbox"
          aria-label="Available providers and models"
        >
          {providers.length === 0 && models.length === 0 && (
            <div className="px-4 py-3 text-xs text-muted">
              No providers available.
            </div>
          )}

          {providers.length > 0 && (
            <div className="p-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Providers
              </div>
              {providers.map((provider) => {
                const isSelected = provider.type === currentProvider;
                return (
                  <button
                    key={provider.type}
                    onClick={() => {
                      onProviderChange(provider.type);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-ink hover:bg-canvas"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        provider.healthStatus === "healthy"
                          ? "bg-success"
                          : "bg-error"
                      }`}
                      aria-label={
                        provider.healthStatus === "healthy"
                          ? "Healthy"
                          : "Unavailable"
                      }
                    />
                    <span className="flex-1">{provider.name}</span>
                    {provider.supportsStreaming && (
                      <span className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        stream
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {models.length > 0 && (
            <div className="border-t border-line/60 p-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Models
              </div>
              {models.map((model) => {
                const isSelected = model.id === currentModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-ink hover:bg-canvas"
                    }`}
                  >
                    <span className="flex-1">{model.name}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
