'use client';
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { History } from 'lucide-react';
import { useMemo } from 'react';

const chartConfig: ChartConfig = {
  pm25: { label: 'PM2.5', color: 'hsl(var(--chart-1))' },
  pm10: { label: 'PM10', color: 'hsl(var(--chart-2))' },
  co2: { label: 'CO2', color: 'hsl(var(--chart-3))' },
  vocs: { label: 'VOCs', color: 'hsl(var(--chart-4))' },
  other: { label: 'Other', color: 'hsl(var(--chart-5))' },
};

const fakeData = [
  { name: 'pm25', value: 45, fill: 'var(--color-pm25)' },
  { name: 'pm10', value: 67, fill: 'var(--color-pm10)' },
  { name: 'co2', value: 82, fill: 'var(--color-co2)' },
  { name: 'vocs', value: 34, fill: 'var(--color-vocs)' },
  { name: 'other', value: 23, fill: 'var(--color-other)' },
];

export default function HistoricalDataChart({
  className,
}: {
  className?: string;
  sensorId: string;
}) {
  const total = useMemo(() => fakeData.reduce((acc, curr) => acc + curr.value, 0), []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History /> Pollutant Composition
        </CardTitle>
        <CardDescription>
          A sample distribution of common air pollutants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Tooltip
              content={
                <ChartTooltipContent
                  nameKey="name"
                  formatter={(value) => `${value} (${((value / total) * 100).toFixed(1)}%)`}
                />
              }
            />
            <Pie
              data={fakeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={5}
              strokeWidth={3}
            >
              {fakeData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
