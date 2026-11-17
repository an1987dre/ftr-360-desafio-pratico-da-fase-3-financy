import { readFileSync } from "node:fs";
import { authResolvers } from "./modules/auth/auth.resolvers.js";
import { categoryResolvers } from "./modules/category/category.resolvers.js";
import { summaryResolvers } from "./modules/summary/summary.resolvers.js";
import { transactionResolvers } from "./modules/transaction/transaction.resolvers.js";
import { DateTime } from "./scalars.js";

export const typeDefs = readFileSync(new URL("./schema.graphql", import.meta.url), "utf8");

export const resolvers = {
  DateTime,
  Query: {
    ...authResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
    ...summaryResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  Category: categoryResolvers.Category,
};
