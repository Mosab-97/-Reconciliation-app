/*
  Warnings:

  - You are about to drop the `bank_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ledger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `match_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bank_transactions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ledger";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "match_results";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Ledger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BankTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bankName" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ledgerId" INTEGER NOT NULL,
    "bankTransactionId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchResult_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchResult_bankTransactionId_fkey" FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_ledgerId_key" ON "MatchResult"("ledgerId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_bankTransactionId_key" ON "MatchResult"("bankTransactionId");
