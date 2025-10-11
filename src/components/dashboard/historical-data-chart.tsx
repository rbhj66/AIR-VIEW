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


const chartConfig = {
  aqi: {
    label: 'AQI',
    color: 'hsl(var(--primary))',
  }
} satisfies ChartConfig;

export default function HistoricalDataChart({ className, sensorId }: { className?: string, sensorId: string }) {
  const [timeRange, setTimeRange] = useState('30d');
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


  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Historical Air Quality Index (AQI)</CardTitle>
          <CardDescription>
            AQI trends from your sensor over the selected period.
          </CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        {isLoading && <div className="h-64 w-full flex items-center justify-center"><Skeleton className="h-full w-full" /></div>}
        {!isLoading && formattedData.length === 0 && <div className="h-64 w-full flex flex-col items-center justify-center gap-2 text-center"><p className='text-muted-foreground'>No data from sensor yet.</p><p className="text-xs text-muted-foreground">Make sure the Wokwi simulation is running on the Connectivity page.</p></div>}
        {!isLoading && formattedData.length > 0 && <ChartContainer config={chartConfig} className="h-64 w-full">
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
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillAqi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-aqi)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-aqi)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="aqi"
              type="natural"
              fill="url(#fillAqi)"
              fillOpacity={0.4}
              stroke="var(--color-aqi)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>}
      </CardContent>
    </Card>
  );
}
