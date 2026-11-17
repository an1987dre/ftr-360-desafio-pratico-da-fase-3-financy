import { Eye, EyeClosed, Lock } from "lucide-react";
import { useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";

/** Campo de senha com botão mostrar/ocultar. */
export function PasswordInput(props: Omit<InputProps, "type" | "icon" | "trailing">) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? Eye : EyeClosed;
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      icon={<Lock />}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          className="rounded-sm text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:ring-brand-base focus-visible:outline-none"
        >
          <Icon className="size-4" aria-hidden />
        </button>
      }
    />
  );
}
