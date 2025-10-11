'use client';
import { Badge } from '@/components/ui/badge';
import AqiCircle from '@/components/dashboard/aqi-circle';

const getStatusInfo = (aqi: number) => {
    if (aqi <= 50) {
      return {
        status: 'Good',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      };
    }
    if (aqi <= 100) {
      return {
        status: 'Moderate',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      };
    }
    // Simplified for this component
    return {
        status: 'Unhealthy',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    }
};

interface PurifiedAqiIndicatorProps {
    purifiedAqi: number;
}

export default function PurifiedAqiIndicator({ purifiedAqi }: PurifiedAqiIndicatorProps) {
    const statusInfo = getStatusInfo(purifiedAqi);
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center">
      <AqiCircle value={purifiedAqi} size="sm" />
      <div className='flex flex-col gap-1 items-center'>
        <Badge className={statusInfo.color}>{statusInfo.status}</Badge>
        <span className="text-xs font-medium text-muted-foreground">Purified</span>
      </div>
    </div>
  );
}
