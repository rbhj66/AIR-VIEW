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
import {
  Flame,
  Thermometer,
  Wind,
  Cloud,
  Droplets,
  Molecule,
} from 'lucide-react';
import AirQualityCard from '@/components/dashboard/air-quality-card';
import type { ChartDataPoint } from '@/lib/types';
import DeviceControlCard from '@/components/dashboard/device-control-card';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AqiCircle from '@/components/dashboard/aqi-circle';
import { Skeleton } from '@/components/ui/skeleton';
import HarmfulGases from '@/components/dashboard/harmful-gases';
import AirQualityAlert from '@/components/dashboard/air-quality-alert';
import I2CDisplay from '@/components/dashboard/i2c-display';
import PurifiedAqiIndicator from '@/components/dashboard/purified-aqi-indicator';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number) => {
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

const getStatus = (
  value: number,
  thresholds: { good: number; moderate: number }
) => {
  if (value <= thresholds.good) return 'Good';
  if (value <= thresholds.moderate) return 'Moderate';
  return 'Poor';
};

const getTemperatureStatus = (temp: number) => {
  if (temp >= 20 && temp <= 25) return 'Comfortable';
  if (temp > 25) return 'Hot';
  return 'Cold';
};

const getHumidityStatus = (humidity: number) => {
  if (humidity >= 40 && humidity <= 60) return 'Ideal';
  if (humidity > 60) return 'High';
  return 'Low';
};

export default function DashboardPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, sensorId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);

  const latestReading = useMemo(() => (readings?.[0] as any) || null, [readings]);

  const airQualityData = useMemo(() => {
    const dataPoints: Record<string, ChartDataPoint[]> = {
      pm25: [],
      pm10: [],
      co2: [],
      voc: [],
      temperature: [],
      humidity: [],
    };

    if (readings) {
      readings.slice(0, 10).reverse().forEach((r: any) => {
        const time = new Date(r.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        dataPoints.pm25.push({ time, value: r.pm25 });
        dataPoints.pm10.push({ time, value: r.pm10 });
        dataPoints.co2.push({ time, value: r.co2 });
        dataPoints.voc.push({ time, value: r.vocs });
        dataPoints.temperature.push({ time, value: r.temperature });
        dataPoints.humidity.push({ time, value: r.humidity });
      });
    }
    
    const pm25 = latestReading?.pm25 ?? null;
    const pm10 = latestReading?.pm10 ?? null;
    const co2 = latestReading?.co2 ?? null;
    const voc = latestReading?.vocs ?? null;
    const temperature = latestReading?.temperature ?? null;
    const humidity = latestReading?.humidity ?? null;

    const aqi = pm25 !== null ? calculateAqi(pm25) : null;
    const purifiedAqi = aqi !== null ? Math.round(aqi * 0.6) : null;
    
    return {
      aqi: { value: aqi, status: aqi !== null ? getStatus(aqi, { good: 50, moderate: 100 }) : 'Loading'},
      purifiedAqi: { value: purifiedAqi },
      pm25: { value: pm25, chartData: dataPoints.pm25, status: pm25 !== null ? getStatus(pm25, { good: 12, moderate: 35 }) : 'Loading' },
      pm10: { value: pm10, chartData: dataPoints.pm10, status: pm10 !== null ? getStatus(pm10, { good: 54, moderate: 154 }) : 'Loading' },
      co2: { value: co2, chartData: dataPoints.co2, status: co2 !== null ? getStatus(co2, { good: 1000, moderate: 2000 }) : 'Loading' },
      voc: { value: voc, chartData: dataPoints.voc, status: voc !== null ? getStatus(voc, { good: 300, moderate: 500 }) : 'Loading' },
      temperature: { value: temperature, chartData: dataPoints.temperature, status: temperature !== null ? getTemperatureStatus(temperature) : 'Loading' },
      humidity: { value: humidity, chartData: dataPoints.humidity, status: humidity !== null ? getHumidityStatus(humidity) : 'Loading' },
    };
  }, [readings, latestReading]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      {airQualityData.aqi.value !== null && (
         <AirQualityAlert aqi={airQualityData.aqi.value} isLoading={isLoading} />
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overall Air Quality</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-12 sm:text-left">
            {isLoading || airQualityData.aqi.value === null ? (
              <Skeleton className="h-48 w-48 rounded-full" />
            ) : (
              <AqiCircle value={airQualityData.aqi.value} />
            )}
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-48" /> : airQualityData.aqi.status}
              </h3>
              <div className="text-muted-foreground">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  `Live AQI is ${airQualityData.aqi.value}. The air quality is currently considered ${airQualityData.aqi.status.toLowerCase()}.`
                )}
              </div>
            </div>
            {isLoading || airQualityData.purifiedAqi.value === null ? (
                <Skeleton className="h-48 w-32" />
            ) : (
                <PurifiedAqiIndicator purifiedAqi={airQualityData.purifiedAqi.value} />
            )}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
           <DeviceControlCard />
           <I2CDisplay 
            aqi={airQualityData.aqi.value}
            pm25={airQualityData.pm25.value}
            temperature={airQualityData.temperature.value}
            humidity={airQualityData.humidity.value}
            isLoading={isLoading}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <AirQualityCard
          title="PM2.5"
          value={airQualityData.pm25.value}
          unit="µg/m³"
          icon={<Wind />}
          status={airQualityData.pm25.status}
          chartData={airQualityData.pm25.chartData}
        />
        <AirQualityCard
          title="PM10"
          value={airQualityData.pm10.value}
          unit="µg/m³"
          icon={<Cloud />}
          status={airQualityData.pm10.status}
          chartData={airQualityData.pm10.chartData}
        />
        <AirQualityCard
          title="Temperature"
          value={airQualityData.temperature.value}
          unit="°C"
          icon={<Thermometer />}
          status={airQualityData.temperature.status}
          chartData={airQualityData.temperature.chartData}
        />
        <AirQualityCard
          title="Humidity"
          value={airQualityData.humidity.value}
          unit="%"
          icon={<Droplets />}
          status={airQualityData.humidity.status}
          chartData={airQualityData.humidity.chartData}
        />
        <HarmfulGases isLoading={isLoading} co2={airQualityData.co2.value} vocs={airQualityData.voc.value} />
      </div>
       <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        <HistoricalDataChart className="lg:col-span-3" sensorId={sensorId} />
        <RecommendationsCard
            className="lg:col-span-2"
            initialAirQuality={airQualityData}
        />
       </div>
    </main>
  );
}
