import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transactions", label: "Transações", end: false },
  { to: "/categories", label: "Categorias", end: false },
];

export function Header() {
  const { user } = useAuth();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-(--container-app) items-center justify-between gap-2 px-4 sm:gap-4 lg:px-0">
        <Link to="/" className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:outline-none">
          <Logo variant="responsive" />
        </Link>
        <nav aria-label="Principal" className="flex min-w-0 items-center gap-0.5 sm:gap-5">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-1.5 py-1 text-[13px] whitespace-nowrap transition-colors sm:px-2 sm:text-sm focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:outline-none",
                  isActive ? "font-semibold text-brand-base" : "text-gray-600 hover:text-gray-800",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/profile"
          aria-label="Meu perfil"
          className="rounded-full focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Avatar name={user?.name ?? ""} />
        </Link>
      </div>
    </header>
  );
}
