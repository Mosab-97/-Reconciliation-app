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

    const ledgerEntries = await prisma.ledger.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert Decimal to number for JSON serialization
    const serializedEntries = ledgerEntries.map(entry => ({
      ...entry,
      amount: Number(entry.amount),
    }));

    return NextResponse.json(serializedEntries);
  } catch (error: any) {
    console.error('Error fetching ledger entries:', error);

    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Cannot connect to database. Please check your database configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch ledger entries' },
      { status: 500 }
    );
  }
}