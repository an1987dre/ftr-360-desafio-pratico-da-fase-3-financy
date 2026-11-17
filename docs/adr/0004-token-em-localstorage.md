# ADR-0004 — Token JWT em localStorage

- **Status:** aceito
- **Data:** 2026-11-06

## Contexto
Alternativa mais segura é cookie `httpOnly`, mas exige configuração de CORS com credenciais, `sameSite` e CSRF — complexidade fora do escopo avaliado e diferente do projeto de referência (MindShare).

## Decisão
Token retornado por `signIn`/`signUp`, salvo em `localStorage` e enviado em `Authorization: Bearer`. Expiração de 7 dias.

## Consequências
- Simples e compatível com Apollo Client (`setContext`).
- Exposto a XSS; mitigado por React escapar conteúdo e não usar `dangerouslySetInnerHTML`. Revisitar se houver deploy público.
