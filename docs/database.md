# Banco de dados
Entidades: `Sector`, `Manifestation`, `Rating`, `AdminUser`, `ManifestationHistory`, `InternalNote`, `RateLimit`, `AuditLog`.
- `Manifestation.protocol` único (`OUV-AAAA-XXXXXXXX`); índices em `createdAt`, `sectorId`, `status`, `type`.
- `Rating`: uma linha por setor avaliado; `submissionId` agrupa um envio; CHECK `score BETWEEN 1 AND 5`; índice `(sectorId, createdAt)`.
- Datas em UTC no banco; exibição e filtros em `America/Bahia`.
- Não há exclusão de manifestações; FKs usam `RESTRICT`.
- Migration inicial escrita manualmente em `prisma/migrations/20261028000000_init`; **valide-a com `npx prisma migrate diff` / `migrate dev` na primeira execução**.
