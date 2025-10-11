'use client';
import { Skeleton } from '../ui/skeleton';

interface I2CDisplayProps {
  aqi: number | null;
  pm25: number | null;
  temperature: number | null;
  humidity: number | null;
  isLoading: boolean;
}

export default function I2CDisplay({ aqi, pm25, temperature, humidity, isLoading }: I2CDisplayProps) {
  if (isLoading) {
    return <Skeleton className="h-[124px] w-48 rounded-md" />;
  }

  const formatValue = (value: number | null, decimalPlaces: number = 1) => value?.toFixed(decimalPlaces) ?? '---';

  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md border-2 border-blue-800 bg-[#00008B] p-2 font-mono text-base text-white shadow-inner">
      <div className="w-full text-left text-xs text-blue-200">Wokwi Display</div>
      <div className="flex w-full flex-col gap-1 rounded bg-blue-900/50 px-2 py-1 text-sm">
        <div className="flex items-center justify-between">
            <span>AQI:</span>
            <span className="font-bold">{aqi ?? '---'}</span>
        </div>
        <div className="flex items-center justify-between">
            <span>{formatValue(pm25)}</span>
            <span className="font-bold text-xs">PM2.5</span>
        </div>
        <div className="flex items-center justify-between">
            <span>{formatValue(temperature)}</span>
            <span className="font-bold">&deg;C</span>
        </div>
        <div className="flex items-center justify-between">
            <span>{formatValue(humidity)}</span>
            <span className="font-bold">%</span>
        </div>
      </div>
    </div>
  );
}
