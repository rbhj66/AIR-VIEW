'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Thermometer, Droplets } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { ChartContainer } from '../ui/chart';
import { Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';

interface TemperatureAndHumidityProps {
  isLoading: boolean;
  temperature: { value: number | null; history: ChartDataPoint[] };
  humidity: { value: number | null; history: ChartDataPoint[] };
}

const MiniChart = ({ data }: { data: ChartDataPoint[] }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) {
      return Array.from({ length: 10 }, (_, i) => ({ time: i.toString(), value: 0 }));
    }
    return data;
  }, [data]);

  return (
    <ChartContainer config={{}} className="h-10 w-24">
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="mini-chart-fill-temp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill="url(#mini-chart-fill-temp)"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default function TemperatureAndHumidity({ isLoading, temperature, humidity }: TemperatureAndHumidityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Thermometer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Temperature</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-20" />
              ) : (
                <p className="text-2xl font-bold">{temperature.value?.toFixed(1)}°C</p>
              )}
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <MiniChart data={temperature.history} />
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Droplets className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground">Humidity</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-20" />
              ) : (
                <p className="text-2xl font-bold">{humidity.value?.toFixed(1)}%</p>
              )}
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <MiniChart data={humidity.history} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
