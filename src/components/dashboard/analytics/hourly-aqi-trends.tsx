'use client';
import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
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
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  aqi: {
    label: 'AQI',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201;
};

export default function HourlyAqiTrends({ sensorReadings, isLoading }: { sensorReadings: any[] | null, isLoading: boolean }) {
  const chartData = useMemo(() => {
    if (!sensorReadings) return [];

    const hourlyData: { [hour: number]: { totalAqi: number; count: number } } = {};
    for (let i = 0; i < 24; i++) {
        hourlyData[i] = { totalAqi: 0, count: 0 };
    }

    sensorReadings.forEach((reading) => {
      const date = new Date(reading.timestamp.seconds * 1000);
      const hour = date.getHours();
      const aqi = calculateAqi(reading.pm25);
      if (hourlyData[hour]) {
        hourlyData[hour].totalAqi += aqi;
        hourlyData[hour].count++;
      }
    });

    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: `${parseInt(hour, 10) % 12 || 12}${parseInt(hour, 10) >= 12 ? 'p' : 'a'}`, // Format hour to 12-hour AM/PM
      aqi: data.count > 0 ? Math.round(data.totalAqi / data.count) : 0,
    })).sort((a,b) => {
      const aHour = parseInt(a.hour);
      const bHour = parseInt(b.hour);
      const aPeriod = a.hour.slice(-1);
      const bPeriod = b.hour.slice(-1);

      if (aPeriod === 'a' && bPeriod === 'p') return -1;
      if (aPeriod === 'p' && bPeriod === 'a') return 1;
      if (aHour === 12) return -1;
      if (bHour === 12) return 1;
      
      return aHour - bHour;
    });
  }, [sensorReadings]);

  if(isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Hourly AQI</CardTitle>
        <CardDescription>Average Air Quality Index for each hour over the last 24 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, -1)}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="aqi" fill="var(--color-aqi)" radius={4} />
          </BarChart>
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
