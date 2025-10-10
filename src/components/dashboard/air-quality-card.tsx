'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ChartDataPoint } from '@/lib/types';
import { Badge } from '../ui/badge';

interface AirQualityCardProps {
  title: string;
  value: number;
  unit: string;
  icon: ReactNode;
  status: string;
  chartData: ChartDataPoint[];
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function AirQualityCard({
  title,
  value,
  unit,
  icon,
  status,
  chartData,
}: AirQualityCardProps) {
  const statusColor =
    status === 'Good' || status === 'Excellent'
      ? 'bg-accent/50 text-accent-foreground'
      : status === 'Moderate'
        ? 'bg-yellow-400/50 text-yellow-700'
        : 'bg-red-400/50 text-red-700';

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">
            {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
          </div>
          <Badge className={cn('mt-1 text-xs font-medium', statusColor)}>
            {status}
          </Badge>
        </div>
        <div className="h-20 w-full pt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillValue)"
                stroke="var(--color-value)"
                stackId="a"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
