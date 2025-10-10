'use client';
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
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

const chartConfig = {
  pm25: {
    label: 'PM2.5',
    color: 'hsl(var(--primary))',
  },
  pm10: {
    label: 'PM10',
    color: 'hsl(var(--accent))',
  },
  co2: {
    label: 'CO₂',
    color: 'hsl(var(--secondary-foreground))',
  },
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
      date: new Date(d.timestamp.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [chartData]);


  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Historical Air Quality</CardTitle>
          <CardDescription>
            Air quality trends from your sensor.
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
        {!isLoading && formattedData.length === 0 && <div className="h-64 w-full flex items-center justify-center"><p className='text-muted-foreground'>No data from sensor yet. Make sure the Wokwi simulation is running.</p></div>}
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
              yAxisId="left"
            />
             <YAxis
              orientation="right"
              yAxisId="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillPm25" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pm25)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pm25)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPm10" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pm10)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pm10)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="pm10"
              type="natural"
              fill="url(#fillPm10)"
              fillOpacity={0.4}
              stroke="var(--color-pm10)"
              stackId="a"
              yAxisId="left"
            />
            <Area
              dataKey="pm25"
              type="natural"
              fill="url(#fillPm25)"
              fillOpacity={0.4}
              stroke="var(--color-pm25)"
              stackId="a"
              yAxisId="left"
            />
             <Bar dataKey="co2" fill="var(--color-co2)" radius={4} yAxisId="right" barSize={10} opacity={0.3} />
          </AreaChart>
        </ChartContainer>}
      </CardContent>
    </Card>
  );
}
