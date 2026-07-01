import { Eye, EyeOff, Globe, Lock } from "lucide-react";

import type { PromptTemplateStatus } from "../../types/prompt";

interface TemplatePublishControlsProps {
  status: PromptTemplateStatus;
  onPublish: () => void;
  onDraft: () => void;
}

export function TemplatePublishControls({ status, onPublish, onDraft }: TemplatePublishControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {status === "draft" ? (
        <button
          onClick={onPublish}
          className="inline-flex items-center gap-1.5 rounded-md border border-green-600/30 bg-green-600/10 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors duration-fast hover:bg-green-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          Publish
        </button>
      ) : (
        <button
          onClick={onDraft}
          className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/30 bg-amber-600/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors duration-fast hover:bg-amber-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
        >
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          Unpublish
        </button>
      )}
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
          status === "published"
            ? "bg-green-600/10 text-green-400"
            : "bg-neutral-800 text-muted"
        }`}
      >
        {status === "published" ? (
          <>
            <Globe className="h-3 w-3" aria-hidden="true" />
            Published
          </>
        ) : (
          <>
            <Lock className="h-3 w-3" aria-hidden="true" />
            Draft
          </>
        )}
      </span>
    </div>
  );
}
