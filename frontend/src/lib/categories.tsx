import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  type LucideIcon,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
} from "lucide-react";

/**
 * Ícones e cores de categoria — espelho de
 * backend/src/graphql/modules/category/category.constants.ts (invariante I-7).
 */
export const CATEGORY_ICONS = {
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  "tool-case": ToolCase,
  utensils: Utensils,
  "paw-print": PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  "baggage-claim": BaggageClaim,
  mailbox: Mailbox,
  "receipt-text": ReceiptText,
} satisfies Record<string, LucideIcon>;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;
export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS) as CategoryIconKey[];

/**
 * Classes literais (o Tailwind precisa enxergá-las no código-fonte).
 * Figma: tag = fundo light + texto dark; ícone = fundo light + traço base.
 */
export const CATEGORY_COLORS = {
  green: { text: "text-green-dark", icon: "text-green-base", bg: "bg-green-light", solid: "bg-green-base" },
  blue: { text: "text-blue-dark", icon: "text-blue-base", bg: "bg-blue-light", solid: "bg-blue-base" },
  purple: { text: "text-purple-dark", icon: "text-purple-base", bg: "bg-purple-light", solid: "bg-purple-base" },
  pink: { text: "text-pink-dark", icon: "text-pink-base", bg: "bg-pink-light", solid: "bg-pink-base" },
  red: { text: "text-red-dark", icon: "text-red-base", bg: "bg-red-light", solid: "bg-red-base" },
  orange: { text: "text-orange-dark", icon: "text-orange-base", bg: "bg-orange-light", solid: "bg-orange-base" },
  yellow: { text: "text-yellow-dark", icon: "text-yellow-base", bg: "bg-yellow-light", solid: "bg-yellow-base" },
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;
export const CATEGORY_COLOR_KEYS = Object.keys(CATEGORY_COLORS) as CategoryColorKey[];

export function categoryIcon(key: string): LucideIcon {
  return CATEGORY_ICONS[key as CategoryIconKey] ?? Tag;
}

export function categoryColor(key: string) {
  // Tag neutra do Figma: fundo gray-200 + texto gray-700.
  return CATEGORY_COLORS[key as CategoryColorKey] ?? {
    text: "text-gray-700",
    icon: "text-gray-600",
    bg: "bg-gray-200",
    solid: "bg-gray-500",
  };
}
