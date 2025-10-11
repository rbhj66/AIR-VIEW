'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
import HarmfulGases from '@/components/dashboard/harmful-gases';
import LivePulseChart from '@/components/dashboard/live-pulse-chart';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import LiveAqiCard from '@/components/dashboard/live-aqi-card';
import TemperatureAndHumidity from '@/components/dashboard/temperature-and-humidity';

export default function DashboardPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';
  const [mockTick, setMockTick] = useState(0);

  // Fetch more readings to show a trend in the mini-charts
  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(50) // Increased limit for historical data on charts
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);
  
  // Reverse the array to have the latest reading at the end for charting
  const orderedReadings = useMemo(() => readings?.slice().reverse() || [], [readings]);

  const latestReading = useMemo(() => (orderedReadings?.[orderedReadings.length - 1] as any) || null, [orderedReadings]);
  const isDataAvailable = !isLoading && latestReading;
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isDataAvailable) {
       interval = setInterval(() => {
        setMockTick(tick => tick + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isDataAvailable]);

  const airQualityData = useMemo(() => {
    const getTime = (r: any) => r.timestamp.toDate().toLocaleTimeString();

    if (isDataAvailable) {
      return {
        pm25: { value: latestReading.pm25 ?? null },
        co2: { value: latestReading.co2 ?? null, history: orderedReadings.map(r => ({ time: getTime(r), value: r.co2 })) },
        vocs: { value: latestReading.vocs ?? null, history: orderedReadings.map(r => ({ time: getTime(r), value: r.vocs })) },
        temperature: { value: latestReading.temperature ?? null, history: orderedReadings.map(r => ({ time: getTime(r), value: r.temperature })) },
        humidity: { value: latestReading.humidity ?? null, history: orderedReadings.map(r => ({ time: getTime(r), value: r.humidity })) },
        isLoading: false,
      };
    }
    
    // Generate mock data if real data is not available
    const generateHistory = (base: number, fluctuation: number, ticks: number) => {
        return Array.from({length: 20}, (_, i) => ({
            time: `${i}`,
            value: parseFloat((base + Math.sin((ticks + i) * 0.5) * fluctuation).toFixed(1))
        }));
    };

    const mockTemp = parseFloat((21 + Math.sin(mockTick * 0.2)).toFixed(1));
    const mockHumidity = parseFloat((45 + Math.cos(mockTick * 0.3) * 5).toFixed(1));

    return {
      pm25: { value: parseFloat((10 + (Math.sin(mockTick * 0.5) * 5)).toFixed(1))},
      co2: { value: parseFloat((450 + Math.sin(mockTick * 0.4) * 50).toFixed(0)), history: generateHistory(450, 50, mockTick) },
      vocs: { value: parseFloat((150 + Math.cos(mockTick * 0.6) * 20).toFixed(0)), history: generateHistory(150, 20, mockTick) },
      temperature: { value: mockTemp, history: generateHistory(21, 1, mockTick) },
      humidity: { value: mockHumidity, history: generateHistory(45, 5, mockTick) },
      isLoading: true, // Indicate that we are using mock/loading data
    };

  }, [latestReading, orderedReadings, isDataAvailable, mockTick]);

  const isDataLoading = !isDataAvailable && airQualityData.isLoading;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <LiveAqiCard isLoading={isDataLoading} pm25={airQualityData.pm25.value} />
          <HarmfulGases 
            isLoading={isDataLoading} 
            co2={airQualityData.co2}
            vocs={airQualityData.vocs}
            className="lg:col-span-2"
          />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <TemperatureAndHumidity
            isLoading={isDataLoading}
            temperature={airQualityData.temperature}
            humidity={airQualityData.humidity}
          />
        <LivePulseChart />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8">
        <HistoricalDataChart sensorId={sensorId} />
      </div>
    </main>
  );
}
