'use client';

import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Wind, Beaker } from 'lucide-react';
import AqiCircle from '@/components/dashboard/aqi-circle';
import PredictionCard from '@/components/dashboard/prediction-card';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AirQualityAlert from '@/components/dashboard/air-quality-alert';
import AirQualityCard from '@/components/dashboard/air-quality-card';
import { ChartDataPoint } from '@/lib/types';

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
  
  const sensorId = 'living_room_sensor';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(twelveHoursAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);
  
  const latestReading = useMemo(() => readings?.[0] as any, [readings]);
  
  const historicalChartData = useMemo(() => {
    if (!readings) return {};
    const reversedReadings = [...readings].reverse(); // oldest first
    const data: { [key: string]: ChartDataPoint[] } = {
      pm25: [],
      pm10: [],
      co2: [],
      vocs: [],
    };
    
    reversedReadings.forEach((reading: any) => {
      const time = new Date(reading.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      data.pm25.push({ time, value: reading.pm25 });
      data.pm10.push({ time, value: reading.pm10 });
      data.co2.push({ time, value: reading.co2 });
      data.vocs.push({ time, value: reading.vocs });
    });
    return data;
  }, [readings]);


  const airQualityData = useMemo(() => {
    if (isLoading || !latestReading) {
      return {
        aqi: 0,
        status: 'Loading...',
        pm25: { value: 0, unit: 'µg/m³' },
        pm10: { value: 0, unit: 'µg/m³' },
        co2: { value: 0, unit: 'ppm' },
        voc: { value: 0, unit: 'ppb' },
      };
    }
    const aqi = calculateAqi(latestReading.pm25);
    return {
      aqi,
      status: getStatusInfo(aqi).status,
      pm25: { value: latestReading.pm25, unit: 'µg/m³' },
      pm10: { value: latestReading.pm10, unit: 'µg/m³' },
      co2: { value: latestReading.co2, unit: 'ppm' },
      voc: { value: latestReading.vocs, unit: 'ppb' },
    };
  }, [latestReading, isLoading]);
  
  const statusInfo = getStatusInfo(airQualityData.aqi);

  const getPollutantStatus = (pollutant: 'pm25' | 'pm10' | 'co2' | 'vocs', value: number) => {
    // Simplified status logic for individual pollutants
    if (pollutant === 'pm25') {
      if (value <= 12) return 'Good';
      if (value <= 35.4) return 'Moderate';
      return 'Unhealthy';
    }
    if (pollutant === 'pm10') {
      if (value <= 54) return 'Good';
      if (value <= 154) return 'Moderate';
      return 'Unhealthy';
    }
     if (pollutant === 'co2') {
      if (value <= 1000) return 'Excellent';
      if (value <= 2000) return 'Good';
      return 'Poor';
    }
     if (pollutant === 'vocs') {
      if (value <= 250) return 'Excellent';
      if (value <= 500) return 'Good';
      return 'Poor';
    }
    return 'Good';
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <AirQualityAlert aqi={airQualityData.aqi} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
         <Card>
            <CardHeader>
                <CardTitle>Overall Air Quality</CardTitle>
                <CardDescription>{isLoading ? 'Loading live data...' : statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-8">
               <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-4 text-center">
                {isLoading ? <Skeleton className="h-48 w-48 rounded-full" /> : <AqiCircle value={airQualityData.aqi} />}
                {isLoading ? <Skeleton className="h-6 w-24 rounded-full" /> : <Badge className={statusInfo.color}>{airQualityData.status}</Badge>}
              </div>
            </CardContent>
          </Card>
          <DeviceControlCard className="h-full" />
      </div>

       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {isLoading ? (
            <>
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
            </>
          ) : (
            <>
              <AirQualityCard
                title="PM2.5"
                value={airQualityData.pm25.value}
                unit={airQualityData.pm25.unit}
                icon={<Wind />}
                status={getPollutantStatus('pm25', airQualityData.pm25.value)}
                chartData={historicalChartData.pm25 || []}
              />
              <AirQualityCard
                title="PM10"
                value={airQualityData.pm10.value}
                unit={airQualityData.pm10.unit}
                icon={<Wind />}
                status={getPollutantStatus('pm10', airQualityData.pm10.value)}
                chartData={historicalChartData.pm10 || []}
              />
              <AirQualityCard
                title="CO2"
                value={airQualityData.co2.value}
                unit={airQualityData.co2.unit}
                icon={<Beaker />}
                status={getPollutantStatus('co2', airQualityData.co2.value)}
                chartData={historicalChartData.co2 || []}
              />
              <AirQualityCard
                title="VOCs"
                value={airQualityData.voc.value}
                unit={airQualityData.voc.unit}
                icon={<FlaskConical />}
                status={getPollutantStatus('vocs', airQualityData.voc.value)}
                chartData={historicalChartData.vocs || []}
              />
            </>
          )}
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
