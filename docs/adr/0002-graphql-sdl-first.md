# ADR-0002 — GraphQL SDL-first com Apollo Server

- **Status:** aceito
- **Data:** 2026-11-06

## Contexto
Opções: TypeGraphQL (code-first com decorators), Pothos (code-first), ou SDL-first. TypeGraphQL depende de `emitDecoratorMetadata`, que `tsx`/esbuild não suportam, exigindo tipos explícitos em todo decorator ou outro runner.

## Decisão
Schema escrito em `schema.graphql` (SDL) e resolvers tipados à mão, servidos pelo Apollo Server 4 + Express.

## Consequências
- O arquivo `.graphql` **é** o contrato documentado em [04-contrato-graphql](../04-contrato-graphql.md) — fácil de revisar.
- Tipos dos resolvers mantidos manualmente (opcional futuro: `graphql-codegen`).
