import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputProps = ComponentProps<"input"> & {
  /** Ícone à esquerda (ex.: <Mail />). */
  icon?: ReactNode;
  /** Elemento à direita (ex.: botão mostrar senha). */
  trailing?: ReactNode;
  invalid?: boolean;
};

/**
 * Estados do Figma (Style Guide › Input): a borda fica sempre gray-300 (gray-200 desabilitado);
 * o ícone indica o estado: vazio gray-400 · ativo brand · preenchido gray-800 · erro danger.
 */
export function Input({ className, icon, trailing, invalid, ...props }: InputProps) {
  return (
    <div
      className={cn(
        "input-box group/input flex h-12 w-full items-center gap-3 rounded-md border border-gray-300 bg-white px-3 text-gray-800 transition-colors",
        "has-[input:disabled]:border-gray-200 has-[input:disabled]:text-gray-400",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className={cn(
            "text-gray-400 transition-colors [&_svg]:size-4",
            // Preenchido só vale sem foco; com foco (ativo) o ícone é brand, como no Figma.
            "[.input-box:has(input:not(:placeholder-shown)):not(:focus-within)_&]:text-gray-800",
            "group-focus-within/input:text-brand-base group-has-[input:disabled]/input:text-gray-400",
            invalid && "text-danger [.input-box:has(input:not(:placeholder-shown)):not(:focus-within)_&]:text-danger group-focus-within/input:text-danger",
          )}
        >
          {icon}
        </span>
      ) : null}
      <input
        aria-invalid={invalid || undefined}
        className="h-full min-w-0 flex-1 bg-transparent text-base caret-brand-base outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        {...props}
      />
      {trailing}
    </div>
  );
}
