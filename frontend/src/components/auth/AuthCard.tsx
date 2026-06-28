import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-line bg-surface p-8 shadow-lg sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
