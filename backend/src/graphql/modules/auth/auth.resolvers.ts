import type { User } from "@prisma/client";
import { type Context, requireUser } from "../../../context.js";
import { hashPassword, signToken, verifyPassword } from "../../../lib/auth.js";
import { conflict, unauthenticated } from "../../../lib/errors.js";
import { parse } from "../../../lib/validation.js";
import { signInSchema, signUpSchema, updateProfileSchema } from "./auth.schema.js";

type InputArgs = { input: unknown };

function authPayload(user: User) {
  return { token: signToken(user.id), user };
}

async function currentUser(ctx: Context): Promise<User> {
  const userId = requireUser(ctx);
  const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw unauthenticated(); // token válido de usuário removido
  return user;
}

export const authResolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: Context) => currentUser(ctx),
  },
  Mutation: {
    signUp: async (_: unknown, { input }: InputArgs, ctx: Context) => {
      const data = parse(signUpSchema, input);
      const exists = await ctx.prisma.user.findUnique({ where: { email: data.email } });
      if (exists) throw conflict("E-mail já cadastrado");

      const user = await ctx.prisma.user.create({
        data: { ...data, password: await hashPassword(data.password) },
      });
      return authPayload(user);
    },

    signIn: async (_: unknown, { input }: InputArgs, ctx: Context) => {
      const data = parse(signInSchema, input);
      const user = await ctx.prisma.user.findUnique({ where: { email: data.email } });
      const valid = user ? await verifyPassword(data.password, user.password) : false;
      if (!user || !valid) throw unauthenticated("E-mail ou senha inválidos");
      return authPayload(user);
    },

    updateProfile: async (_: unknown, { input }: InputArgs, ctx: Context) => {
      const user = await currentUser(ctx);
      const data = parse(updateProfileSchema, input);
      return ctx.prisma.user.update({ where: { id: user.id }, data });
    },
  },
};
