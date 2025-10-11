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

export default function DashboardPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);

  const latestReading = useMemo(() => (readings?.[0] as any) || null, [readings]);
  const isDataLoading = isLoading || !latestReading;

  const airQualityData = useMemo(() => {
    const co2 = latestReading?.co2 ?? null;
    const voc = latestReading?.vocs ?? null;
    
    return {
      co2: { value: co2 },
      vocs: { value: voc },
    };
  }, [latestReading]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <HarmfulGases 
          isLoading={isDataLoading} 
          co2={airQualityData.co2.value} 
          vocs={airQualityData.vocs.value} 
        />
      </div>
    </main>
  );
}
