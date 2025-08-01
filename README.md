
# Smart Reconciliation

A full-stack receipt-to-bank reconciliation application that automatically matches PDF receipts with bank statement transactions using intelligent algorithms.

##  Features

- **PDF Receipt Processing**: Upload and automatically parse PDF receipts to extract vendor, amount, date, and description
- **Bank CSV Import**: Import bank statements in CSV format with flexible column mapping
- **Intelligent Matching**: Smart reconciliation algorithm that matches transactions based on amount, date, and description similarity
- **Visual Dashboard**: Clean, responsive interface showing matched, ledger-only, and bank-only transactions
- **Real-time Processing**: Instant feedback with toast notifications and loading states
- **Export Ready**: Built-in support for data export and reporting

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: None (public access for demo)
- **UI Components**: shadcn/ui, Lucide React icons
- **Processing**: pdf-parse, papaparse
- **Validation**: Zod
- **Utilities**: date-fns
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
smart-reconciliation/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── upload-receipt/    # Receipt upload page
│   ├── upload-bank/       # Bank CSV upload page
│   ├── ledger/           # Ledger view page
│   └── compare/          # Reconciliation page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── NavBar.tsx        # Navigation component
│   ├── UploadBox.tsx     # File upload component
│   ├── LedgerTable.tsx   # Receipt ledger table
│   ├── BankTable.tsx     # Bank transaction table
│   ├── MatchTable.tsx    # Reconciliation results table
│   └── StatusBadge.tsx   # Status indicator component
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── supabase.ts       # Supabase client
│   ├── pdf-parser.ts     # PDF processing logic
│   ├── csv-parser.ts     # CSV processing logic
│   ├── reconciliation.ts # Matching algorithm
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🏗️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-reconciliation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Environment variables (optional)**
   ```bash
   cp .env.example .env
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### 1. Upload Receipts
- Navigate to `/upload-receipt`
- Upload PDF receipts (drag & drop or click to browse)
- System automatically extracts vendor, amount, date, and description
- View all receipts in the ledger

### 2. Import Bank Statements
- Navigate to `/upload-bank`
- Upload CSV files with columns: Date, Amount, Description, Source
- System processes and stores all valid transactions

### 3. Run Reconciliation
- Navigate to `/compare`
- Click "Run Reconciliation" to match receipts with bank transactions
- View results with color-coded status badges:
  - 🟢 **Matched**: Perfect or near-perfect matches
  - 🟡 **Ledger Only**: Receipts without matching bank transactions
  - 🔴 **Bank Only**: Bank transactions without matching receipts

### 4. Review Results
- Analyze reconciliation dashboard with statistics
- Export results for reporting
- Re-run reconciliation as needed

## 🧠 Matching Algorithm

The intelligent reconciliation engine uses multiple criteria:

1. **Amount Matching**: Exact match or within $0.01 tolerance
2. **Date Matching**: Same-day transactions get higher scores
3. **Description Similarity**: Fuzzy string matching for vendor/description correlation
4. **Scoring System**: Weighted algorithm produces confidence scores (0-100%)

## 🚀 Deployment

### Vercel + Supabase Deployment

### Vercel Deployment

1. **Prepare for Production**
   - For production, consider upgrading to PostgreSQL
   - Update the `DATABASE_URL` in your environment variables
   - Run migrations: `npx prisma migrate deploy`

2. **Connect to Vercel**
   - Connect your GitHub repository to Vercel
   - The project is configured for automatic deployment

3. **Deploy**
   ```bash
   npm run build
   ```

The application is fully optimized for Vercel deployment with:
- Static optimization
- API route deployment
- Automatic HTTPS
- Global CDN
- Database integration ready

## 🔧 Database Configuration

The app uses SQLite for development:
- **Database**: SQLite with Prisma ORM
- **Authentication**: None (public access for demo)
- **Migrations**: Automatic with Prisma
- **Performance**: Optimized with proper indexes

### Database Tables
- `ledger`: Receipt entries from PDF uploads
- `bank_transactions`: Bank statement entries from CSV imports
- `match_results`: Reconciliation results with status and confidence scores

### Connection Status
- ✅ SQLite database connection testing on each API call
- ✅ Proper error handling for connection issues
- ✅ Automatic database creation and migrations
- ✅ Ready for PostgreSQL upgrade in production
## 📈 Advanced Features

- **Fuzzy Matching**: Intelligent string similarity for vendor matching
- **Date Tolerance**: Flexible date matching for delayed transactions  
- **Amount Variance**: Configurable tolerance for amount differences
- **Batch Processing**: Handle large CSV imports efficiently
- **Error Recovery**: Robust error handling and validation
- **Database Transactions**: Ensure data consistency with Prisma transactions
- **File Size Limits**: Prevent abuse with reasonable upload limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of Minerva's coding challenge.

## 👨‍💻 Author

**Mosab Mohamed** - Full-Stack Developer

---

**Live Demo**: [View on Vercel](https://your-deployment-url.vercel.app)

Built with ❤️ for intelligent financial reconciliation using Supabase + Next.js.
>>>>>>> Initial commit with working reconciliation app
