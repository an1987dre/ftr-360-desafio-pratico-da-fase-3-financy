# 05 — Front-end

> **Layout de referência:** [Figma — Financy (Community)](https://www.figma.com/design/iWfw0Mlm3ejpDxpiYsKJ9S/Financy--Community-?node-id=3101-371).
>
> Esta spec define **estrutura e comportamento**. Valores visuais (cores, tipografia, espaçamentos, ícones, textos e variações de componentes) vêm do Figma, começando pela aba **Style Guide**. Em caso de divergência visual, o Figma prevalece; em comportamento, esta spec prevalece.

## Rotas

| Rota | Acesso | Página | Requisitos |
|---|---|---|---|
| `/` | pública/privada | **Login** se deslogado · **Dashboard** se logado | RF-F01, RF-F02 |
| `/signup` | pública (logado → `/`) | Cadastro | RF-F01 |
| `/transactions` | privada | Transações | RF-F04–F07 |
| `/categories` | privada | Categorias | RF-F08–F11 |
| `/profile` | privada | Perfil | RF-B13, RF-F14 |
| `/dev/ui` | só em desenvolvimento | Vitrine de componentes e tokens (fora do build) | T-32 |
| `*` | — | redireciona para `/` | — |

Total: 6 telas (Login, Cadastro, Dashboard, Transações, Categorias, Perfil) + 2 dialogs (Transação, Categoria).

Guarda de rota: `<PrivateRoute>` lê `AuthContext`; sem token → `<Navigate to="/" />`. Em `/`, `<HomeRoute>` decide entre `<SignInPage>` e `<AppLayout><DashboardPage/></AppLayout>`.

## Layout

- **Público (auth):** card centralizado com logo, formulário e link para alternar Login ↔ Cadastro.
- **Privado (`AppLayout`):** header com logo, navegação (Dashboard · Transações · Categorias) com item ativo destacado, e avatar com iniciais do usuário → `/profile`. Conteúdo com largura máxima e padding do Figma.

## Páginas

### Login (`/`, deslogado)
- Campos: e-mail e senha (olho fechado por padrão; mostra/oculta).
- **Lembrar-me:** marcado, o token vai para o `localStorage` e a sessão sobrevive ao fechar o navegador; desmarcado, vai para o `sessionStorage` e dura só a aba.
- **Recuperar senha:** só visual (fora do escopo da API); avisa que ainda não está disponível.
- Separador "ou" antes do link para o cadastro (o mesmo vale para o Cadastro → Login).
- Botão "Entrar" (loading durante a mutation). Link "Criar conta" → `/signup`.
- Sucesso: salva token + user, permanece em `/` (agora Dashboard). Erro: toast "E-mail ou senha inválidos".

### Cadastro (`/signup`)
- Campos: nome, e-mail, senha. Validação Zod idêntica ao back.
- Sucesso: `signUp` já retorna token → loga e vai para `/`.
- `CONFLICT` → erro no campo e-mail "E-mail já cadastrado".

### Dashboard (`/`, logado)
- **Cards de resumo** (`summary`): Saldo total · Receitas do mês · Despesas do mês.
- **Transações recentes** (`recentTransactions(limit: 5)`): lista com ícone/cor da categoria, descrição, data, badge da categoria e valor (verde `+` receita / vermelho `-` despesa). Link "Ver todas" → `/transactions`. Botão "Nova transação" abre o dialog.
- **Categorias** (`categories`): lista com badge, quantidade de itens e total. Link "Gerenciar" → `/categories`.

### Transações (`/transactions`)
- Cabeçalho: título, subtítulo, botão "Nova transação".
- **Filtros**: busca por descrição (debounce 300 ms), tipo (Todos/Entrada/Saída), categoria (Todas/…) e período (meses `YYYY-MM`). O **período começa no mês atual**, como no Figma, e tem a opção "Todos". Alterar um filtro volta para a página 1.
- Estado vazio: no mês padrão, "Nenhuma transação em <Mês / Ano>." com botão de criar; com filtros escolhidos pela pessoa, "Nenhuma transação encontrada para os filtros selecionados.".
- **Tabela**: Descrição (ícone da categoria + texto) · Data · Categoria (badge) · Tipo (Entrada/Saída com ícone) · Valor · Ações (editar ✎, excluir 🗑).
- **Paginação**: "1 a 10 | 27 resultados", botões anterior/próxima e números de página.
- Estado vazio: mensagem + CTA "Nova transação".
- Excluir: confirmação (ou ação direta, conforme o Figma) → `deleteTransaction` → toast + refetch.

### Categorias (`/categories`)
- Cabeçalho: título, subtítulo, botão "Nova categoria".
- **Cards de resumo**: Total de categorias · Total de transações · Categoria mais utilizada (maior `transactionsCount`).
- **Grid de cards**: ícone em quadrado com a cor da categoria, título, descrição, badge com o nome, contagem "N itens", ações editar/excluir.
- Excluir avisa que as transações ficarão sem categoria (RN-07).

### Perfil (`/profile`)
- Avatar com iniciais, nome e e-mail.
- Campo nome (editável → `updateProfile`), e-mail (desabilitado, "não pode ser alterado").
- Botões "Salvar alterações" e "Sair da conta" (limpa token, cache do Apollo e vai para `/`).

## Dialogs

### Dialog de Transação (criar/editar)
| Campo | Componente | Regra |
|---|---|---|
| Tipo | Toggle segmentado Despesa/Receita | obrigatório, padrão `EXPENSE` |
| Descrição | Input | 1–100 |
| Data | Input date | obrigatória, padrão hoje (divergência consciente: o Figma mostra "Selecione" vazio) |
| Valor | Prefixo `R$` + máscara `0,00` | > 0; convertido para centavos |
| Categoria | Select com ícone/cor; placeholder "Selecione" | opcional ("Sem categoria" limpa) |

Título "Nova transação" / "Editar transação"; botão "Salvar". Mesmo componente; modo edição pré-preenche via props.

### Dialog de Categoria (criar/editar)
| Campo | Componente | Regra |
|---|---|---|
| Título | Input | 1–100 |
| Descrição | Input/textarea | opcional, ≤ 255 |
| Ícone | Grade de botões com os ícones disponíveis | obrigatório; o primeiro vem pré-selecionado |
| Cor | Grade de swatches | obrigatória; a primeira vem pré-selecionada |

## Categorias: ícones e cores

Conjunto fechado, compartilhado entre back (validação, I-7) e front (render). Chaves armazenadas no banco; mapeamento para componente/classe no front.

- **Ícones** (Style Guide › Ícones, Lucide): `briefcase-business`, `car-front`, `heart-pulse`, `piggy-bank`, `shopping-cart`, `ticket`, `tool-case`, `utensils`, `paw-print`, `house`, `gift`, `dumbbell`, `book-open`, `baggage-claim`, `mailbox`, `receipt-text` (lucide).
- **Cores** (Style Guide › Colors): `green`, `blue`, `purple`, `pink`, `red`, `orange`, `yellow`, cada uma com os tons `dark`, `base` e `light`.

## Design system (Style Guide do Figma)

Começar pela aba **Style Guide** (recomendação do desafio). Tokens viram variáveis no `@theme` do Tailwind 4 em `src/styles/globals.css`.

Tokens extraídos do Style Guide (T-31), definidos em `frontend/src/styles/globals.css`. A paleta padrão do Tailwind é zerada (`--color-*: initial`), então só existem as cores abaixo:

| Grupo | Tokens |
|---|---|
| Fonte | Inter (Google Fonts) |
| Brand | `brand-dark` #124B2B · `brand-base` #1F6F43 |
| Grayscale | `gray-800` #111827 · `700` #374151 · `600` #4B5563 · `500` #6B7280 · `400` #9CA3AF · `300` #D1D5DB · `200` #E5E7EB · `100` #F8F9FA |
| Neutral | `black` #000000 · `white` #FFFFFF |
| Feedback | `danger` #EF4444 · `success` #19AD70 |
| Blue | `dark` #1D4ED8 · `base` #2563EB · `light` #DBEAFE |
| Purple | `dark` #7E22CE · `base` #9333EA · `light` #F3E8FF |
| Pink | `dark` #BE185D · `base` #DB2777 · `light` #FCE7F3 |
| Red | `dark` #B91C1C · `base` #DC2626 · `light` #FEE2E2 |
| Orange | `dark` #C2410C · `base` #EA580C · `light` #FFEDD5 |
| Yellow | `dark` #A16207 · `base` #CA8A04 · `light` #F7F3CA |
| Green | `dark` #15803D · `base` #16A34A · `light` #E0FAE9 |

**Regras de uso (Style Guide › Componentes):**

- **Input:** a borda é sempre `gray-300` (`gray-200` desabilitado). O estado aparece no label e no ícone: vazio `gray-400`; ativo (foco) com label e ícone `brand-base`; preenchido com ícone `gray-800`; erro com label e ícone `danger`.
- **Select:** visual igual ao do input; menu com sombra e item selecionado marcado com check `success`.
- **Botão:** primário `brand-base`, `brand-dark` no hover, opaco quando desabilitado. Secundário branco com borda `gray-300` e hover `gray-200`. Tamanhos Md e Sm.
- **Botão de ícone:** borda `gray-300`, hover `gray-200`; o de excluir tem ícone `danger`.
- **Link:** `brand-base`, sublinhado no hover.
- **Paginação:** borda `gray-300`, hover `gray-200`, ativo `brand-base`.
- **Tag:** pílula com fundo `<cor>-light` e texto `<cor>-dark`; sem categoria usa `gray-200` com `gray-700`.
- **Tipo:** Entrada em `green-dark` e Saída em `red-dark`, com `circle-arrow-up`/`down`.
- **Logo:** `src/assets/logo.svg`; só o símbolo (`logo-icon.svg`) no header mobile e no favicon.
- **Ícones de interface:** Lucide, incluindo `square-pen` (editar), `trash` (excluir) e `eye`/`eye-closed` (senha).

Componentes base (pasta `components/ui`): Button (variants: primary, outline, ghost, icon; sizes sm/md), Input (com ícone à esquerda, estado de erro, helper text), Label, Select, Dialog, Badge (por cor de categoria), Card, Avatar, Pagination, Toggle de tipo, Tag de tipo (Entrada/Saída). Variantes e estados conforme o Figma.

## Dados e cache (Apollo Client)

- `HttpLink(VITE_BACKEND_URL)` + `setContext` (Bearer token) + `onError` (`UNAUTHENTICATED` → `signOut()`).
- Após mutations: `refetchQueries` das queries afetadas (`Transactions`, `Categories`, `Dashboard`) e `awaitRefetchQueries: true` — simples e correto para o volume do desafio.
- Deleção: `cache.evict` do objeto + `cache.gc()`.
- Logout: `client.clearStore()` para não vazar dados entre contas (RF-F03).

## Formatação

- Moeda: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Datas: `dd/mm/aa` na tabela; armazenadas como meia-noite UTC e exibidas com `timeZone: 'UTC'` para não "voltar um dia".
- Input de valor: dígitos digitados formam centavos (`"1599"` → `R$ 15,99`).

## Estados transversais

Toda página com dados trata: **loading** (skeleton ou spinner), **erro** (mensagem + tentar novamente), **vazio** (texto + CTA). Botões de submit ficam desabilitados durante a mutation.
