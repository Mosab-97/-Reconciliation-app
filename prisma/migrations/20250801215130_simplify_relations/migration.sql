-- DropIndex
DROP INDEX "MatchResult_bankTransactionId_key";

-- DropIndex
DROP INDEX "MatchResult_ledgerId_key";

-- AlterTable
ALTER TABLE "LedgerEntry" ADD COLUMN "vendor" TEXT;
