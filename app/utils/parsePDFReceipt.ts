export async function parsePDFReceipt(buffer: Buffer) {
  // Simulate PDF parsing
  return {
    vendor: 'Mock Vendor',
    amount: 99.99,
    date: new Date('2025-08-01'),
    description: 'Mock receipt description from PDF',
  };
}

