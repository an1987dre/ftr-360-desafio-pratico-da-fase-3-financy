import { cn, initials } from "@/lib/utils";

type AvatarProps = { name: string; size?: "sm" | "lg"; className?: string };

export function Avatar({ name, size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gray-300 font-medium text-gray-800",
        size === "sm" ? "size-9 text-sm" : "size-16 text-2xl",
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
