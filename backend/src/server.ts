import http from "node:http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";
import { unwrapResolverError } from "@apollo/server/errors";
import { buildContext, type Context } from "./context.js";
import { corsOrigin, env } from "./env.js";
import { resolvers, typeDefs } from "./graphql/index.js";
import { ErrorCode, PUBLIC_ERROR_CODES } from "./lib/errors.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const httpServer = http.createServer(app);

const apollo = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  includeStacktraceInErrorResponses: false,
  formatError: (formatted, error) => {
    const code = formatted.extensions?.code;
    if (typeof code === "string" && PUBLIC_ERROR_CODES.has(code)) return formatted;
    // Erro inesperado: detalhe só no log, mensagem genérica para o cliente.
    console.error(unwrapResolverError(error));
    return {
      message: "Erro interno do servidor",
      path: formatted.path,
      extensions: { code: ErrorCode.INTERNAL_SERVER_ERROR },
    };
  },
});

await apollo.start();

app.use(cors({ origin: corsOrigin })); // RNF-04

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/graphql", express.json(), expressMiddleware(apollo, { context: buildContext }));

await new Promise<void>((resolve) => httpServer.listen(env.PORT, resolve));
console.log(`🚀 API pronta em http://localhost:${env.PORT}/graphql`);

async function shutdown() {
  await apollo.stop();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
