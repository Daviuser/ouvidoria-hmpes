# Ouvidoria — Hospital Municipal de Santaluz

Sistema web de Ouvidoria: área pública (manifestações e avaliação de setores) e painel administrativo protegido em `/admin`.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind CSS · PostgreSQL (Neon) · Prisma · Zod · React Hook Form · Recharts · Lucide · Vitest · Playwright.

> Estado: código escrito e revisado, **ainda não instalado, compilado nem testado** no ambiente em que foi gerado (sem acesso à rede). Veja `docs/testing.md`.

## Requisitos
- Node.js 20.11+ (recomendado 22 LTS) e npm 10+
- Conta no [Neon](https://neon.tech) (PostgreSQL)

## Instalação
```bash
npm install          # gera também o package-lock.json e o Prisma Client
cp .env.example .env # preencha com seus valores reais
```

## Neon e variáveis de ambiente
1. No painel do Neon, crie um projeto (região mais próxima, ex.: São Paulo) e abra **Connect**.
2. Copie a string **com pooler** (host contém `-pooler`) para `DATABASE_URL`.
3. Desative "Connection pooling" no mesmo diálogo e copie a string **direta** para `DIRECT_URL` (usada nas migrations).
4. Gere `SESSION_SECRET`: `openssl rand -base64 48`.
5. Ajuste `ALLOW_ANONYMOUS` e `ALLOW_RATING_COMMENTS` conforme a decisão da direção.

## Banco de dados
```bash
npx prisma migrate deploy   # aplica a migration inicial (cria tabelas; não destrutivo em banco vazio)
npm run db:seed             # sincroniza setores (idempotente)
```
Para evoluir o schema em desenvolvimento: `npm run db:migrate:dev -- --name descricao`. Em produção use sempre `migrate deploy`. Nunca rode `migrate reset` em banco com dados reais.

## Primeiro administrador
Não existe usuário padrão nem senha fixa. Crie pelo servidor/terminal:
```bash
ADMIN_EMAIL="direcao@exemplo.gov.br" ADMIN_NAME="Nome" ADMIN_PASSWORD="senha-forte-12+" npm run admin:create
```
Execute o comando e não guarde a senha no histórico/arquivos. Rodar novamente com o mesmo e-mail redefine a senha.

## Execução, testes e build
```bash
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck
npm test             # testes unitários (não exigem banco)
npm run test:e2e     # exige banco com migrations/seed; defina E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD para o teste de login
npm run build
```

## Publicação na Vercel
1. Envie o projeto ao Git e importe na Vercel.
2. Em **Settings → Environment Variables**, cadastre `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`, `ALLOW_ANONYMOUS`, `ALLOW_RATING_COMMENTS`.
3. Aplique migrations de forma controlada **fora do build**, do seu computador: `npx prisma migrate deploy` apontando para o banco de produção.
4. Faça o deploy e crie o administrador com `npm run admin:create` (localmente, com `DATABASE_URL`/`DIRECT_URL` de produção).

## Backup e recuperação
O Neon mantém histórico para restauração pontual (janela depende do plano) e permite *branches*. Recomenda-se: confirmar a janela do plano contratado, criar branch antes de cada migration em produção e exportar periodicamente com `pg_dump "$DIRECT_URL" > backup.sql` guardado em local seguro. Isso depende de configuração externa à aplicação.

## Problemas comuns
- **`SESSION_SECRET ausente`**: defina com ≥32 caracteres.
- **Erro de conexão em migrations**: use a `DIRECT_URL` (sem `-pooler`).
- **"Não foi possível concluir o envio"**: verifique `DATABASE_URL`, migrations e seed (setores precisam existir).
- **Login sempre recusado**: confirme que o administrador foi criado e está ativo; após 5 tentativas aguarde 15 min.
