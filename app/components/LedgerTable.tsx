'use client';

import { Ledger } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface LedgerTableProps {
  entries: Ledger[];
}

export default function LedgerTable({ entries }: LedgerTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ledger Entries ({entries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="font-medium">{entry.vendor}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right font-mono">
                  ${entry.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}