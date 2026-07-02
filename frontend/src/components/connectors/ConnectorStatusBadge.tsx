import type { ConnectorStatus } from "../../types/connector";

interface ConnectorStatusBadgeProps {
  status: ConnectorStatus;
}

const statusStyles: Record<ConnectorStatus, string> = {
  connected: "bg-success/10 text-success",
  connecting: "bg-warning/10 text-warning",
  disconnected: "bg-neutral-800 text-muted",
  error: "bg-error/10 text-error",
};

const statusLabels: Record<ConnectorStatus, string> = {
  connected: "Connected",
  connecting: "Connecting",
  disconnected: "Disconnected",
  error: "Error",
};

export function ConnectorStatusBadge({ status }: ConnectorStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "connected"
            ? "bg-success"
            : status === "error"
              ? "bg-error"
              : status === "connecting"
                ? "bg-warning"
                : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {statusLabels[status]}
    </span>
  );
}
