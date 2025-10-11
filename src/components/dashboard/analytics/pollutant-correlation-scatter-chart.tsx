'use client';
import { useMemo } from 'react';
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';
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
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  pm25: { label: 'PM2.5', color: 'hsl(var(--chart-1))' },
  co2: { label: 'CO2', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

export default function PollutantCorrelationScatterChart({ sensorReadings, isLoading }: { sensorReadings: any[] | null, isLoading: boolean }) {
  const chartData = useMemo(() => {
    if (!sensorReadings) return [];
    return sensorReadings.map(reading => ({
      pm25: reading.pm25,
      co2: reading.co2,
    }));
  }, [sensorReadings]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pollutant Correlation (PM2.5 vs. CO2)</CardTitle>
        <CardDescription>
          Scatter plot showing the relationship between PM2.5 and CO2 levels from recent sensor readings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis type="number" dataKey="pm25" name="PM2.5" unit="µg/m³" />
                <YAxis type="number" dataKey="co2" name="CO2" unit="ppm" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                <Legend />
                <Scatter name="Readings" data={chartData} fill="var(--color-pm25)" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
            <div className="flex h-64 w-full items-center justify-center text-muted-foreground">
               No data available for chart.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
