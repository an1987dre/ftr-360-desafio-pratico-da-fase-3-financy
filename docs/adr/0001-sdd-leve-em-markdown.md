# ADR-0001 — SDD leve em Markdown

- **Status:** aceito
- **Data:** 2026-11-06

## Contexto
O desafio tem requisitos fechados (checklist de 24 itens) e layout definido no Figma. Queremos rastreabilidade entre requisito → tarefa → código sem ferramentas que acoplem o repositório a convenções externas (o repositório é público e avaliado por terceiros).

## Decisão
Specs em `docs/` (Markdown + Mermaid), numeradas por ordem de leitura, com IDs estáveis (RF/RN/RNF/T). Nenhum kit/CLI de SDD.

## Consequências
- Avaliadores leem tudo no GitHub sem instalar nada.
- Disciplina manual: mudança de comportamento ⇒ atualizar a spec no mesmo PR.
