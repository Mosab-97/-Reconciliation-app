import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, X } from 'lucide-react';

interface StatusBadgeProps {
  status: 'MATCHED' | 'LEDGER_ONLY' | 'BANK_ONLY';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    MATCHED: {
      variant: 'default' as const,
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Check,
      label: 'Matched'
    },
    LEDGER_ONLY: {
      variant: 'secondary' as const,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: AlertTriangle,
      label: 'Ledger Only'
    },
    BANK_ONLY: {
      variant: 'destructive' as const,
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: X,
      label: 'Bank Only'
    }
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <Badge className={`${color} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}