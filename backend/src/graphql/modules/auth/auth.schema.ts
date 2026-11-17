import { z } from "zod";

const name = z
  .string()
  .trim()
  .min(2, "Informe seu nome")
  .max(100, "O nome deve ter no máximo 100 caracteres");

const email = z.string().trim().toLowerCase().email("E-mail inválido"); // RN-01

export const signUpSchema = z.object({
  name,
  email,
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"), // RN-02
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Informe a senha"),
});

export const updateProfileSchema = z.object({ name });
