import { ArrowUpRight, Boxes } from "lucide-react";
import { Outlet } from "react-router-dom";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com", external: true },
];

export function RootLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink selection:bg-primary/30">
      <header className="sticky top-0 z-sticky border-b border-line/60 bg-canvas/80 backdrop-blur-xl">
        <nav
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10"
          aria-label="Primary navigation"
        >
          <a href="#top" className="group flex items-center gap-3" aria-label="Aether AI home">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-surface text-primary transition-colors duration-fast group-hover:border-primary/60">
              <Boxes className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Aether AI</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="group flex items-center gap-1 text-sm font-medium text-muted transition-colors duration-fast hover:text-ink"
              >
                {item.label}
                {item.external && (
                  <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
              </a>
            ))}
          </div>

          <a
            href="/login"
            className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-fast hover:border-neutral-500 hover:bg-neutral-800"
          >
            Login
          </a>
        </nav>
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-6 overflow-x-auto px-6 md:hidden">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
