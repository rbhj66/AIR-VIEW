'use client';
import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  pm25: { label: 'PM2.5', color: 'hsl(var(--chart-1))' },
  pm10: { label: 'PM10', color: 'hsl(var(--chart-2))' },
  co2: { label: 'CO2', color: 'hsl(var(--chart-3))' },
  vocs: { label: 'VOCs', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export default function PollutantDistributionChart({ sensorReadings, isLoading }: { sensorReadings: any[] | null, isLoading: boolean }) {
  const chartData = useMemo(() => {
    if (!sensorReadings || sensorReadings.length === 0) {
      return [];
    }

    const totals = sensorReadings.reduce(
      (acc, reading) => {
        acc.pm25 += reading.pm25 || 0;
        acc.pm10 += reading.pm10 || 0;
        // CO2 and VOCs are often on different scales, we normalize them for a more comparable view
        acc.co2 += (reading.co2 || 0) / 10;
        acc.vocs += (reading.vocs || 0);
        return acc;
      },
      { pm25: 0, pm10: 0, co2: 0, vocs: 0 }
    );
    
    const count = sensorReadings.length;
    
    return [
      { name: 'pm25', value: totals.pm25 / count, fill: 'var(--color-pm25)' },
      { name: 'pm10', value: totals.pm10 / count, fill: 'var(--color-pm10)' },
      { name: 'co2', value: totals.co2 / count, fill: 'var(--color-co2)' },
      { name: 'vocs', value: totals.vocs / count, fill: 'var(--color-vocs)' },
    ];
  }, [sensorReadings]);

  const showSkeleton = isLoading || chartData.length === 0;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Pollutant Distribution</CardTitle>
        <CardDescription>
          Average composition of pollutants over the last 24 hours. CO2 is scaled down for comparability.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-0">
        {showSkeleton ? (
           <div className="flex h-[300px] w-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
             <Skeleton className="h-48 w-48 rounded-full" />
           </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
