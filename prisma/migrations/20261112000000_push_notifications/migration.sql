CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "endpointHash" TEXT NOT NULL,
    "encrypted" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PushDelivery" (
    "manifestationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushDelivery_pkey" PRIMARY KEY ("manifestationId")
);

CREATE UNIQUE INDEX "PushSubscription_endpointHash_key" ON "PushSubscription"("endpointHash");
CREATE INDEX "PushSubscription_adminId_createdAt_idx" ON "PushSubscription"("adminId", "createdAt");
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PushDelivery" ADD CONSTRAINT "PushDelivery_manifestationId_fkey"
  FOREIGN KEY ("manifestationId") REFERENCES "Manifestation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
