# 00 — Visão geral

## Objetivo

O **Financy** é uma aplicação FullStack de gestão de finanças pessoais, desenvolvida como desafio final da Fase 3 da Pós-Graduação FTR-360 (Rocketseat). Cada pessoa usuária cria uma conta e organiza as **transações** (receitas e despesas) que registra, agrupando-as em **categorias**.

## Como este projeto é documentado (SDD)

Seguimos um *Spec-Driven Development* leve: as especificações abaixo são a fonte da verdade e vêm **antes** do código. Toda mudança de comportamento começa alterando a spec correspondente; o código segue a spec.

| Documento | Responde a |
|---|---|
| [01-requisitos](01-requisitos.md) | **O quê** o sistema precisa fazer (RF/RNF numerados) |
| [02-arquitetura](02-arquitetura.md) | **Com o quê** e **como** está organizado |
| [03-modelo-de-dados](03-modelo-de-dados.md) | Entidades, relacionamentos e invariantes |
| [04-contrato-graphql](04-contrato-graphql.md) | Contrato da API entre back-end e front-end |
| [05-frontend](05-frontend.md) | Páginas, dialogs, rotas, estados e design system |
| [06-plano](06-plano.md) | Ordem de implementação e critérios de aceite |
| [adr/](adr/) | Decisões arquiteturais e seus motivos |

## Escopo

- Cadastro e login de pessoas usuárias (JWT).
- CRUD de transações e de categorias, sempre restrito aos dados da pessoa autenticada.
- Front-end React (Vite) fiel ao layout do Figma, consumindo a API via GraphQL.

## Fora de escopo (entrega obrigatória)

Itens abaixo só entram em **branch separada**, após a entrega, conforme a regra do desafio:

- Upload de avatar.
- Recuperação de senha, login social, multi-moeda, recorrência de transações.
- Deploy em nuvem / CI-CD.

## Restrições de entrega

- Repositório **público** no GitHub.
- Duas subpastas na raiz: `backend/` e `frontend/`.
- Cada subpasta com seu `.env.example`.
- A branch `main` contém apenas o escopo obrigatório.

## Referências

- Layout: [Figma — Financy (Community)](https://www.figma.com/design/iWfw0Mlm3ejpDxpiYsKJ9S/Financy--Community-?node-id=3101-371)
- Projeto de referência das aulas: **MindShare** (módulos Back-end GraphQL e Front-end GraphQL).

## Glossário

| Termo | Definição |
|---|---|
| Transação | Movimentação financeira com descrição, valor, data, tipo e categoria opcional |
| Receita (`INCOME`) | Transação que soma ao saldo |
| Despesa (`EXPENSE`) | Transação que subtrai do saldo |
| Categoria | Agrupador de transações com título, descrição, ícone e cor |
| Saldo | Σ receitas − Σ despesas da pessoa usuária |
| Dono (*owner*) | Usuário que criou o registro; único autorizado a lê-lo/alterá-lo |
