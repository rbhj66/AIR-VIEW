'use client';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
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
import { Activity } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

type Metric = 'aqi' | 'pm25' | 'pm10' | 'co2' | 'vocs';

const chartConfigs: Record<Metric, ChartConfig> = {
  aqi: { aqi: { label: 'AQI', color: 'hsl(var(--chart-1))' } },
  pm25: { pm25: { label: 'PM2.5', color: 'hsl(var(--chart-2))' } },
  pm10: { pm10: { label: 'PM10', color: 'hsl(var(--chart-3))' } },
  co2: { co2: { label: 'CO2', color: 'hsl(var(--chart-4))' } },
  vocs: { vocs: { label: 'VOCs', color: 'hsl(var(--chart-5))' } },
};

export default function HourlyAqiTrends({
  sensorReadings,
  isLoading,
}: {
  sensorReadings: any[] | null;
  isLoading: boolean;
}) {
  const [metric, setMetric] = useState<Metric>('aqi');

  const formattedData = useMemo(() => {
    if (!sensorReadings) return [];
    return sensorReadings
      .map((d: any) => ({
        ...d,
        aqi: calculateAqi(d.pm25),
        time: new Date(d.timestamp.seconds * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      }))
      .reverse(); // Ensure chronological order for the chart
  }, [sensorReadings]);

  const showSkeleton = isLoading || formattedData.length === 0;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Activity /> Hourly Trends
          </CardTitle>
          <CardDescription>
            A real-time visualization of hourly air quality fluctuations.
          </CardDescription>
        </div>
        <Select
          value={metric}
          onValueChange={(value) => setMetric(value as Metric)}
        >
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
      </CardHeader>
      <CardContent>
        {showSkeleton ? (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted/30 text-center text-muted-foreground">
            <p>No data from sensor yet.</p>
            <p className="text-xs">
              Make sure the Wokwi simulation is running on the Connectivity
              page.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfigs[metric]} className="h-64 w-full">
            <AreaChart accessibilityLayer data={formattedData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
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
                stroke={`var(--color-${metric})`}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
