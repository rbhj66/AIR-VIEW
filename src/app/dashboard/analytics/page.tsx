'use client';
import PollutantDistributionChart from '@/components/dashboard/analytics/pollutant-distribution-chart';
import HourlyAqiTrends from '@/components/dashboard/analytics/hourly-aqi-trends';
import DeviceCorrelationChart from '@/components/dashboard/analytics/device-correlation-chart';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import PredictionCard from '@/components/dashboard/prediction-card';

export default function AnalyticsPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';
  const deviceId = 'living_room_purifier';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, sensorId]);
  
  const { data: sensorReadings, isLoading: isLoadingReadings } = useCollection(readingsQuery);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <h1 className="text-2xl font-bold">Air Quality Analytics</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <PollutantDistributionChart
          sensorReadings={sensorReadings}
          isLoading={isLoadingReadings}
        />
        <HourlyAqiTrends
          sensorReadings={sensorReadings}
          isLoading={isLoadingReadings}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <PredictionCard />
      </div>
       <div className="grid grid-cols-1 gap-4 lg:gap-8">
          <DeviceCorrelationChart 
            sensorId={sensorId}
            deviceId={deviceId}
          />
       </div>
    </main>
  );
}
