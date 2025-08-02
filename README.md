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



##  How to Run Locally

Anyone can test this app locally in under 5 minutes:

### 1️ Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- npm (or yarn)

### 2 Clone the Repository

## bash
git clone https://github.com/Mosab-97/-Reconciliation-app.git
cd -Reconciliation-app
3️ Install Dependencies
bash
Copy
Edit
npm install
4️ Set Up the Database
Use the built-in SQLite database for local development:

bash
Copy
Edit
npx prisma migrate dev --name init
(Optionally run npx prisma studio to view/edit the DB in a browser UI)

5️ Start the App
bash
Copy
Edit
npm run dev
Open your browser:
http://localhost:3000


## Production Deployment Notes
The app is Vercel-ready

You’ll need to connect a hosted PostgreSQL DB (e.g., Supabase, PlanetScale)

DATABASE_URL must be added to .env for production




Author: Mosab Mohamed
