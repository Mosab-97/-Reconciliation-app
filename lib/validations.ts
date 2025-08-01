import { z } from 'zod';

export const uploadReceiptSchema = z.object({
  vendor: z.string().min(1, 'Vendor is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  description: z.string().min(1, 'Description is required'),
});

export const uploadBankSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  description: z.string().min(1, 'Description is required'),
  source: z.string().min(1, 'Source is required'),
});

export type UploadReceiptInput = z.infer<typeof uploadReceiptSchema>;
export type UploadBankInput = z.infer<typeof uploadBankSchema>;