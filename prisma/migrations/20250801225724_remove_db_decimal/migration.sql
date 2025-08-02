/*
  Warnings:

  - You are about to drop the `BankTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LedgerEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MatchResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BankTransaction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LedgerEntry";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MatchResult";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vendor" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "bank_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'Bank Import',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "match_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ledger_id" TEXT,
    "bank_transaction_id" TEXT,
    "status" TEXT NOT NULL,
    "fuzzy_score" DECIMAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "match_results_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "ledger" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "match_results_bank_transaction_id_fkey" FOREIGN KEY ("bank_transaction_id") REFERENCES "bank_transactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
