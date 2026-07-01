import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useMemo } from "react";

import { promptService } from "../../services/prompt/PromptService";

interface TemplateValidationBadgeProps {
  content: string;
}

export function TemplateValidationBadge({ content }: TemplateValidationBadgeProps) {
  const validation = useMemo(() => promptService.validateTemplate(content), [content]);

  if (validation.valid && validation.warnings.length === 0) {
    return (
      <div className="rounded-lg border border-green-600/20 bg-green-600/5 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" aria-hidden="true" />
          <span className="text-sm font-medium text-green-400">
            Template validation passed
          </span>
        </div>
        {validation.variableCount > 0 && (
          <p className="mt-1 text-xs text-muted">
            {validation.variableCount} variable{validation.variableCount !== 1 ? "s" : ""} detected
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {validation.errors.length > 0 && (
        <div className="rounded-lg border border-error/20 bg-error/5 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-error" aria-hidden="true" />
            <span className="text-sm font-medium text-error">
              {validation.errors.length} error{validation.errors.length !== 1 ? "s" : ""}
            </span>
          </div>
          <ul className="mt-1.5 space-y-1">
            {validation.errors.map((err, i) => (
              <li key={i} className="text-xs text-error flex items-start gap-1.5">
                <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-error" />
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-600/20 bg-amber-600/5 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-sm font-medium text-amber-400">
              {validation.warnings.length} warning{validation.warnings.length !== 1 ? "s" : ""}
            </span>
          </div>
          <ul className="mt-1.5 space-y-1">
            {validation.warnings.map((warn, i) => (
              <li key={i} className="text-xs text-amber-400 flex items-start gap-1.5">
                <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.variableCount > 0 && (
        <p className="text-xs text-muted">
          {validation.variableCount} variable{validation.variableCount !== 1 ? "s" : ""} detected
        </p>
      )}
    </div>
  );
}
