import logoIconUrl from "@/assets/logo-icon.svg";
import logoUrl from "@/assets/logo.svg";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** "full" = símbolo + FINANCY; "responsive" = só o símbolo em telas pequenas. */
  variant?: "full" | "responsive";
  className?: string;
};

/** Logo oficial (Figma › Vetores). */
export function Logo({ variant = "full", className }: LogoProps) {
  if (variant === "responsive") {
    return (
      <span className={cn("inline-flex", className)}>
        <img src={logoIconUrl} alt="Financy" width={32} height={32} className="h-8 w-8 sm:hidden" />
        <img src={logoUrl} alt="Financy" width={134} height={32} className="hidden h-8 w-auto sm:block" />
      </span>
    );
  }
  return <img src={logoUrl} alt="Financy" width={134} height={32} className={cn("h-8 w-auto", className)} />;
}
