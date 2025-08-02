import * as pdfParse from 'pdf-parse';

export interface ParsedReceipt {
  vendor: string;
  amount: number;
  date: Date;
  description: string;
}

export async function parsePDFReceipt(buffer: Buffer): Promise<ParsedReceipt> {
  if (buffer.length === 0) throw new Error('Empty PDF file');

  const data = await pdfParse.default(buffer);
  const text = data.text;
  if (!text || !text.trim()) throw new Error('No readable text found in PDF');

  const vendor = extractVendor(text);
  const amount = extractAmount(text);
  const date = extractDate(text);
  const description = extractDescription(text);

  if (amount <= 0) throw new Error('Invalid amount extracted from receipt');

  return { vendor, amount, date, description };
}

function extractVendor(text: string): string {
  const lines = text.split('\n').map(line => line.trim());
  for (const line of lines) {
    if (line.length > 2 && line.length < 50 && !line.match(/^\d+[\.\,]\d+/)) {
      return line;
    }
  }
  return 'Unknown Vendor';
}

function extractAmount(text: string): number {
  const amountRegex = /\$?(\d{1,6}\.?\d{0,2})/g;
  const matches = text.match(amountRegex);
  if (matches && matches.length > 0) {
    const lastAmount = matches[matches.length - 1];
    const amount = parseFloat(lastAmount.replace('$', ''));
    return isNaN(amount) ? 0 : amount;
  }
  return 0;
}

function extractDate(text: string): Date {
  const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/g;
  const match = text.match(dateRegex);
  if (match && match[0]) {
    const d = new Date(match[0]);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

function extractDescription(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5 && l.length < 100);
  return lines.slice(0, 3).join(' ') || 'Receipt transaction';
}

