'use client';

import { useState } from 'react';
import UploadBox from '@/components/UploadBox';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function UploadReceiptPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedReceipt, setUploadedReceipt] = useState<any>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload receipt');
      }

      setUploadedReceipt(result.data);
      toast.success('Receipt uploaded and processed successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload receipt';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedReceipt(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Receipt
        </h1>
        <p className="text-lg text-gray-600">
          Upload a PDF receipt to automatically extract transaction details
        </p>
      </div>

      {!uploadedReceipt ? (
        <UploadBox
          accept=".pdf,application/pdf"
          onFileSelect={handleFileSelect}
          title="Upload PDF Receipt"
          description="Drag and drop your PDF receipt here, or click to browse"
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-900">Receipt Processed Successfully!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <p className="text-lg font-semibold">{uploadedReceipt.vendor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <p className="text-lg font-semibold font-mono">
                    ${uploadedReceipt.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-lg">
                    {new Date(uploadedReceipt.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-sm">{uploadedReceipt.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={handleReset} variant="outline">
              Upload Another Receipt
            </Button>
            <Button asChild>
              <Link href="/ledger">
                View Ledger
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Tips for Best Results
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Ensure the PDF is clear and readable</li>
          <li>• Make sure all text is properly formatted</li>
          <li>• Receipts with standard layouts work best</li>
          <li>• The system extracts vendor name, amount, date, and description</li>
        </ul>
      </div>
    </div>
  );
}