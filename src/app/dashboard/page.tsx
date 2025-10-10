

import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Wind, Biohazard } from 'lucide-react';
import AqiCircle from '@/components/dashboard/aqi-circle';


const airQualityData = {
  aqi: 78,
  status: 'Moderate',
  pm25: {
    value: 12.5,
    unit: 'µg/m³',
  },
  pm10: {
    value: 25,
    unit: 'µg/m³',
  },
  co2: {
    value: 450,
    unit: 'ppm',
  },
  voc: {
    value: 75,
    unit: 'ppb',
  },
  virus: {
    value: 15,
    unit: 'p/m³',
  },
};

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'good':
      return {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      };
    case 'moderate':
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        description: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern.',
      };
    default:
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        description: 'Air quality is acceptable.',
      };
  }
};

export default function DashboardPage() {
  const statusInfo = getStatusInfo(airQualityData.status);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-8">
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
                <CardTitle>Overall Air Quality</CardTitle>
                <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg p-4 text-center md:col-span-1">
                <AqiCircle value={airQualityData.aqi} />
                <Badge className={statusInfo.color}>{airQualityData.status}</Badge>
              </div>
              <div className="col-span-1 grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PM2.5</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.pm25.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.pm25.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                     <Wind className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PM10</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.pm10.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.pm10.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">VOCs</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.voc.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.voc.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Biohazard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Viruses</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.virus.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.virus.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M6 15h4" />
                      <path d="M9 12v6" />
                      <path d="M15 12h4" />
                      <path d="M15 9v6" />
                      <path d="M12 9h.01" />
                      <path d="M4.5 10.5c-2.4 1.5-4 4-4.5 7.5h21c-.5-3.5-2.1-6-4.5-7.5" />
                      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-1A2.5 2.5 0 0 0 9 6.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CO2</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.co2.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.co2.unit}
                      </span>
                    </p>
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
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
          <HistoricalDataChart />
      </div>
    </main>
  );
}
