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
import { FlaskConical, Cloud } from 'lucide-react';
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

const O2Icon = () => (
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
    className="h-6 w-6 text-primary"
  >
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 2a10 10 0 1 0-10 10" />
    <path d="m13 14-4-4" />
    <path d="m9 14 4-4" />
    <path d="M15.5 13a.5.5 0 0 0 0-1" />
    <path d="M15.5 13a.5.5 0 0 1 0-1" />
    <path d="M18.5 16.5a.5.5 0 0 0 0-1" />
    <path d="M18.5 16.5a.5.5 0 0 1 0-1" />
  </svg>
);

const MiniChart = ({ data }: { data: ChartDataPoint[] }) => {
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
    <ChartContainer config={{}} className="h-10 w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="mini-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural"
          fill="url(#mini-chart-fill)"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
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
            <div className="cursor-pointer flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4 transition-all hover:ring-2 hover:ring-primary">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="mt-2 h-4 w-12" />
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold">CO₂</p>
                       <p className="text-sm text-muted-foreground">
                        <span className='font-semibold'>{co2.value ?? '--'}</span> ppm
                      </p>
                      <Badge variant="outline" className="mt-1">{co2Status}</Badge>
                    </>
                  )}
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <MiniChart data={co2.history} />
              )}
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Carbon Dioxide (CO₂) Information</DialogTitle>
              <DialogDescription>
                CO₂ is a common indoor air pollutant exhaled by humans. High
                levels can indicate poor ventilation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>Current Reading: <Badge variant="secondary">{co2.value} ppm</Badge></p>
              <Separator />
              <h4 className="font-semibold">Health Guidelines</h4>
               <ul className="space-y-2">
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
            <div className="cursor-pointer flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4 transition-all hover:ring-2 hover:ring-primary">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="mt-2 h-4 w-12" />
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold">VOCs</p>
                      <p className="text-sm text-muted-foreground">
                        <span className='font-semibold'>{vocs.value ?? '--'}</span> ppb
                      </p>
                       <Badge variant="outline" className="mt-1">{vocsStatus}</Badge>
                    </>
                  )}
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <MiniChart data={vocs.history} />
              )}
            </div>
          </DialogTrigger>
          <DialogContent>
             <DialogHeader>
              <DialogTitle>Volatile Organic Compounds (VOCs)</DialogTitle>
              <DialogDescription>
                VOCs are emitted by a wide array of products, including paints, cleaning supplies, and furniture.
              </DialogDescription>
            </DialogHeader>
             <div className="space-y-4">
              <p>Current Reading: <Badge variant="secondary">{vocs.value} ppb</Badge></p>
              <Separator />
              <h4 className="font-semibold">Health Guidelines</h4>
              <ul className="space-y-2">
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
                    <O2Icon />
                  </div>
                  <div className='flex-1'>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="mt-2 h-4 w-12" />
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-bold">O₂</p>
                        <p className="text-sm text-muted-foreground">
                          <span className='font-semibold'>20.9</span> %
                        </p>
                        <Badge variant="outline" className="mt-1">Normal</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
                {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <div className="h-10 w-full" /> 
                )}
            </div>
          </DialogTrigger>
          <DialogContent>
             <DialogHeader>
              <DialogTitle>Oxygen (O₂)</DialogTitle>
              <DialogDescription>
                Oxygen is essential for life. Earth's atmosphere is about 21% oxygen.
              </DialogDescription>
            </DialogHeader>
             <div className="space-y-4">
                <p>Normal Level: <Badge variant="secondary">~20.9%</Badge></p>
                <Separator />
                <h4 className="font-semibold">Information</h4>
                <p className='text-sm text-muted-foreground'>Indoor oxygen levels are typically stable and very close to outdoor levels. Significant drops are rare in normal residential environments. This reading is a standard placeholder, as most consumer-grade air quality sensors do not measure oxygen.</p>
                <Separator />
                <h4 className="font-semibold">Impact on Children</h4>
                <p className='text-sm text-muted-foreground'>Normal oxygen levels are critical for healthy development. Ensuring good overall air quality and ventilation helps maintain these levels.</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
