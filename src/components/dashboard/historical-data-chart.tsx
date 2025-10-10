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
import { useState } from 'react';

const chartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (30 - i));
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pm25: Math.floor(Math.random() * 20 + 5),
    pm10: Math.floor(Math.random() * 30 + 10),
    co2: Math.floor(Math.random() * 100 + 400),
  };
});

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

export default function HistoricalDataChart({ className }: { className?: string }) {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Historical Air Quality</CardTitle>
          <CardDescription>
            Air quality trends over the last 30 days
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
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
