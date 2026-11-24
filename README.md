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

## Notificações push (Web Push)

O painel administrativo inclui `/admin/notificacoes` para cadastrar mais de um aparelho, remover aparelhos e enviar um teste. O disparo de manifestação ocorre depois da gravação confirmada; a mensagem enviada é genérica e não inclui o relato. O WhatsApp continua no fluxo existente. Assinaturas ficam cifradas com AES-256-GCM no banco e endpoints inválidos (HTTP 404/410) são removidos.

1. Execute `npm run push:configure` uma vez no ambiente local. O comando cria `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` e `PUSH_ENCRYPTION_KEY` no `.env`, sem sobrescrever chaves já existentes. Troque o e-mail padrão em `VAPID_SUBJECT` por um contato real. Guarde as chaves privadas como segredos.
2. Em Vercel **Settings → Environment Variables**, cadastre essas mesmas quatro variáveis nos ambientes em que o app será executado. Use as chaves do ambiente que enviar push; não gere chaves VAPID ou `PUSH_ENCRYPTION_KEY` diferentes depois de cadastrar dispositivos. `VAPID_PUBLIC_KEY` é entregue ao navegador; `VAPID_PRIVATE_KEY` e `PUSH_ENCRYPTION_KEY` ficam exclusivamente no servidor.
3. Aplique a migration em produção com `npx prisma migrate deploy` apontando para o banco correto. Ela acrescenta tabelas de assinaturas e de controle de disparo sem apagar dados. O fluxo requer HTTPS em produção (localhost é aceito para desenvolvimento).
4. Entre como administrador no celular e abra **Notificações → Ativar notificações neste dispositivo**. Autorize a permissão e use **Testar notificação**. Repita em cada aparelho adicional.

### Instalar na tela inicial

- **Android:** abra o site em Chrome, use o menu do navegador e escolha **Instalar app** ou **Adicionar à tela inicial**. Abra o app instalado, entre no painel e ative as notificações.
- **iPhone/iPad (iOS/iPadOS 16.4+):** abra o site no Safari, toque em **Compartilhar → Adicionar à Tela de Início**, abra pelo novo ícone e entre no painel. Toque em **Ativar notificações neste dispositivo** e aceite. A permissão deve ser pedida pelo app aberto na tela inicial.

Web Push depende do suporte do navegador e das permissões do sistema. No iOS, o app deve permanecer instalado na tela inicial; remover a instalação ou revogar a permissão desativa a entrega.

## Backup e recuperação
O Neon mantém histórico para restauração pontual (janela depende do plano) e permite *branches*. Recomenda-se: confirmar a janela do plano contratado, criar branch antes de cada migration em produção e exportar periodicamente com `pg_dump "$DIRECT_URL" > backup.sql` guardado em local seguro. Isso depende de configuração externa à aplicação.

## Problemas comuns
- **`SESSION_SECRET ausente`**: defina com ≥32 caracteres.
- **Erro de conexão em migrations**: use a `DIRECT_URL` (sem `-pooler`).
- **"Não foi possível concluir o envio"**: verifique `DATABASE_URL`, migrations e seed (setores precisam existir).
- **Login sempre recusado**: confirme que o administrador foi criado e está ativo; após 5 tentativas aguarde 15 min.
