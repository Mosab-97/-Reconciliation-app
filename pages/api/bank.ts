import { NextApiRequest, NextApiResponse } from 'next';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const bankTransactions = await prisma.bankTransaction.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const serializedTransactions = bankTransactions.map(transaction => ({
      ...transaction,
      amount: Number(transaction.amount),
    }));

    res.status(200).json(serializedTransactions);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bank transactions' });
  }
}

