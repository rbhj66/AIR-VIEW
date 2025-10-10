
import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Beaker, Wind, ShieldAlert, CheckCircle } from 'lucide-react';

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
};

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'good':
      return {
        icon: <CheckCircle className="h-10 w-10 text-green-500" />,
        color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
      };
    case 'moderate':
      return {
        icon: <ShieldAlert className="h-10 w-10 text-yellow-500" />,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        description: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern.',
      };
    default:
      return {
        icon: <ShieldAlert className="h-10 w-10 text-yellow-500" />,
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
            <CardContent className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center md:col-span-1 md:border-r">
                {statusInfo.icon}
                <div className="text-5xl font-bold tracking-tight">{airQualityData.aqi}</div>
                <div className="text-lg font-medium">AQI</div>
                <Badge className={statusInfo.color}>{airQualityData.status}</Badge>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
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
                    <Beaker className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CO₂</p>
                    <p className="text-lg font-semibold">
                      {airQualityData.co2.value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        {airQualityData.co2.unit}
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
