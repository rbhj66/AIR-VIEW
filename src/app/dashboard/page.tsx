'use client';

import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Wind, Beaker, ArrowRight, Thermometer, Droplets } from 'lucide-react';
import AqiCircle from '@/components/dashboard/aqi-circle';
import PredictionCard from '@/components/dashboard/prediction-card';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy, Timestamp, where, doc } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AirQualityAlert from '@/components/dashboard/air-quality-alert';
import AirQualityCard from '@/components/dashboard/air-quality-card';
import { ChartDataPoint } from '@/lib/types';
import HarmfulGases from '@/components/dashboard/harmful-gases';
import { useDoc } from '@/firebase/firestore/use-doc';
import PurifiedAqiIndicator from '@/components/dashboard/purified-aqi-indicator';
import I2CDisplay from '@/components/dashboard/i2c-display';

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
  const [showPurifiedAqi, setShowPurifiedAqi] = useState(false);
  
  const sensorId = 'living_room_sensor';
  const deviceId = 'living_room_purifier';

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      where('timestamp', '>=', Timestamp.fromDate(twelveHoursAgo)),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, sensorId]);
  
  const deviceRef = useMemoFirebase(() => {
    if(!firestore) return null;
    return doc(firestore, 'air_purifier_devices', deviceId);
  }, [firestore, deviceId]);

  const { data: readings, isLoading } = useCollection(readingsQuery);
  const { data: deviceState } = useDoc(deviceRef);
  
  const latestReading = useMemo(() => readings?.[0] as any, [readings]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deviceState?.isPoweredOn) {
      // Show the purified AQI after 5 seconds of the device being on
      timer = setTimeout(() => {
        setShowPurifiedAqi(true);
      }, 5000);
    } else {
      setShowPurifiedAqi(false);
    }
    return () => clearTimeout(timer);
  }, [deviceState?.isPoweredOn]);
  
  const historicalChartData = useMemo(() => {
    if (!readings) {
      return {
        pm25: [],
        pm10: [],
        co2: [],
        vocs: [],
        temperature: [],
        humidity: [],
      };
    }
    const reversedReadings = [...readings].reverse(); // oldest first
    const data: { [key: string]: ChartDataPoint[] } = {
      pm25: [],
      pm10: [],
      co2: [],
      vocs: [],
      temperature: [],
      humidity: [],
    };
    
    reversedReadings.forEach((reading: any) => {
      const time = new Date(reading.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      data.pm25.push({ time, value: reading.pm25 });
      data.pm10.push({ time, value: reading.pm10 });
      data.co2.push({ time, value: reading.co2 });
      data.vocs.push({ time, value: reading.vocs });
      data.temperature.push({ time, value: reading.temperature });
      data.humidity.push({ time, value: reading.humidity });
    });
    return data;
  }, [readings]);


  const airQualityData = useMemo(() => {
    if (!latestReading) {
      return {
        aqi: null,
        purifiedAqi: null,
        status: 'Loading...',
        pm25: { value: null, unit: 'µg/m³' },
        pm10: { value: null, unit: 'µg/m³' },
        co2: { value: null, unit: 'ppm' },
        voc: { value: null, unit: 'ppb' },
        temperature: { value: null, unit: '°C' },
        humidity: { value: null, unit: '%' },
      };
    }
    const aqi = calculateAqi(latestReading.pm25);
    // Simulate a 40% improvement in AQI when purifier is on
    const purifiedAqi = Math.round(aqi * 0.6); 

    return {
      aqi,
      purifiedAqi,
      status: getStatusInfo(aqi).status,
      pm25: { value: latestReading.pm25, unit: 'µg/m³' },
      pm10: { value: latestReading.pm10, unit: 'µg/m³' },
      co2: { value: latestReading.co2, unit: 'ppm' },
      voc: { value: latestReading.vocs, unit: 'ppb' },
      temperature: { value: latestReading.temperature, unit: '°C' },
      humidity: { value: latestReading.humidity, unit: '%' },
    };
  }, [latestReading]);
  
  const statusInfo = getStatusInfo(airQualityData.aqi ?? 0);

  const getPollutantStatus = (pollutant: 'pm25' | 'pm10' | 'co2' | 'vocs' | 'temperature' | 'humidity', value: number | null) => {
    if (value === null) return 'Loading...';
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
    if (pollutant === 'temperature') {
      if (value >= 18 && value <= 24) return 'Comfortable';
      return 'Needs Adjustment';
    }
    if (pollutant === 'humidity') {
      if (value >= 40 && value <= 60) return 'Ideal';
      if (value < 40) return 'Low';
      return 'High';
    }
    return 'Good';
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <AirQualityAlert aqi={airQualityData.aqi ?? 0} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
         <Card>
            <CardHeader>
                <CardTitle>Overall Air Quality</CardTitle>
                <CardDescription>{isLoading ? 'Loading live data...' : statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-around gap-4">
               <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-4 text-center">
                {isLoading || airQualityData.aqi === null ? <Skeleton className="h-48 w-48 rounded-full" /> : <AqiCircle value={airQualityData.aqi} />}
                {isLoading || airQualityData.aqi === null ? <Skeleton className="h-6 w-24 rounded-full" /> : <Badge className={statusInfo.color}>{airQualityData.status}</Badge>}
              </div>

              {showPurifiedAqi && airQualityData.purifiedAqi !== null && (
                <>
                <div className="flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-muted-foreground animate-pulse" />
                </div>
                <PurifiedAqiIndicator purifiedAqi={airQualityData.purifiedAqi} />
                </>
              )}
               <I2CDisplay 
                  aqi={airQualityData.aqi}
                  pm25={airQualityData.pm25.value}
                  temperature={airQualityData.temperature.value}
                  humidity={airQualityData.humidity.value}
                  isLoading={isLoading} 
                />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Live Sensor Simulation</CardTitle>
                <CardDescription>This is a live Wokwi simulation of an ESP32 microcontroller.</CardDescription>
            </CardHeader>
             <CardContent>
              <div className="aspect-[4/3] w-full">
                <iframe
                  src="https://wokwi.com/projects/393138883758206977?embed=1"
                  className="h-full w-full rounded-md border"
                  allow="autoplay; encrypted-media"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                ></iframe>
              </div>
            </CardContent>
          </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <DeviceControlCard className="h-full" />
      </div>
        
       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 lg:gap-8">
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
            <AirQualityCard
              title="Temperature"
              value={airQualityData.temperature.value}
              unit={airQualityData.temperature.unit}
              icon={<Thermometer />}
              status={getPollutantStatus('temperature', airQualityData.temperature.value)}
              chartData={historicalChartData.temperature || []}
            />
             <AirQualityCard
              title="Humidity"
              value={airQualityData.humidity.value}
              unit={airQualityData.humidity.unit}
              icon={<Droplets />}
              status={getPollutantStatus('humidity', airQualityData.humidity.value)}
              chartData={historicalChartData.humidity || []}
            />
          </>
        </div>
        
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <HarmfulGases
          isLoading={isLoading}
          co2={airQualityData.co2.value}
          vocs={airQualityData.voc.value}
        />
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
