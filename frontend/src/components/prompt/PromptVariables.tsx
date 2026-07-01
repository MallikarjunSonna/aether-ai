interface PromptVariablesProps {
  variables: string[];
}

export function PromptVariables({ variables }: PromptVariablesProps) {
  if (variables.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5" role="list" aria-label="Template variables">
      {variables.map((variable) => (
        <span
          key={variable}
          role="listitem"
          className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-mono text-primary"
        >
          <span aria-hidden="true">{`{{`}</span>
          {variable}
          <span aria-hidden="true">{`}}`}</span>
        </span>
      ))}
    </div>
  );
}
