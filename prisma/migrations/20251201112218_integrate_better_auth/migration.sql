/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "initialContent" TEXT,
    "ownerId" TEXT NOT NULL,
    "roomId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_ownerId_idx" ON "document"("ownerId");

-- CreateIndex
CREATE INDEX "document_organizationId_idx" ON "document"("organizationId");
