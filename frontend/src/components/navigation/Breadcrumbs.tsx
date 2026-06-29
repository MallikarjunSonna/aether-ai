import { ChevronRight, Home } from "lucide-react";

const crumbs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Home", href: "/dashboard" },
];

export function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {index === 0 && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
            {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            {isLast ? (
              <span className="text-ink" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <a href={crumb.href} className="transition-colors duration-fast hover:text-ink">
                {crumb.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
