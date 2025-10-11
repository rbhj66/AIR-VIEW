'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  query,
  orderBy,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { useMemo } from 'react';
import HarmfulGases from '@/components/dashboard/harmful-gases';
import LivePulseChart from '@/components/dashboard/live-pulse-chart';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';

export default function DashboardPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';

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
  const isDataLoading = isLoading || !latestReading;

  const airQualityData = useMemo(() => {
    const co2 = latestReading?.co2 ?? null;
    const vocs = latestReading?.vocs ?? null;
    const temperature = latestReading?.temperature ?? null;
    const humidity = latestReading?.humidity ?? null;

    const getTime = (r: any) => r.timestamp.toDate().toLocaleTimeString();
    
    // Prepare data for mini-charts
    const co2History = orderedReadings.map(r => ({ time: getTime(r), value: r.co2 }));
    const vocsHistory = orderedReadings.map(r => ({ time: getTime(r), value: r.vocs }));
    const temperatureHistory = orderedReadings.map(r => ({ time: getTime(r), value: r.temperature }));
    const humidityHistory = orderedReadings.map(r => ({ time: getTime(r), value: r.humidity }));

    return {
      co2: { value: co2, history: co2History },
      vocs: { value: vocs, history: vocsHistory },
      temperature: { value: temperature, history: temperatureHistory },
      humidity: { value: humidity, history: humidityHistory },
    };
  }, [latestReading, orderedReadings]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <HarmfulGases 
        isLoading={isDataLoading} 
        co2={airQualityData.co2}
        vocs={airQualityData.vocs}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <LivePulseChart />
        <HistoricalDataChart sensorId={sensorId} />
      </div>
    </main>
  );
}
