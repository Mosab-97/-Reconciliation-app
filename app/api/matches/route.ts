import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 500 }
      );
    }

    const matches = await prisma.matchResult.findMany({
      include: {
        ledger: true,
        bankTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Convert Decimal to number for JSON serialization
    const serializedMatches = matches.map(match => ({
      ...match,
      fuzzyScore: match.fuzzyScore ? Number(match.fuzzyScore) : null,
      ledger: match.ledger ? {
        ...match.ledger,
        amount: Number(match.ledger.amount),
      } : null,
      bankTransaction: match.bankTransaction ? {
        ...match.bankTransaction,
        amount: Number(match.bankTransaction.amount),
      } : null,
    }));

    return NextResponse.json(serializedMatches);
  } catch (error: any) {
    console.error('Error fetching match results:', error);

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot connect to database. Please check your database configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch match results' },
      { status: 500 }
    );
  }
}