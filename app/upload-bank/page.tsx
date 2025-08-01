'use client';

import { useState } from 'react';
import UploadBox from '@/components/UploadBox';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function UploadBankPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-bank', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload bank CSV');
      }

      setUploadResult(result);
      toast.success(`Successfully imported ${result.count} transactions!`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload bank CSV';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Bank Statement
        </h1>
        <p className="text-lg text-gray-600">
          Import your bank transactions from a CSV file
        </p>
      </div>

      {!uploadResult ? (
        <UploadBox
          accept=".csv,text/csv"
          onFileSelect={handleFileSelect}
          title="Upload Bank CSV"
          description="Drag and drop your bank statement CSV here, or click to browse"
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-900">Bank Statement Imported Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg mb-4">
                Imported <span className="font-bold text-green-700">{uploadResult.count}</span> bank transactions
              </p>
              <p className="text-gray-600">{uploadResult.message}</p>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={handleReset} variant="outline">
              Upload Another File
            </Button>
            <Button asChild>
              <Link href="/compare">
                Run Reconciliation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          CSV Format Requirements
        </h3>
        <div className="text-blue-800 space-y-2">
          <p>Your CSV should include these columns (column names are flexible):</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Date:</strong> Transaction date (various formats supported)</li>
            <li><strong>Amount:</strong> Transaction amount (positive numbers)</li>
            <li><strong>Description:</strong> Transaction description</li>
            <li><strong>Source:</strong> Bank or account name (optional)</li>
          </ul>
          <p className="mt-3 text-sm">
            Example headers: Date, Amount, Description, Source
          </p>
        </div>
      </div>
    </div>
  );
}