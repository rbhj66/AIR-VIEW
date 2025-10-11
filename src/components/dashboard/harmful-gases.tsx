'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FlaskConical, Cloud } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { useMemo } from 'react';

interface HarmfulGasesProps {
  isLoading: boolean;
  co2: { value: number | null; history: ChartDataPoint[] };
  vocs: { value: number | null; history: ChartDataPoint[] };
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
            return Array.from({ length: 10 }, (_, i) => ({ time: i.toString(), value: 0 }));
        }
        return data;
    }, [data]);

    return (
        <ChartContainer config={{}} className="h-10 w-full">
            <AreaChart accessibilityLayer data={chartData}>
                 <defs>
                    <linearGradient id="mini-chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
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
}

export default function HarmfulGases({
  isLoading,
  co2,
  vocs,
}: HarmfulGasesProps) {
  const co2Status = getStatus(co2.value, { good: 1000, moderate: 2000 });
  const vocsStatus = getStatus(vocs.value, { good: 300, moderate: 500 });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Air Pollutants</CardTitle>
        <CardDescription>
          Levels of common harmful gases in your environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">CO₂</p>
                    {isLoading ? (
                    <>
                        <Skeleton className="mt-1 h-7 w-20" />
                        <Skeleton className="mt-1 h-4 w-12" />
                    </>
                    ) : (
                    <>
                        <p className="text-2xl font-bold">{co2.value} ppm</p>
                        <p className="text-sm text-muted-foreground">{co2Status}</p>
                    </>
                    )}
                </div>
            </div>
            {isLoading ? <Skeleton className="h-10 w-full" /> : <MiniChart data={co2.history} />}
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4">
           <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">VOCs</p>
                    {isLoading ? (
                    <>
                        <Skeleton className="mt-1 h-7 w-20" />
                        <Skeleton className="mt-1 h-4 w-12" />
                    </>
                    ) : (
                    <>
                        <p className="text-2xl font-bold">{vocs.value} ppb</p>
                        <p className="text-sm text-muted-foreground">{vocsStatus}</p>
                    </>
                    )}
                </div>
           </div>
           {isLoading ? <Skeleton className="h-10 w-full" /> : <MiniChart data={vocs.history} />}
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-muted/30 p-4">
          <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <O2Icon />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Oxygen</p>
                {isLoading ? (
                  <>
                    <Skeleton className="mt-1 h-7 w-20" />
                    <Skeleton className="mt-1 h-4 w-12" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold">20.9%</p>
                    <p className="text-sm text-muted-foreground">Normal</p>
                  </>
                )}
              </div>
          </div>
          {/* Oxygen history is constant, so we don't need a real chart, but a skeleton for loading looks good */}
          {isLoading && <Skeleton className="h-10 w-full" />}
        </div>
      </CardContent>
    </Card>
  );
}
