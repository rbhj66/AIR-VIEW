'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import I2CDisplay from '@/components/dashboard/i2c-display';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

export default function DashboardPage() {
  const firestore = useFirestore();
  
  const sensorId = 'living_room_sensor';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, sensorId]);
  

  const { data: readings, isLoading } = useCollection(readingsQuery);
  
  const latestReading = useMemo(() => readings?.[0] as any, [readings]);

  const airQualityData = useMemo(() => {
    if (!latestReading) {
      return {
        aqi: null,
        pm25: null,
        temperature: null,
        humidity: null,
      };
    }
    const aqi = calculateAqi(latestReading.pm25);

    return {
      aqi,
      pm25: latestReading.pm25,
      temperature: latestReading.temperature,
      humidity: latestReading.humidity,
    };
  }, [latestReading]);
  
  return (
    <main className="flex flex-1 items-center justify-center p-4 sm:px-6 sm:py-6">
      <I2CDisplay 
          aqi={airQualityData.aqi}
          pm25={airQualityData.pm25}
          temperature={airQualityData.temperature}
          humidity={airQualityData.humidity}
          isLoading={isLoading} 
        />
    </main>
  );
}
