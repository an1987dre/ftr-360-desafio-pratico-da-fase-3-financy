import { z } from "zod";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "./category.constants.js";

export const categoryInputSchema = z.object({
  title: z.string().trim().min(1, "Informe o título").max(100, "O título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(255, "A descrição deve ter no máximo 255 caracteres")
    .nullish()
    .transform((value) => value || null),
  icon: z.enum(CATEGORY_ICONS, { errorMap: () => ({ message: "Ícone inválido" }) }),
  color: z.enum(CATEGORY_COLORS, { errorMap: () => ({ message: "Cor inválida" }) }),
});
