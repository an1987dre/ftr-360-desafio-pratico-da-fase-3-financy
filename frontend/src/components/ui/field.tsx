import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label + controle + mensagem (Figma › Input): o label fica brand com o campo em foco
 * e danger com erro; o texto de apoio é gray-500 (vermelho quando é erro).
 */
export function Field({ label, htmlFor, error, hint, className, children }: FieldProps) {
  const message = error ?? hint;
  return (
    <div className={cn("group/field flex flex-col gap-2", className)}>
      <Label
        htmlFor={htmlFor}
        className={cn(
          "transition-colors group-focus-within/field:text-brand-base",
          error && "text-danger group-focus-within/field:text-danger",
        )}
      >
        {label}
      </Label>
      {children}
      {message ? (
        <p
          id={`${htmlFor}-message`}
          role={error ? "alert" : undefined}
          className={cn("text-xs", error ? "text-danger" : "text-gray-500")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
