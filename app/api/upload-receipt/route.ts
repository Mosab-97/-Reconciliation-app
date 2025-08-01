import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parsePDFReceipt } from '@/utils/parsePDFReceipt';
import { uploadReceiptSchema } from '@/lib/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🟢 Upload receipt API called');

    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your configuration.' },
        { status: 500 }
      );
    }

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

    // Parse PDF (mock or real implementation)
    const parsedReceipt = await parsePDFReceipt(buffer);

    // Validate parsed data
    const validatedData = uploadReceiptSchema.parse(parsedReceipt);

    // Save to DB
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

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Duplicate entry detected.' }, { status: 409 });
    }

    if (error.code === 'P1001') {
      return NextResponse.json({
        error: 'Cannot connect to database. Check your configuration.',
      }, { status: 500 });
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

