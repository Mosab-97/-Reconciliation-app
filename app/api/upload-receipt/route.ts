import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePDFReceipt } from '@/utils/parsePDFReceipt';
import { uploadReceiptSchema } from '@/lib/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🟢 Upload receipt API called');

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided or invalid file type.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse the PDF receipt
    const parsedReceipt = await parsePDFReceipt(buffer);

    // Validate the parsed data
    const validatedData = uploadReceiptSchema.parse(parsedReceipt);

    // Save to database
    const ledgerEntry = await prisma.ledger.create({
      data: {
        vendor: validatedData.vendor,
        amount: validatedData.amount,
        date: validatedData.date,
        description: validatedData.description,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: ledgerEntry.id,
        vendor: ledgerEntry.vendor,
        amount: Number(ledgerEntry.amount),
        date: ledgerEntry.date,
        description: ledgerEntry.description,
      },
    });
  } catch (error: any) {
    console.error('❌ Error in upload-receipt:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

