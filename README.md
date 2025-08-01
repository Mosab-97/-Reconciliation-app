# Smart Reconciliation

A full-stack receipt-to-bank reconciliation app that lets you upload PDF receipts and CSV bank statements, automatically extracting and matching transactions with a clean, easy-to-use interface.

## Features

- Upload and parse PDF receipts into a ledger  
- Import CSV bank statements with flexible column mapping  
- Smart matching of transactions by amount, date, and description similarity  
- Dashboard showing matched, ledger-only, and bank-only transactions  
- Real-time feedback and clear status indicators  
- Built for easy deployment (Vercel-ready)  

## Tech Stack

- Next.js 13 with React and TypeScript  
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)  
- Tailwind CSS for styling  
- pdf-parse & papaparse for file parsing  
- Zod for data validation  


## Usage : 
Upload receipts (PDF) at /upload-receipt

Upload bank CSV statements at /upload-bank

Run reconciliation at /compare to see matched and unmatched transactions

## Matching Algorithm : 
Matches transactions by exact or near-exact amounts

Considers date proximity for delayed transactions

Uses fuzzy string matching on vendor/description

Provides match confidence scores

Author: Mosab Mohamed
