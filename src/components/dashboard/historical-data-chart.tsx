'use client';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  if (pm25 <= 200.4) return 201; // For values > 150.4, cap at a high value for visualization
  return 201; 
};

type Metric = 'aqi' | 'pm25' | 'pm10' | 'co2' | 'vocs';

const chartConfigs: Record<Metric, ChartConfig> = {
  aqi: { aqi: { label: 'AQI', color: 'hsl(var(--chart-1))' } },
  pm25: { pm25: { label: 'PM2.5', color: 'hsl(var(--chart-2))' } },
  pm10: { pm10: { label: 'PM10', color: 'hsl(var(--chart-3))' } },
  co2: { co2: { label: 'CO2', color: 'hsl(var(--chart-4))' } },
  vocs: { vocs: { label: 'VOCs', color: 'hsl(var(--chart-5))' } },
};

const metricLabels: Record<Metric, string> = {
  aqi: 'AQI',
  pm25: 'PM2.5 (μg/m³)',
  pm10: 'PM10 (μg/m³)',
  co2: 'CO2 (ppm)',
  vocs: 'VOCs (ppb)',
};

export default function HistoricalDataChart({ className, sensorId }: { className?: string, sensorId: string }) {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState<Metric>('aqi');
  const firestore = useFirestore();

  const { data: chartData, isLoading } = useCollection(useMemoFirebase(() => {
    if (!firestore) return null;
    const days = parseInt(timeRange.replace('d', ''), 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'asc'),
    );
  }, [firestore, timeRange, sensorId]));
  
  const formattedData = useMemo(() => {
    if (!chartData) return [];
    return chartData.map((d: any) => ({
      ...d,
      aqi: calculateAqi(d.pm25),
      date: new Date(d.timestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [chartData]);

  const showSkeleton = isLoading || formattedData.length === 0;

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div className='flex-1'>
          <CardTitle>Historical Air Quality</CardTitle>
          <CardDescription>
            Trends for your sensor over the selected period.
          </CardDescription>
        </div>
        <div className='flex items-center gap-2'>
            <Select value={metric} onValueChange={(value) => setMetric(value as Metric)}>
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="aqi">AQI</SelectItem>
                    <SelectItem value="pm25">PM2.5</SelectItem>
                    <SelectItem value="pm10">PM10</SelectItem>
                    <SelectItem value="co2">CO2</SelectItem>
                    <SelectItem value="vocs">VOCs</SelectItem>
                </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        {showSkeleton ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 text-center text-muted-foreground">
                <p>No data from sensor yet.</p>
                <p className="text-xs">
                Make sure the Wokwi simulation is running on the Connectivity page.
                </p>
            </div>
        ) : (
        <ChartContainer config={chartConfigs[metric]} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              domain={['dataMin', 'dataMax']}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(value, payload) => payload[0]?.payload.date} />} />
            <defs>
              <linearGradient id={`fill${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${metric})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${metric})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={metric}
              type="natural"
              fill={`url(#fill${metric})`}
              fillOpacity={0.4}
              stroke={`var(--color-${metric})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>)}
      </CardContent>
    </Card>
  );
}
