'use client';

import { useState, useEffect } from 'react';
import LedgerTable from '@/components/LedgerTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function LedgerPage() {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLedgerEntries = async () => {
    try {
      const response = await fetch('/api/ledger');
      if (!response.ok) {
        throw new Error('Failed to fetch ledger entries');
      }
      const data = await response.json();
      setLedgerEntries(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load ledger entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerEntries();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchLedgerEntries();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Receipt Ledger
          </h1>
          <p className="text-gray-600">
            All your uploaded and processed receipts
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/upload-receipt">
              <Plus className="h-4 w-4 mr-2" />
              Add Receipt
            </Link>
          </Button>
        </div>
      </div>

      {ledgerEntries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <Plus className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No receipts yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first PDF receipt to get started with reconciliation
          </p>
          <Button asChild>
            <Link href="/upload-receipt">
              Upload First Receipt
            </Link>
          </Button>
        </div>
      ) : (
        <LedgerTable entries={ledgerEntries} />
      )}
    </div>
  );
}
