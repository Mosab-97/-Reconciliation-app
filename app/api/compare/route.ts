import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';
import { performReconciliation } from '@/lib/reconciliation';

export async function POST() {
  try {
    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 500 }
      );
    }

    // Fetch all ledger entries and bank transactions
    const [ledgerEntries, bankTransactions] = await Promise.all([
      prisma.ledger.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bankTransaction.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (ledgerEntries.length === 0 && bankTransactions.length === 0) {
      return NextResponse.json(
        { error: 'No data to reconcile. Please upload receipts and bank transactions first.' },
        { status: 400 }
      );
    }

    // Convert Decimal to number for reconciliation algorithm
    const ledgerForMatching = ledgerEntries.map(entry => ({
      ...entry,
      amount: Number(entry.amount),
    }));

    const bankForMatching = bankTransactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
    }));

    // Perform reconciliation
    const matchResults = performReconciliation(ledgerForMatching, bankForMatching);

    // Clear existing match results and save new ones
    await prisma.$transaction(async (tx) => {
      // Delete existing match results
      await tx.matchResult.deleteMany();

      // Create new match results
      if (matchResults.length > 0) {
        await tx.matchResult.createMany({
          data: matchResults.map(result => ({
            ledgerId: result.ledgerId || null,
            bankTransactionId: result.bankTransactionId || null,
            status: result.status,
            fuzzyScore: result.fuzzyScore || null,
          })),
        });
      }
    });

    const stats = {
      matched: matchResults.filter(r => r.status === 'MATCHED').length,
      ledgerOnly: matchResults.filter(r => r.status === 'LEDGER_ONLY').length,
      bankOnly: matchResults.filter(r => r.status === 'BANK_ONLY').length,
      total: matchResults.length,
    };

    return NextResponse.json({
      success: true,
      message: `Reconciliation completed: ${stats.matched} matched, ${stats.ledgerOnly} ledger-only, ${stats.bankOnly} bank-only`,
      stats,
    });
  } catch (error: any) {
    console.error('Error running reconciliation:', error);

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot connect to database. Please check your database configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to run reconciliation' },
      { status: 500 }
    );
  }
}

