import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./header";

/** Casca das páginas privadas (T-41). `children` é usado pelo Dashboard em `/`. */
export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-(--container-app) px-4 py-8 lg:px-0 lg:py-12">{children ?? <Outlet />}</main>
    </div>
  );
}
