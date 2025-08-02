export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
    }

    const transactions = records.map((record: any) => ({
      amount: parseFloat(record.amount) || 0,
      date: record.date ? new Date(record.date) : new Date(),
      description: record.description || "",
      source: "Bank Import",
    }));

    await prisma.bankTransaction.createMany({
      data: transactions,
    });

    return NextResponse.json({ success: true, count: transactions.length });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

