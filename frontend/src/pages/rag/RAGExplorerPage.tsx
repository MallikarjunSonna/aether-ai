import { CitationList } from "../../components/rag/CitationList";
import { RAGStatusCard } from "../../components/rag/RAGStatusCard";
import { RetrievedContextPanel } from "../../components/rag/RetrievedContextPanel";
import { RetrievedSources } from "../../components/rag/RetrievedSources";

export function RAGExplorerPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">RAG Explorer</h1>
        <p className="mt-1 text-sm text-muted">
          Inspect the retrieval pipeline, sources, context, and citations.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RAGStatusCard />
        <RetrievedSources />
      </div>

      <div className="mb-6">
        <RetrievedContextPanel />
      </div>

      <div className="mb-6">
        <CitationList />
      </div>
    </div>
  );
}
