# 01 — Requisitos

Cada requisito tem um ID estável, referenciado no [plano](06-plano.md) e nos commits/PRs. A coluna **Checklist** liga o requisito ao item correspondente na plataforma da Rocketseat (24 itens: 11 back-end, 13 front-end).

## Requisitos funcionais — Back-end

| ID | Requisito | Checklist |
|---|---|---|
| RF-B01 | O usuário pode criar uma conta (nome, e-mail, senha) | BE-1 |
| RF-B02 | O usuário pode fazer login com e-mail e senha e recebe um token JWT | BE-1 |
| RF-B03 | O usuário só vê e gerencia as transações e categorias que criou | BE-2 |
| RF-B04 | Criar transação | BE-3 |
| RF-B05 | Deletar transação | BE-4 |
| RF-B06 | Editar transação | BE-5 |
| RF-B07 | Listar todas as transações | BE-6 |
| RF-B08 | Criar categoria | BE-7 |
| RF-B09 | Deletar categoria | BE-8 |
| RF-B10 | Editar categoria | BE-9 |
| RF-B11 | Listar todas as categorias | BE-10 |
| RF-B12 | Consultar dados do usuário autenticado (`me`) | suporte |
| RF-B13 | Atualizar o nome do usuário (tela de Perfil) | suporte (a confirmar no Figma) |
| RF-B14 | Resumo financeiro: saldo total, receitas e despesas do mês | suporte ao Dashboard |
| RF-B15 | Por categoria: quantidade de transações e valor total | suporte a Dashboard/Categorias |

## Requisitos funcionais — Front-end

| ID | Requisito | Checklist |
|---|---|---|
| RF-F01 | Telas de cadastro e de login | FE-1 |
| RF-F02 | `/` mostra Login se deslogado e Dashboard se logado | FE-1 |
| RF-F03 | Apenas dados do usuário logado são exibidos; rotas privadas exigem sessão | FE-2 |
| RF-F04 | Criar transação via dialog | FE-3 |
| RF-F05 | Deletar transação | FE-4 |
| RF-F06 | Editar transação via dialog (mesmo formulário do RF-F04) | FE-5 |
| RF-F07 | Listar todas as transações | FE-6 |
| RF-F08 | Criar categoria via dialog | FE-7 |
| RF-F09 | Deletar categoria | FE-8 |
| RF-F10 | Editar categoria via dialog (mesmo formulário do RF-F08) | FE-9 |
| RF-F11 | Listar todas as categorias | FE-10 |
| RF-F12 | Aplicação React + Vite usando GraphQL para consultar a API | FE-11 |
| RF-F13 | Layout o mais fiel possível ao Figma | FE-12 |
| RF-F14 | Logout | suporte |

## Regras de negócio

| ID | Regra |
|---|---|
| RN-01 | E-mail é único (case-insensitive: armazenado em minúsculas) |
| RN-02 | Senha com no mínimo 8 caracteres, armazenada apenas como hash bcrypt |
| RN-03 | Toda operação de transação/categoria exige autenticação |
| RN-04 | Consultas filtram sempre por `userId` do token; acesso a ID de outro usuário retorna `NOT_FOUND` (não revela existência) |
| RN-05 | Uma transação só pode ser associada a uma categoria do **mesmo** usuário |
| RN-06 | Valor da transação é positivo, em centavos; o sinal vem do `type` ([ADR-0003](adr/0003-valores-em-centavos.md)) |
| RN-07 | Ao deletar uma categoria, as transações dela permanecem, ficando sem categoria |
| RN-08 | Descrição da transação e título da categoria são obrigatórios (1–100 caracteres após *trim*) |
| RN-09 | A listagem de transações é ordenada por data decrescente |
| RN-10 | O token JWT expira em 7 dias; token inválido/expirado → `UNAUTHENTICATED` e o front volta ao login |

## Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | TypeScript em back-end e front-end |
| RNF-02 | API GraphQL |
| RNF-03 | Prisma ORM com SQLite |
| RNF-04 | CORS habilitado na API |
| RNF-05 | `.env.example` no back-end com `JWT_SECRET` e `DATABASE_URL` (+ adicionais) |
| RNF-06 | `.env.example` no front-end com `VITE_BACKEND_URL` |
| RNF-07 | Front-end com React e Vite, sem framework (sem Next/Remix) |
| RNF-08 | Projeto executável localmente seguindo apenas o README |
| RNF-09 | Validação de entrada no servidor (Zod) — nunca confiar só no front |
| RNF-10 | Mensagens de erro e textos da interface em pt-BR; valores em BRL (`R$ 1.234,56`) e datas `dd/mm/aaaa` |
