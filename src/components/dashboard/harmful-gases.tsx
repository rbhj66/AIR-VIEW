'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface HarmfulGasesProps {
  isLoading: boolean;
  co2: number;
  vocs: number;
}

// Thresholds for "Poor" air quality for sensitive groups like children
const CO2_POOR_THRESHOLD = 2000; // ppm
const VOCS_POOR_THRESHOLD = 500; // ppb

const GasIndicator = ({
  name,
  value,
  unit,
  threshold,
  isLoading,
}: {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  isLoading: boolean;
}) => {
  const percentage = isLoading ? 0 : Math.min((value / threshold) * 100, 100);
  const isHarmful = value >= threshold;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
           <Skeleton className="h-5 w-48" />
           <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-32 ml-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div className="flex items-center gap-2">
            {isHarmful && <AlertTriangle className="h-4 w-4 text-destructive" />}
            <span className="font-semibold">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {value} {unit}
        </span>
      </div>
      <Progress value={percentage} />
      <div className="text-xs text-muted-foreground text-right">
        {Math.round(percentage)}% of concerning level
      </div>
    </div>
  );
};


export default function HarmfulGases({ isLoading, co2, vocs }: HarmfulGasesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hazardous Gases for Children</CardTitle>
        <CardDescription>
          Shows the percentage of gases relative to levels considered poor for
          sensitive groups.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GasIndicator
          name="Carbon Dioxide (CO2)"
          value={co2}
          unit="ppm"
          threshold={CO2_POOR_THRESHOLD}
          isLoading={isLoading}
        />
        <GasIndicator
          name="Volatile Organic Compounds (VOCs)"
          value={vocs}
          unit="ppb"
          threshold={VOCS_POOR_THRESHOLD}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
