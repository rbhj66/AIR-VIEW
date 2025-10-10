'use client';

import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Wind, Biohazard, Beaker } from 'lucide-react';
import AqiCircle from '@/components/dashboard/aqi-circle';
import PredictionCard from '@/components/dashboard/prediction-card';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AirQualityAlert from '@/components/dashboard/air-quality-alert';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

const getStatusInfo = (aqi: number) => {
    if (aqi <= 50) {
      return {
        status: 'Good',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      };
    }
    if (aqi <= 100) {
      return {
        status: 'Moderate',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        description: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern.',
      };
    }
     if (aqi <= 150) {
      return {
        status: 'Unhealthy for Sensitive Groups',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
      };
    }
    if (aqi <= 200) {
      return {
        status: 'Unhealthy',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
      };
    }
    return {
        status: 'Very Unhealthy',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        description: 'Health alert: everyone may experience more serious health effects.',
    };
};

export default function DashboardPage() {
  const firestore = useFirestore();
  
  // You can change 'living_room_sensor' to the SENSOR_ID you set in the Wokwi simulation
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
    if (isLoading || !latestReading) {
      return {
        aqi: 0,
        status: 'Loading...',
        pm25: { value: 0, unit: 'µg/m³' },
        pm10: { value: 0, unit: 'µg/m³' },
        co2: { value: 0, unit: 'ppm' },
        voc: { value: 0, unit: 'ppb' },
        virus: { value: 15, unit: 'p/m³' }, // Static for now
      };
    }
    const aqi = calculateAqi(latestReading.pm25);
    return {
      aqi,
      status: getStatusInfo(aqi).status,
      pm25: { value: latestReading.pm25, unit: 'µg/m³' },
      pm10: { value: latestReading.pm10, unit: 'µg/m³' },
      co2: { value: latestReading.co2, unit: 'ppm' },
      voc: { value: latestReading.vocs, unit: 'ppb' }, // Assuming vocs is the key
      virus: { value: 15, unit: 'p/m³' }, // Static for now
    };
  }, [latestReading, isLoading]);
  
  const statusInfo = getStatusInfo(airQualityData.aqi);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <AirQualityAlert aqi={airQualityData.aqi} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-8">
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
                <CardTitle>Overall Air Quality</CardTitle>
                <CardDescription>{isLoading ? 'Loading live data...' : statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-4 text-center md:col-span-1">
                {isLoading ? <Skeleton className="h-48 w-48 rounded-full" /> : <AqiCircle value={airQualityData.aqi} />}
                {isLoading ? <Skeleton className="h-6 w-24 rounded-full" /> : <Badge className={statusInfo.color}>{airQualityData.status}</Badge>}
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PM2.5</p>
                    {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : <p className="text-lg font-semibold">
                      {airQualityData.pm25.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.pm25.unit}
                      </span>
                    </p>}
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                     <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PM10</p>
                     {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : <p className="text-lg font-semibold">
                      {airQualityData.pm10.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.pm10.unit}
                      </span>
                    </p>}
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VOCs</p>
                    {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : <p className="text-lg font-semibold">
                      {airQualityData.voc.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.voc.unit}
                      </span>
                    </p>}
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Biohazard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Viruses</p>
                    {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : <p className="text-lg font-semibold">
                      {airQualityData.virus.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.virus.unit}
                      </span>
                    </p>}
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Beaker className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CO2</p>
                    {isLoading ? <Skeleton className="mt-1 h-7 w-20" /> : <p className="text-lg font-semibold">
                      {airQualityData.co2.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.co2.unit}
                      </span>
                    </p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <DeviceControlCard className="h-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <PredictionCard />
        <RecommendationsCard initialAirQuality={airQualityData} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
          <HistoricalDataChart sensorId={sensorId} />
      </div>
    </main>
  );
}
