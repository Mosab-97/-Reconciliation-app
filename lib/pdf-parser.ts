import * as pdfParse from 'pdf-parse';

export interface ParsedReceipt {
  vendor: string;
  amount: number;
  date: Date;
  description: string;
}

export async function parsePDFReceipt(buffer: Buffer): Promise<ParsedReceipt> {
  try {
    if (buffer.length === 0) {
      throw new Error('Empty PDF file');
    }
    
    const data = await pdfParse(buffer);
    const text = data.text;
    
    if (!text || text.trim().length === 0) {
      throw new Error('No readable text found in PDF');
    }
    
    // Basic parsing logic - can be enhanced
    const vendor = extractVendor(text);
    const amount = extractAmount(text);
    const date = extractDate(text);
    const description = extractDescription(text);
    
    // Validate extracted data
    if (amount <= 0) {
      throw new Error('Could not extract valid amount from receipt');
    }
    
    return {
      vendor,
      amount,
      date,
      description
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractVendor(text: string): string {
  // Look for common vendor patterns
  const lines = text.split('\n').map(line => line.trim());
  
  // First non-empty line is often the vendor
  for (const line of lines) {
    if (line.length > 2 && line.length < 50 && !line.match(/^\d+[\.\,]\d+/)) {
      return line;
    }
  }
  
  return 'Unknown Vendor';
}

function extractAmount(text: string): number {
  // Look for currency patterns
  const amountRegex = /\$?(\d{1,6}\.?\d{0,2})/g;
  const matches = text.match(amountRegex);
  
  if (matches && matches.length > 0) {
    // Take the last amount found (usually the total)
    const lastAmount = matches[matches.length - 1];
    const amount = parseFloat(lastAmount.replace('$', ''));
    return isNaN(amount) ? 0 : amount;
  }
  
  return 0;
}

function extractDate(text: string): Date {
  // Look for date patterns
  const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g;
  const match = text.match(dateRegex);
  
  if (match && match[0]) {
    const parsedDate = new Date(match[0]);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  return new Date();
}

function extractDescription(text: string): string {
  // Clean up the text and return first meaningful line
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 5 && line.length < 100);
    
  return lines.slice(0, 3).join(' ') || 'Receipt transaction';
}