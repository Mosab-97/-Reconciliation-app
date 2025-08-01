import Papa from 'papaparse';

export interface ParsedBankTransaction {
  amount: number;
  date: Date;
  description: string;
  source: string;
}

export function parseCSVBank(csvText: string): ParsedBankTransaction[] {
  if (!csvText || csvText.trim().length === 0) {
    throw new Error('Empty CSV file');
  }
  
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  if (results.errors && results.errors.length > 0) {
    console.warn('CSV parsing warnings:', results.errors);
  }

  const transactions: ParsedBankTransaction[] = [];

  for (const row of results.data as any[]) {
    try {
      // Flexible column mapping - adjust based on common CSV formats
      const amount = parseAmount(
        row.amount || row.Amount || row.AMOUNT || 
        row.debit || row.Debit || row.DEBIT ||
        row.credit || row.Credit || row.CREDIT || '0'
      );
      const date = parseDate(
        row.date || row.Date || row.DATE || 
        row.transaction_date || row['Transaction Date'] || ''
      );
      const description = 
        row.description || row.Description || row.DESCRIPTION ||
        row.memo || row.Memo || row.MEMO ||
        row.details || row.Details || row.DETAILS || '';
      const source = 
        row.source || row.Source || row.SOURCE ||
        row.bank || row.Bank || row.BANK || 'Bank Import';

      if (amount > 0 && date && description.trim().length > 0) {
        transactions.push({
          amount,
          date,
          description: description.trim(),
          source
        });
      }
    } catch (error) {
      console.warn('Skipping invalid row:', row);
    }
  }

  if (transactions.length === 0) {
    throw new Error('No valid transactions found in CSV. Please check the format.');
  }

  return transactions;
}

function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  
  // Remove currency symbols and commas
  const cleaned = amountStr.toString().replace(/[$,\s]/g, '');
  const amount = parseFloat(cleaned);
  
  return isNaN(amount) ? 0 : Math.abs(amount); // Use absolute value
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try different date formats
  const formats = [
    dateStr,
    dateStr.replace(/\//g, '-'),
    dateStr.replace(/\./g, '-'),
  ];
  
  for (const format of formats) {
    const date = new Date(format);
    if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
      return date;
    }
  }
  
  return null;
}