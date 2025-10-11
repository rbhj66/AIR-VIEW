'use client';
import { useMemo, useEffect, useState } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, Timestamp, onSnapshot } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  aqi: { label: 'AQI', color: 'hsl(var(--primary))' },
  deviceOn: { label: 'Purifier On', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  return 101; // Simplified
};

export default function DeviceCorrelationChart({ sensorId, deviceId }: { sensorId: string, deviceId: string }) {
  const firestore = useFirestore();
  const [deviceHistory, setDeviceHistory] = useState<any[]>([]);
  const [isLoadingDevice, setIsLoadingDevice] = useState(true);

  // Fetch last 24h of sensor readings
  const sensorReadingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
    );
  }, [firestore, sensorId]);
  const { data: sensorReadings, isLoading: isLoadingSensor } = useCollection(sensorReadingsQuery);

   // We can't use a hook for the device history because it's not a real collection
   // This is a simplified listener. A real app might store historical state changes.
    useEffect(() => {
        if (!firestore) return;
        const deviceRef = doc(firestore, 'air_purifier_devices', deviceId);
        setIsLoadingDevice(true);
        const unsub = onSnapshot(deviceRef, (doc) => {
            if (doc.exists()) {
                // In a real app, you would accumulate a history of states.
                // For this simulation, we'll create a fake history based on the current state.
                const currentState = doc.data();
                const fakeHistory = Array.from({ length: 24 }).map((_, i) => ({
                    isPoweredOn: currentState.isPoweredOn,
                    timestamp: new Date(Date.now() - i * 60 * 60 * 1000), // One entry per hour
                }));
                setDeviceHistory(fakeHistory);
            }
            setIsLoadingDevice(false);
        });
        return () => unsub();
    }, [firestore, deviceId]);


  const chartData = useMemo(() => {
    if (!sensorReadings || deviceHistory.length === 0) return [];
    
    // Combine and sort data by time
    const combined = [...sensorReadings].sort((a,b) => a.timestamp.seconds - b.timestamp.seconds);

    return combined.map((reading) => {
        const readingTime = reading.timestamp.toDate();
        const aqi = calculateAqi(reading.pm25);

        // Find the closest device state in time
        const closestDeviceState = deviceHistory.reduce((prev, curr) => {
            return (Math.abs(curr.timestamp - readingTime) < Math.abs(prev.timestamp - readingTime) ? curr : prev);
        });

        return {
            time: readingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            aqi,
            // Represent device state on a different scale for visibility
            deviceOn: closestDeviceState.isPoweredOn ? 50 : 0, 
        };
    });
  }, [sensorReadings, deviceHistory]);

  const isLoading = isLoadingSensor || isLoadingDevice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Activity vs. AQI</CardTitle>
        <CardDescription>
          Correlation between air purifier activity and AQI levels over the last 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-aqi)" />
              <YAxis yAxisId="right" orientation="right" tick={false} axisLine={false} width={0} />

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              
              <Line
                dataKey="aqi"
                type="monotone"
                stroke="var(--color-aqi)"
                strokeWidth={2}
                dot={false}
                yAxisId="left"
              />
              <Line
                dataKey="deviceOn"
                type="step"
                stroke="var(--color-deviceOn)"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                />
            </LineChart>
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
