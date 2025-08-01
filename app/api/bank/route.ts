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

    const bankTransactions = await prisma.bankTransaction.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert Decimal to number for JSON serialization
    const serializedTransactions = bankTransactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
    }));

    return NextResponse.json(serializedTransactions);
  } catch (error: any) {
    console.error('Error fetching bank transactions:', error);

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot connect to database. Please check your database configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch bank transactions' },
      { status: 500 }
    );
  }
}