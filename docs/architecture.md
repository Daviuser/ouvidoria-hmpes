# Arquitetura
- **Next.js App Router**: páginas em `src/app`; mutações via Server Actions (`src/app/actions`). Não há rotas públicas de leitura de dados.
- **Camadas**: `components` (UI) → `app/actions` (validação + autorização + rate limit) → `server/services` (regras) → `server/repositories`/Prisma.
- **Setores**: fonte única em `src/config/sectors.ts`; o seed grava `Sector` com códigos estáveis.
- **Autenticação**: e-mail/senha (bcrypt, custo 12); sessão em JWT HS256 (jose) em cookie `httpOnly`, `sameSite=lax`, `secure` em produção, 8 h. Cada requisição administrativa revalida o usuário no banco (`requireAdmin`). `middleware.ts` é só barreira de conveniência.
- **CSRF**: Server Actions do Next.js verificam `Origin`/`Host`; cookie `sameSite=lax`.
- **Rate limiting**: janela fixa atômica na tabela `RateLimit` (serverless-safe); IP armazenado apenas como hash.
- **Privacidade**: manifestações anônimas descartam nome/e-mail/telefone no servidor; observações internas só são lidas por páginas protegidas.
- **Auditoria**: `ManifestationHistory` (situação) e `AuditLog` (login, mudança de situação, observação).
