
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
import HarmfulGases from '@/components/dashboard/harmful-gases';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import LiveAqiCard from '@/components/dashboard/live-aqi-card';
import TemperatureAndHumidity from '@/components/dashboard/temperature-and-humidity';
import HistoricalSummary from '@/components/dashboard/historical-summary';
import FingerprintScanner from '@/components/dashboard/fingerprint-scanner';

export default function DashboardPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';
  const [mockTick, setMockTick] = useState(0);

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading: isFirestoreLoading } =
    useCollection(readingsQuery);
  const orderedReadings = useMemo(
    () => readings?.slice().reverse() || [],
    [readings]
  );
  const latestReading = useMemo(
    () => (orderedReadings?.[orderedReadings.length - 1] as any) || null,
    [orderedReadings]
  );
  const isDataAvailable = !isFirestoreLoading && latestReading;

  useEffect(() => {
    const interval = setInterval(() => {
      setMockTick((tick) => tick + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const airQualityData = useMemo(() => {
    const getTime = (r: any) => r.timestamp.toDate().toLocaleTimeString();

    if (isDataAvailable) {
      return {
        pm25: { value: latestReading.pm25 ?? 0 },
        pm10: { value: latestReading.pm10 ?? 0 },
        co2: {
          value: latestReading.co2 ?? 0,
          history: orderedReadings.map((r) => ({
            time: getTime(r),
            value: r.co2,
          })),
        },
        vocs: {
          value: latestReading.vocs ?? 0,
          history: orderedReadings.map((r) => ({
            time: getTime(r),
            value: r.vocs,
          })),
        },
        temperature: {
          value: latestReading.temperature ?? 0,
          history: orderedReadings.map((r) => ({
            time: getTime(r),
            value: r.temperature,
          })),
        },
        humidity: {
          value: latestReading.humidity ?? 0,
          history: orderedReadings.map((r) => ({
            time: getTime(r),
            value: r.humidity,
          })),
        },
        isLoading: false,
      };
    }

    // Always generate mock data
    const generateHistory = (base: number, fluctuation: number, ticks: number) =>
      Array.from({ length: 20 }, (_, i) => ({
        time: `${i}`,
        value: parseFloat(
          (base + Math.sin((ticks + i) * 0.5) * fluctuation).toFixed(1)
        ),
      }));

    return {
      pm25: { value: parseFloat((34 + Math.sin(mockTick * 0.5) * 5).toFixed(1)) },
      pm10: { value: parseFloat((45 + Math.cos(mockTick * 0.5) * 7).toFixed(1)) },
      co2: {
        value: parseFloat((820 + Math.sin(mockTick * 0.4) * 50).toFixed(0)),
        history: generateHistory(820, 50, mockTick),
      },
      vocs: {
        value: parseFloat((230 + Math.cos(mockTick * 0.6) * 20).toFixed(0)),
        history: generateHistory(230, 20, mockTick),
      },
      temperature: {
        value: parseFloat((21 + Math.sin(mockTick * 0.2)).toFixed(1)),
        history: generateHistory(21, 1, mockTick),
      },
      humidity: {
        value: parseFloat((55 + Math.cos(mockTick * 0.3) * 5).toFixed(1)),
        history: generateHistory(55, 5, mockTick),
      },
      isLoading: false, // Force components to use mock data
    };
  }, [latestReading, orderedReadings, isDataAvailable, mockTick]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <LiveAqiCard
          isLoading={airQualityData.isLoading}
          pm25={airQualityData.pm25.value}
        />
        <HarmfulGases
          isLoading={airQualityData.isLoading}
          co2={airQualityData.co2}
          vocs={airQualityData.vocs}
          className="lg:col-span-2"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <TemperatureAndHumidity
          isLoading={airQualityData.isLoading}
          temperature={airQualityData.temperature}
          humidity={airQualityData.humidity}
        />
        <HistoricalSummary sensorId={sensorId} />
        <FingerprintScanner pm25={airQualityData.pm25.value} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8">
        <HistoricalDataChart sensorId={sensorId} />
      </div>
    </main>
  );
}
