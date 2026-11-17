# ADR-0003 — Valores monetários em centavos (Int)

- **Status:** aceito
- **Data:** 2026-11-06

## Contexto
SQLite não tem tipo decimal nativo e `Float` gera erros de arredondamento (0,1 + 0,2).

## Decisão
`Transaction.amount` é `Int` em **centavos**, sempre positivo. O sinal vem de `type` (`INCOME`/`EXPENSE`). A API trafega centavos; o front converte na borda (input "R$ 12,34" → `1234`; exibição `1234` → "R$ 12,34").

## Consequências
- Somas exatas no back (`SUM(amount)`).
- Limite prático: ±21 milhões de reais por transação (Int 32 bits do GraphQL) — suficiente.
