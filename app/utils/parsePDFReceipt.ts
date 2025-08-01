type ParsedReceipt = {
  vendor: string;
  amount: number;
  date: Date;
  description: string;
};

export async function parsePDFReceipt(buffer: Buffer): Promise<ParsedReceipt> {
  // Simulate parsing logic — replace with real PDF parsing later
  return {
    vendor: 'Test Vendor',
    amount: 123.45,
    date: new Date('2025-08-01'),
    description: 'Sample receipt description',
  };
}

