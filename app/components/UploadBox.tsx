'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  accept: string;
  onFileSelect: (file: File) => void;
  title: string;
  description: string;
  isLoading?: boolean;
  error?: string;
}

export default function UploadBox({
  accept,
  onFileSelect,
  title,
  description,
  isLoading = false,
  error
}: UploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
            isLoading && 'opacity-50 cursor-not-allowed',
            error && 'border-red-300 bg-red-50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />

          {error ? (
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}

          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <Button 
            variant={error ? "destructive" : "default"} 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}