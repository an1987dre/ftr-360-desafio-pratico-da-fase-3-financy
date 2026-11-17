import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter pelo menos 16 caracteres"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("Copie backend/.env.example para backend/.env e preencha os valores.");
  process.exit(1);
}

export const env = parsed.data;

/** `true` libera qualquer origem; caso contrário, lista de origens permitidas. */
export const corsOrigin: true | string[] =
  env.CORS_ORIGIN.trim() === "*"
    ? true
    : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);
