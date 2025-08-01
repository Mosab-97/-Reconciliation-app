import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Upload, List, GitCompare, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Receipt,
      title: 'PDF Receipt Processing',
      description: 'Upload and automatically parse PDF receipts to extract vendor, amount, date, and description.',
      href: '/upload-receipt',
    },
    {
      icon: Upload,
      title: 'Bank CSV Import',
      description: 'Import bank statements in CSV format with flexible column mapping and validation.',
      href: '/upload-bank',
    },
    {
      icon: List,
      title: 'Ledger Management',
      description: 'View and manage all your receipt entries in a clean, organized ledger format.',
      href: '/ledger',
    },
    {
      icon: GitCompare,
      title: 'Smart Reconciliation',
      description: 'Intelligent matching algorithm compares receipts with bank transactions using fuzzy logic.',
      href: '/compare',
    },
  ];

  const benefits = [
    'Automated receipt data extraction',
    'Flexible CSV import with error handling',
    'Intelligent transaction matching',
    'Visual reconciliation dashboard',
    'Export capabilities for reports',
    'Mobile-responsive design',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Reconciliation
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Streamline your accounting workflow with intelligent receipt-to-bank reconciliation. 
          Upload receipts, import bank statements, and let our smart algorithm handle the matching.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/upload-receipt">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">View Demo</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="w-full">
                  <Link href={feature.href}>
                    Try it now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Choose Smart Reconciliation?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Built with Modern Technology
        </h3>
        <p className="text-gray-600">
          Next.js • React • TypeScript • Tailwind CSS • Prisma • PostgreSQL
        </p>
      </div>
    </div>
  );
}