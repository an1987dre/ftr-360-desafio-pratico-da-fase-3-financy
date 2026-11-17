import type { Request } from "express";
import { verifyToken } from "./lib/auth.js";
import { unauthenticated } from "./lib/errors.js";
import { prisma } from "./lib/prisma.js";

export interface Context {
  prisma: typeof prisma;
  /** `null` quando a requisição não tem token válido. */
  userId: string | null;
}

/** Nunca lança: token ausente/inválido resulta em `userId = null`. */
export async function buildContext({ req }: { req: Request }): Promise<Context> {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");
  const userId = scheme?.toLowerCase() === "bearer" && token ? verifyToken(token) : null;
  return { prisma, userId };
}

/** Garante autenticação e devolve o id do usuário (RN-03). */
export function requireUser(ctx: Context): string {
  if (!ctx.userId) throw unauthenticated();
  return ctx.userId;
}
