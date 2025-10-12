
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { FlaskConical, Cloud, Bug } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { ChartContainer } from '../ui/chart';
import { Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface HarmfulGasesProps {
  isLoading: boolean;
  co2: { value: number | null; history: ChartDataPoint[] };
  vocs: { value: number | null; history: ChartDataPoint[] };
  className?: string;
}

const getStatus = (
  value: number | null,
  thresholds: { good: number; moderate: number }
) => {
  if (value === null) return 'Loading';
  if (value <= thresholds.good) return 'Good';
  if (value <= thresholds.moderate) return 'Moderate';
  return 'Poor';
};

const levels = {
  co2: [
    { level: 'Good', range: '< 1000 ppm', description: 'Normal, well-ventilated spaces.' },
    { level: 'Moderate', range: '1000 - 2000 ppm', description: 'Indicates potential ventilation issues; may cause drowsiness.' },
    { level: 'Poor', range: '> 2000 ppm', description: 'Stale air; can lead to headaches and poor concentration.' },
  ],
  vocs: [
    { level: 'Good', range: '< 300 ppb', description: 'Low concentration, typically safe.' },
    { level: 'Moderate', range: '300 - 500 ppb', description: 'May cause minor irritation for sensitive individuals.' },
    { level: 'Poor', range: '> 500 ppb', description: 'Can cause eye, nose, and throat irritation, and headaches.' },
  ],
};

const MiniChart = ({ data, color }: { data: ChartDataPoint[], color: string }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) {
      // Provide some dummy data for skeleton
      return Array.from({ length: 10 }, (_, i) => ({
        time: i.toString(),
        value: 0,
      }));
    }
    return data;
  }, [data]);

  return (
    <ChartContainer config={{}} className="h-[70px] w-full -ml-4 -mr-2 -mb-4">
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id={`mini-chart-fill-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-${color})`}
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor={`var(--color-${color})`}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#mini-chart-fill-${color})`}
          stroke={`var(--color-${color})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
};


export default function HarmfulGases({
  isLoading,
  co2,
  vocs,
  className
}: HarmfulGasesProps) {
  const co2Status = getStatus(co2.value, { good: 1000, moderate: 2000 });
  const vocsStatus = getStatus(vocs.value, { good: 300, moderate: 500 });
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Common Air Pollutants</CardTitle>
        <CardDescription>
          Levels of common harmful gases in your environment. Click on a card
          for more details.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer overflow-hidden flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4 transition-all hover:ring-2 hover:ring-primary">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-muted-foreground">CO₂</p>
                   {isLoading ? (
                      <Skeleton className="h-7 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {co2.value ?? '--'} <span className="text-lg font-medium text-muted-foreground">ppm</span>
                    </p>
                  )}
                  <Badge variant="outline">{co2Status}</Badge>
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-[70px] w-full" />
              ) : (
                <MiniChart data={co2.history} color="chart-1" />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Carbon Dioxide (CO₂) Information</DialogTitle>
              <DialogDescription>
                CO₂ is a common indoor air pollutant exhaled by humans. High
                levels can indicate poor ventilation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
               <div className="h-48 w-full">
                <MiniChart data={co2.history} color="chart-1" />
              </div>
              <p>Current Reading: <Badge variant="secondary">{co2.value} ppm ({co2Status})</Badge></p>
              <Separator />
              <h4 className="font-semibold">Health Guidelines</h4>
               <ul className="space-y-2 text-sm">
                {levels.co2.map(item => (
                  <li key={item.level}><Badge variant="outline">{item.level}</Badge> ({item.range}): {item.description}</li>
                ))}
              </ul>
              <Separator />
              <h4 className="font-semibold">Impact on Children</h4>
              <p className="text-sm text-muted-foreground">
                Children are more vulnerable to high CO₂ levels. It can affect
                their concentration and learning in school environments and
                cause discomfort in poorly ventilated rooms.
              </p>
               <Separator />
              <h4 className="font-semibold">Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                To reduce CO₂ levels, increase ventilation by opening windows or using mechanical ventilation systems.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer overflow-hidden flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4 transition-all hover:ring-2 hover:ring-primary">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                 <div className="flex-1 space-y-1">
                  <p className="font-semibold text-muted-foreground">VOCs</p>
                  {isLoading ? (
                    <Skeleton className="h-7 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {vocs.value ?? '--'} <span className="text-lg font-medium text-muted-foreground">ppb</span>
                    </p>
                  )}
                  <Badge variant="outline">{vocsStatus}</Badge>
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-[70px] w-full" />
              ) : (
                <MiniChart data={vocs.history} color="chart-2" />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
             <DialogHeader>
              <DialogTitle>Volatile Organic Compounds (VOCs)</DialogTitle>
              <DialogDescription>
                VOCs are emitted by a wide array of products, including paints, cleaning supplies, and furniture.
              </DialogDescription>
            </DialogHeader>
             <div className="space-y-4">
              <div className="h-48 w-full">
                <MiniChart data={vocs.history} color="chart-2" />
              </div>
              <p>Current Reading: <Badge variant="secondary">{vocs.value} ppb ({vocsStatus})</Badge></p>
              <Separator />
              <h4 className="font-semibold">Health Guidelines</h4>
              <ul className="space-y-2 text-sm">
                {levels.vocs.map(item => (
                  <li key={item.level}><Badge variant="outline">{item.level}</Badge> ({item.range}): {item.description}</li>
                ))}
              </ul>
              <Separator />
              <h4 className="font-semibold">Impact on Children</h4>
              <p className="text-sm text-muted-foreground">
                Children's developing bodies can be more susceptible to VOCs, which can exacerbate asthma and allergies. Long-term exposure is a concern.
              </p>
              <Separator />
              <h4 className="font-semibold">Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                Use low-VOC products, ensure good ventilation when using cleaning agents, and use an air purifier with a carbon filter.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4 transition-all hover:ring-2 hover:ring-primary">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bug className="h-6 w-6 text-primary" />
                  </div>
                   <div className="flex-1 space-y-1">
                    <p className="font-semibold text-muted-foreground">Viruses</p>
                    <p className="text-2xl font-bold">Info</p>
                    <Badge variant="outline">Learn More</Badge>
                  </div>
                </div>
              </div>
              <div className="h-[70px] w-full" /> 
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
             <DialogHeader>
              <DialogTitle>Airborne Viruses & Pathogens</DialogTitle>
              <DialogDescription>
                Good ventilation and air purification can help reduce the concentration of airborne pathogens like viruses (e.g., influenza, COVID-19).
              </DialogDescription>
            </DialogHeader>
             <div className="space-y-4">
                <Separator />
                <h4 className="font-semibold">How it Spreads</h4>
                <p className='text-sm text-muted-foreground'>Viruses can travel on tiny airborne particles (aerosols) that are released when people breathe, talk, or cough. In poorly ventilated areas, these aerosols can remain suspended in the air for hours, increasing the risk of transmission.</p>
                <Separator />
                <h4 className="font-semibold">Impact on Children</h4>
                <p className='text-sm text-muted-foreground'>Children, especially in group settings like schools and daycares, are highly susceptible to respiratory viruses. Their immune systems are still developing, and they tend to have closer contact, increasing transmission risk.</p>
                <Separator />
                <h4 className="font-semibold">Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    <li><span className="font-semibold">Increase Ventilation:</span> Open windows and doors to bring in fresh outdoor air.</li>
                    <li><span className="font-semibold">Use Air Purifiers:</span> Run a purifier with a HEPA filter, which is effective at capturing virus-sized particles.</li>
                    <li><span className="font-semibold">Control Humidity:</span> Maintain indoor humidity between 40-60%. Viruses survive less effectively in this range.</li>
                </ul>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
