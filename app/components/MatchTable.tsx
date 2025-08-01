'use client';

import { MatchResult, Ledger, BankTransaction } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';

interface MatchResultWithRelations extends MatchResult {
  ledger?: Ledger | null;
  bankTransaction?: BankTransaction | null;
}

interface MatchTableProps {
  matches: MatchResultWithRelations[];
}

export default function MatchTable({ matches }: MatchTableProps) {
  const matchedCount = matches.filter(m => m.status === 'MATCHED').length;
  const ledgerOnlyCount = matches.filter(m => m.status === 'LEDGER_ONLY').length;
  const bankOnlyCount = matches.filter(m => m.status === 'BANK_ONLY').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Reconciliation Results ({matches.length} total)
        </CardTitle>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{matchedCount} matched</span>
          <span>{ledgerOnlyCount} ledger only</span>
          <span>{bankOnlyCount} bank only</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Ledger Info</TableHead>
              <TableHead>Bank Info</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <StatusBadge status={match.status as 'MATCHED' | 'LEDGER_ONLY' | 'BANK_ONLY'} />
                </TableCell>
                <TableCell>
                  {match.ledger && format(new Date(match.ledger.date), 'MMM dd, yyyy')}
                  {match.bankTransaction && !match.ledger && format(new Date(match.bankTransaction.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {match.ledger && (
                    <div>
                      <div className="font-medium">{match.ledger.vendor}</div>
                      <div className="text-sm text-gray-500">{match.ledger.description}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {match.bankTransaction && (
                    <div>
                      <div className="text-sm">{match.bankTransaction.description}</div>
                      <div className="text-xs text-gray-500">{match.bankTransaction.source}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {match.ledger && `$${match.ledger.amount.toFixed(2)}`}
                  {match.bankTransaction && !match.ledger && `$${match.bankTransaction.amount.toFixed(2)}`}
                </TableCell>
                <TableCell>
                  {match.fuzzyScore && (
                    <span className="text-sm font-mono">
                      {(match.fuzzyScore * 100).toFixed(0)}%
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}