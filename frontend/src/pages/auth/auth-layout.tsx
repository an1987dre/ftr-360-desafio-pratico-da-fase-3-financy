import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";

type AuthLayoutProps = { title: string; description: string; children: ReactNode; footer: ReactNode };

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
      <Logo />
      <Card className="flex w-full max-w-[448px] flex-col gap-8 p-6 sm:p-8">
        <header className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </header>
        {children}
        <footer className="flex flex-col items-center gap-4 text-sm text-gray-600">
          <div className="flex w-full items-center gap-3 text-gray-500" aria-hidden>
            <span className="h-px flex-1 bg-gray-300" />
            ou
            <span className="h-px flex-1 bg-gray-300" />
          </div>
          {footer}
        </footer>
      </Card>
    </main>
  );
}
