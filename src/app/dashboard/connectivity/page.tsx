
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, Rocket, Rss, View, Copy } from 'lucide-react';
import HardwareDiagram from '@/components/dashboard/hardware-diagram';
import { firebaseConfig } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
import AqiCircle from '@/components/dashboard/aqi-circle';
import { Skeleton } from '@/components/ui/skeleton';
import PurifiedAqiIndicator from '@/components/dashboard/purified-aqi-indicator';
import DeviceControlCard from '@/components/dashboard/device-control-card';
import I2CDisplay from '@/components/dashboard/i2c-display';

const CredentialDisplay = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: 'Copied to clipboard!',
      description: `${label} has been copied.`,
    });
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <code className="font-mono">{value}</code>
      </div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

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


export default function ConnectivityPage() {
  const firestore = useFirestore();
  const sensorId = 'living_room_sensor';
  const [mockTick, setMockTick] = useState(0);

  const readingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'sensors', sensorId, 'readings'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, sensorId]);
  
  const { data: readings, isLoading } = useCollection(readingsQuery);
  const latestReading = useMemo(() => (readings?.[0] as any) || null, [readings]);
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
    // If we have live data, use it
    if (isDataAvailable) {
      const pm25 = latestReading?.pm25 ?? 0;
      const temperature = latestReading?.temperature ?? 0;
      const humidity = latestReading?.humidity ?? 0;
      const aqi = calculateAqi(pm25);
      const purifiedAqi = Math.round(aqi * 0.6);

      return {
        aqi: { value: aqi, status: getStatus(aqi, { good: 50, moderate: 100 }) },
        purifiedAqi: { value: purifiedAqi },
        pm25: { value: pm25 },
        temperature: { value: temperature },
        humidity: { value: humidity },
        isLoading: false,
      };
    }

    // Otherwise, generate changing mock data
    const basePm25 = 10 + (Math.sin(mockTick * 0.5) * 5); // Fluctuates between 5 and 15
    const mockPm25 = parseFloat(basePm25.toFixed(1));
    const mockAqi = calculateAqi(mockPm25);
    
    return {
        aqi: { value: mockAqi, status: getStatus(mockAqi, { good: 50, moderate: 100 })},
        purifiedAqi: { value: Math.round(mockAqi * 0.6) },
        pm25: { value: mockPm25 },
        temperature: { value: parseFloat((21 + Math.sin(mockTick * 0.2)).toFixed(1)) },
        humidity: { value: parseFloat((45 + Math.cos(mockTick * 0.3) * 5).toFixed(1)) },
        isLoading: true, // Treat as loading to show skeletons initially
    };
  }, [latestReading, isDataAvailable, mockTick]);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss className="text-primary" />
                Live Sensor Simulation
              </CardTitle>
              <CardDescription>
                This is a live Wokwi simulation of an ESP32 microcontroller with
                air quality sensors. Follow the steps on the right to connect it
                to your project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] w-full">
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Sensor</CardTitle>
              <CardDescription>
                Follow these steps to link the simulation to your Firebase
                project and see live data on your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border-2 border-primary bg-primary/10 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <FileCode className="h-5 w-5" />
                </div>
                <div className="w-full space-y-2">
                  <div className="font-semibold">Step 1: Configure Credentials</div>
                  <div className="text-sm text-muted-foreground">
                    Copy your Firebase project details below and paste them into
                    the <Badge variant="outline">secrets.h</Badge> tab in the
                    Wokwi simulation.
                  </div>
                  <div className="space-y-2 rounded-md bg-background/50 p-2">
                    <CredentialDisplay
                      label="Project ID"
                      value={firebaseConfig.projectId}
                    />
                    <CredentialDisplay
                      label="API Key"
                      value={firebaseConfig.apiKey}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Step 2: Run the Simulation</p>
                  <p className="text-sm text-muted-foreground">
                    Click the green "play" button in the Wokwi simulation.
                    Sensor readings will appear in the serial monitor as it
                    connects.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <View className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Step 3: View Live Data</p>
                  <p className="text-sm text-muted-foreground">
                    Your live data will appear below as soon as the simulation is running.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Simulation Output</CardTitle>
             <CardDescription>
                This section displays the real-time data coming from your Wokwi sensor simulation.
              </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-12 sm:text-left">
            {!airQualityData.aqi.value ? (
              <Skeleton className="h-48 w-48 rounded-full" />
            ) : (
              <AqiCircle value={airQualityData.aqi.value} />
            )}
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">
                {airQualityData.isLoading ? <Skeleton className="h-8 w-48" /> : airQualityData.aqi.status}
              </h3>
              <div className="text-muted-foreground">
                {airQualityData.isLoading ? (
                  <div className="space-y-2">
                    <p>Waiting for live sensor data...</p>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                   `Live AQI is ${airQualityData.aqi.value}. The air quality is currently considered ${airQualityData.aqi.status?.toLowerCase()}.`
                )}
              </div>
            </div>
            {!airQualityData.purifiedAqi.value ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center">
                 <Skeleton className="h-32 w-32 rounded-full" />
                 <div className='flex flex-col gap-1 items-center w-full'>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-12" />
                 </div>
              </div>
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
            isLoading={airQualityData.isLoading && !isDataAvailable}
           />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>How It Works: From Sensor to Screen</CardTitle>
          <CardDescription>
            The diagram below illustrates how data flows from the physical
            sensors in the Wokwi simulation to your dashboard. The{' '}
            <strong>MQ-135</strong> and other sensors measure pollutants, the{' '}
            <strong>ESP32</strong> processes this data, and then it's sent to{' '}
            <strong>Firebase</strong>. Your app reads from Firebase to display
            the live <strong>AQI level</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HardwareDiagram />
        </CardContent>
      </Card>
    </main>
  );
}
