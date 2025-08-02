import { z } from 'zod';

export const uploadReceiptSchema = z.object({
  vendor: z.string().min(1),
  amount: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().optional(),
});

