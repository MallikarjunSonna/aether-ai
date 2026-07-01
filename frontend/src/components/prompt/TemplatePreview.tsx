import { Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { extractVariables } from "../../services/prompt/PromptService";

interface TemplatePreviewProps {
  content: string;
}

export function TemplatePreview({ content }: TemplatePreviewProps) {
  const variables = useMemo(() => extractVariables(content), [content]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handlePreview() {
    let result = content;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), () => value);
    }
    setPreview(result);
  }

  function handleReset() {
    const empty: Record<string, string> = {};
    for (const v of variables) {
      empty[v] = "";
    }
    setValues(empty);
    setPreview(null);
  }

  if (variables.length === 0) {
    return (
      <div className="rounded-lg border border-line/60 bg-canvas/50 p-4">
        <p className="text-sm text-muted">No variables to preview. Add {"{{variable}}"} placeholders to your template.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {variables.map((v) => (
          <div key={v}>
            <label htmlFor={`preview-${v}`} className="block text-xs font-medium text-muted mb-1">
              {v}
            </label>
            <input
              id={`preview-${v}`}
              type="text"
              value={values[v] ?? ""}
              onChange={(e) => handleChange(v, e.target.value)}
              placeholder={`Value for ${v}`}
              className="block h-8 w-full rounded-md border border-line bg-canvas px-2.5 text-xs text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePreview}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          Preview
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-fast hover:bg-neutral-800 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {preview !== null && (
        <div className="rounded-lg border border-line/60 bg-neutral-900 p-4">
          <pre className="whitespace-pre-wrap break-words text-sm text-ink font-mono">
            {preview}
          </pre>
        </div>
      )}
    </div>
  );
}
