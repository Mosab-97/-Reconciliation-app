'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Receipt, Upload, List, GitCompare, Home, Database } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Upload Receipt', href: '/upload-receipt', icon: Receipt },
  { name: 'Upload Bank', href: '/upload-bank', icon: Upload },
  { name: 'Ledger', href: '/ledger', icon: List },
  { name: 'Compare', href: '/compare', icon: GitCompare },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                <Database className="h-6 w-6 mr-2 inline-block text-blue-600" />
                Smart Reconciliation
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">
                Database:
              </div>
              <div className="text-xs font-semibold text-blue-600">
                SQLite
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}