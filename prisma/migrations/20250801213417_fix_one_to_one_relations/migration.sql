/*
  Warnings:

  - You are about to drop the `Ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `source` on the `BankTransaction` table. All the data in the column will be lost.
  - Added the required column `status` to the `MatchResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Ledger";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BankTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "bankName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BankTransaction" ("amount", "bankName", "createdAt", "date", "description", "id") SELECT "amount", "bankName", "createdAt", "date", "description", "id" FROM "BankTransaction";
DROP TABLE "BankTransaction";
ALTER TABLE "new_BankTransaction" RENAME TO "BankTransaction";
CREATE INDEX "BankTransaction_date_idx" ON "BankTransaction"("date");
CREATE TABLE "new_MatchResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ledgerId" INTEGER,
    "bankTransactionId" INTEGER,
    "status" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "fuzzyScore" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchResult_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "LedgerEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MatchResult_bankTransactionId_fkey" FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MatchResult" ("bankTransactionId", "createdAt", "id", "ledgerId", "score") SELECT "bankTransactionId", "createdAt", "id", "ledgerId", "score" FROM "MatchResult";
DROP TABLE "MatchResult";
ALTER TABLE "new_MatchResult" RENAME TO "MatchResult";
CREATE UNIQUE INDEX "MatchResult_ledgerId_key" ON "MatchResult"("ledgerId");
CREATE UNIQUE INDEX "MatchResult_bankTransactionId_key" ON "MatchResult"("bankTransactionId");
CREATE INDEX "MatchResult_status_idx" ON "MatchResult"("status");
CREATE INDEX "MatchResult_createdAt_idx" ON "MatchResult"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LedgerEntry_date_idx" ON "LedgerEntry"("date");
