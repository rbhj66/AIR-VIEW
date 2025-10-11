'use client';
import { Skeleton } from '../ui/skeleton';

interface I2CDisplayProps {
  aqi: number | null;
  isLoading: boolean;
}

export default function I2CDisplay({ aqi, isLoading }: I2CDisplayProps) {
  if (isLoading) {
    return <Skeleton className="h-20 w-48 rounded-md" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-blue-800 bg-[#00008B] p-3 font-mono text-lg text-white shadow-inner">
      <div className="w-full text-left text-sm text-blue-200">Wokwi Display</div>
      <div className="flex w-full items-center justify-between rounded bg-blue-900/50 px-2 py-1">
        <span>AQI:</span>
        <span className="font-bold">{aqi ?? '---'}</span>
      </div>
    </div>
  );
}
