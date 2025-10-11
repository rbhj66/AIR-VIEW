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

interface HarmfulGasesProps {
  isLoading: boolean;
  co2: number | null;
  vocs: number | null;
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

export default function HarmfulGases({
  isLoading,
  co2,
  vocs,
}: HarmfulGasesProps) {
  const co2Status = getStatus(co2, { good: 1000, moderate: 2000 });
  const vocsStatus = getStatus(vocs, { good: 300, moderate: 500 });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Air Pollutants</CardTitle>
        <CardDescription>
          Levels of common harmful gases in your environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
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
                <p className="text-2xl font-bold">{co2} ppm</p>
                <p className="text-sm text-muted-foreground">{co2Status}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
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
                <p className="text-2xl font-bold">{vocs} ppb</p>
                <p className="text-sm text-muted-foreground">{vocsStatus}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-lg bg-muted/30 p-4">
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
      </CardContent>
    </Card>
  );
}
