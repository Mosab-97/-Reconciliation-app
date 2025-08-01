'use client';

import { useState, useEffect } from 'react';
import MatchTable from '@/components/MatchTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, RefreshCw, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function ComparePage() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasData, setHasData] = useState(false);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/matches');
      if (!response.ok) {
        throw new Error('Failed to fetch match results');
      }
      const data = await response.json();
      setMatches(data);
      setHasData(data.length > 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load match results');
    } finally {
      setIsLoading(false);
    }
  };

  const runReconciliation = async () => {
    try {
      setIsRunning(true);
      const response = await fetch('/api/compare', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run reconciliation');
      }

      toast.success(result.message);
      await fetchMatches();
    } catch (error: any) {
      toast.error(error.message || 'Failed to run reconciliation');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getStats = () => {
    const matched = matches.filter((m: any) => m.status === 'MATCHED').length;
    const ledgerOnly = matches.filter((m: any) => m.status === 'LEDGER_ONLY').length;
    const bankOnly = matches.filter((m: any) => m.status === 'BANK_ONLY').length;
    
    return { matched, ledgerOnly, bankOnly, total: matches.length };
  };

  const stats = getStats();

  if (isLoading && !hasData) {
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
            Transaction Reconciliation
          </h1>
          <p className="text-gray-600">
            Compare receipts with bank transactions to find matches
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchMatches}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={runReconciliation}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Reconciliation
              </>
            )}
          </Button>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {stats.matched}
              </CardTitle>
              <CardDescription>Matched Transactions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-yellow-600">
                {stats.ledgerOnly}
              </CardTitle>
              <CardDescription>Ledger Only</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-red-600">
                {stats.bankOnly}
              </CardTitle>
              <CardDescription>Bank Only</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-blue-600">
                {stats.total}
              </CardTitle>
              <CardDescription>Total Items</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {matches.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>No Reconciliation Results</CardTitle>
            <CardDescription>
              Run reconciliation to compare your receipts with bank transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={runReconciliation} disabled={isRunning}>
              {isRunning ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  Running Reconciliation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run First Reconciliation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <MatchTable matches={matches} />
      )}
    </div>
  );
}