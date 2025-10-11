'use client';
import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Calendar } from 'lucide-react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

const MAX_AQI = 300;

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

const getStatusColor = (value: number) => {
    if (value <= 50) return 'hsl(var(--chart-1))';
    if (value <= 100) return 'hsl(var(--chart-2))';
    if (value <= 150) return 'hsl(var(--chart-3))';
    if (value <= 200) return 'hsl(var(--chart-4))';
    return 'hsl(var(--chart-5))';
};


export default function HistoricalSummary({ sensorId }: { sensorId: string }) {
  const firestore = useFirestore();

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);

  const averageAqi = useMemo(() => {
    if (!readings || readings.length === 0) return 0;
    const totalAqi = readings.reduce(
      (sum, reading) => sum + calculateAqi((reading as any).pm25),
      0
    );
    return Math.round(totalAqi / readings.length);
  }, [readings]);
  
  const chartData = [{ name: 'Average AQI', value: averageAqi, fill: getStatusColor(averageAqi) }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>30-Day AQI Average</CardTitle>
        <CardDescription>
          An overview of your air quality over the past month.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-40 w-40 rounded-full" />
        ) : (
          <div className="relative h-40 w-40">
            <RadialBarChart
              width={160}
              height={160}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              barSize={20}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, MAX_AQI]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: 'hsl(var(--muted))' }}
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold">{averageAqi}</span>
                 <Calendar className="h-6 w-6 text-muted-foreground" />
                 <p className="text-xs text-muted-foreground mt-1">30-Day Avg</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
