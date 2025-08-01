import Papa from 'papaparse';

export function parseCSVBank(buffer: Buffer) {
  const csvString = buffer.toString('utf-8');
  console.log('Raw CSV content:', csvString);  // Debug raw CSV content

  const results = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (results.errors.length) {
    console.error('CSV parse errors:', results.errors);
    throw new Error('Invalid CSV format');
  }

  const requiredHeaders = ['Date', 'Amount', 'Description']; // Adjust as needed

  for (const header of requiredHeaders) {
    if (!results.meta.fields?.includes(header)) {
      console.error(`Missing required CSV header: ${header}`);
      throw new Error(`Missing required CSV header: ${header}`);
    }
  }

  console.log('Parsed rows:', results.data);
  return results.data;
}

