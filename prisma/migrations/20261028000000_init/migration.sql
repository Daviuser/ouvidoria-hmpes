-- CreateEnum
CREATE TYPE "ManifestationType" AS ENUM ('COMPLAINT', 'SUGGESTION', 'PRAISE');
CREATE TYPE "ManifestationStatus" AS ENUM ('RECEIVED', 'IN_REVIEW', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Sector" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rateable" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL,
    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Manifestation" (
    "id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "type" "ManifestationType" NOT NULL,
    "status" "ManifestationStatus" NOT NULL DEFAULT 'RECEIVED',
    "sectorId" INTEGER NOT NULL,
    "otherSector" TEXT,
    "description" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Manifestation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "sectorId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Rating_score_range" CHECK ("score" BETWEEN 1 AND 5)
);

CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ManifestationHistory" (
    "id" TEXT NOT NULL,
    "manifestationId" TEXT NOT NULL,
    "adminId" TEXT,
    "fromStatus" "ManifestationStatus",
    "toStatus" "ManifestationStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ManifestationHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InternalNote" (
    "id" TEXT NOT NULL,
    "manifestationId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_code_key" ON "Sector"("code");
CREATE UNIQUE INDEX "Manifestation_protocol_key" ON "Manifestation"("protocol");
CREATE INDEX "Manifestation_createdAt_idx" ON "Manifestation"("createdAt");
CREATE INDEX "Manifestation_sectorId_idx" ON "Manifestation"("sectorId");
CREATE INDEX "Manifestation_status_idx" ON "Manifestation"("status");
CREATE INDEX "Manifestation_type_idx" ON "Manifestation"("type");
CREATE INDEX "Rating_sectorId_createdAt_idx" ON "Rating"("sectorId", "createdAt");
CREATE INDEX "Rating_submissionId_idx" ON "Rating"("submissionId");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "ManifestationHistory_manifestationId_createdAt_idx" ON "ManifestationHistory"("manifestationId", "createdAt");
CREATE INDEX "InternalNote_manifestationId_createdAt_idx" ON "InternalNote"("manifestationId", "createdAt");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Manifestation" ADD CONSTRAINT "Manifestation_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ManifestationHistory" ADD CONSTRAINT "ManifestationHistory_manifestationId_fkey" FOREIGN KEY ("manifestationId") REFERENCES "Manifestation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ManifestationHistory" ADD CONSTRAINT "ManifestationHistory_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_manifestationId_fkey" FOREIGN KEY ("manifestationId") REFERENCES "Manifestation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
