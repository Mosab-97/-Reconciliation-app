import { NextResponse } from 'next/server';

const dummyTransactions = [
  {
    id: 'dummy1',
    amount: 100,
    date: new Date().toISOString(),
    description: 'Dummy transaction',
    source: 'Dummy source',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dummy2',
    amount: 200,
    date: new Date().toISOString(),
    description: 'Dummy transaction 2',
    source: 'Dummy source',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  // During build, env var NEXT_PHASE will be 'phase-production-build'
  // Return dummy data instead of DB to prevent build failure
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json(dummyTransactions);
  }

  // Otherwise, you can keep real DB code if you want to deploy now
  // Or just return dummy data for now to be safe
  return NextResponse.json(dummyTransactions);
}

