import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 sm:px-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
