import { Ledger, BankTransaction } from '@prisma/client';
import { isSameDay } from 'date-fns';

export interface MatchResult {
  ledgerId?: string;
  bankTransactionId?: string;
  status: 'MATCHED' | 'LEDGER_ONLY' | 'BANK_ONLY';
  fuzzyScore?: number;
}

export function performReconciliation(
  ledgerEntries: Ledger[],
  bankTransactions: BankTransaction[]
): MatchResult[] {
  const results: MatchResult[] = [];
  const matchedLedgerIds = new Set<string>();
  const matchedBankIds = new Set<string>();

  // Find matches
  for (const ledger of ledgerEntries) {
    let bestMatch: BankTransaction | null = null;
    let bestScore = 0;

    for (const bank of bankTransactions) {
      if (matchedBankIds.has(bank.id)) continue;

      const score = calculateMatchScore(ledger, bank);
      if (score > bestScore && score > 0.7) { // Threshold for match
        bestMatch = bank;
        bestScore = score;
      }
    }

    if (bestMatch) {
      results.push({
        ledgerId: ledger.id,
        bankTransactionId: bestMatch.id,
        status: 'MATCHED',
        fuzzyScore: bestScore
      });
      matchedLedgerIds.add(ledger.id);
      matchedBankIds.add(bestMatch.id);
    }
  }

  // Add unmatched ledger entries
  for (const ledger of ledgerEntries) {
    if (!matchedLedgerIds.has(ledger.id)) {
      results.push({
        ledgerId: ledger.id,
        status: 'LEDGER_ONLY'
      });
    }
  }

  // Add unmatched bank transactions
  for (const bank of bankTransactions) {
    if (!matchedBankIds.has(bank.id)) {
      results.push({
        bankTransactionId: bank.id,
        status: 'BANK_ONLY'
      });
    }
  }

  return results;
}

function calculateMatchScore(ledger: Ledger, bank: BankTransaction): number {
  let score = 0;

  // Amount match (exact or within $0.01)
  const amountDiff = Math.abs(ledger.amount - bank.amount);
  if (amountDiff <= 0.01) {
    score += 0.5;
  } else if (amountDiff <= 1.0) {
    score += 0.2;
  }

  // Date match (same day)
  if (isSameDay(ledger.date, bank.date)) {
    score += 0.3;
  }

  // Description fuzzy match
  const descriptionScore = calculateDescriptionSimilarity(
    ledger.description.toLowerCase(),
    bank.description.toLowerCase()
  );
  score += descriptionScore * 0.2;

  return Math.min(score, 1.0);
}

function calculateDescriptionSimilarity(str1: string, str2: string): number {
  // Simple fuzzy matching - can be enhanced
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matches = 0;
  for (const word1 of words1) {
    if (word1.length > 3) { // Only consider meaningful words
      for (const word2 of words2) {
        if (word2.includes(word1) || word1.includes(word2)) {
          matches++;
          break;
        }
      }
    }
  }

  return matches / Math.max(words1.length, words2.length);
}