'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Area, AreaChart, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';
import type { ChartDataPoint } from '@/lib/types';
import { AlertTriangle, FlaskConical, Wind, Thermometer, Droplets, Cloud, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface GasData {
    value: number | null;
    history: ChartDataPoint[];
}
interface HarmfulGasesProps {
  isLoading: boolean;
  co2Data: GasData;
  vocsData: GasData;
}

const GasIndicator = ({
  name,
  formula,
  data,
  unit,
  threshold,
  isLoading,
  chartColor,
}: {
  name: string;
  formula: string;
  data: GasData;
  unit: string;
  threshold: number;
  isLoading: boolean;
  chartColor: string;
}) => {
  const isDataLoading = isLoading || data.value === null;
  const isHarmful = !isDataLoading && data.value >= threshold;

  const chartConfig = {
    value: {
        label: name,
        color: chartColor,
    },
  };

  if (isDataLoading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
           <Skeleton className="h-5 w-48" />
           <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-20 w-full" />
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
        <span className="text-sm font-semibold">
          {data.value} <span className='text-xs font-normal text-muted-foreground'>{unit}</span>
        </span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">{formula}</p>
      <div className="h-20 w-full">
         <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart accessibilityLayer data={data.history} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`fill${name.replace(/ /g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel indicator='dot' formatter={(value) => [`${value} ${unit}`, name]} />}
                />
                <Area dataKey="value" type="natural" fill={`url(#fill${name.replace(/ /g, '')})`} stroke={chartColor} stackId="a" dot={false} />
            </AreaChart>
         </ChartContainer>
      </div>
    </div>
  );
};

const StaticGasIndicator = ({ name, formula, value, unit, icon }: { name: string; formula: string; value: string; unit: string; icon: ReactNode }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="font-semibold">{name}</span>
        <span className="text-sm font-semibold text-foreground">
          {value} <span className="text-xs text-muted-foreground">{unit}</span>
        </span>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">{formula}</p>
      <div className="h-20 w-full flex items-center justify-center rounded-md bg-muted/30 text-muted-foreground">
         {icon}
      </div>
    </div>
);


export default function HarmfulGases({ isLoading, co2Data, vocsData }: HarmfulGasesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'><Wind /> Common Air Pollutants</CardTitle>
        <CardDescription>
          Common indoor pollutants and their typical concentration levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StaticGasIndicator name="Carbon Dioxide" formula="CO2" value="450" unit="ppm" icon={<Cloud className="h-10 w-10" />} />
        <StaticGasIndicator name="Volatile Organic Compounds" formula="VOCs" value="120" unit="ppb" icon={<FlaskConical className="h-10 w-10" />} />
        <StaticGasIndicator name="Particulate Matter 2.5" formula="PM2.5" value="15" unit="μg/m³" icon={<Sparkles className="h-10 w-10" />} />
        <StaticGasIndicator name="Oxygen" formula="O2" value="21" unit="%" icon={<Wind className="h-10 w-10" />} />
        <StaticGasIndicator name="Ozone" formula="O3" value="0.03" unit="ppm" icon={<Wind className="h-10 w-10" />} />
        <StaticGasIndicator name="Nitrogen Dioxide" formula="NO2" value="0.01" unit="ppm" icon={<FlaskConical className="h-10 w-10 opacity-70" />} />

      </CardContent>
    </Card>
  );
}

// Thresholds for "Poor" air quality for sensitive groups like children
const CO2_POOR_THRESHOLD = 2000; // ppm
const VOCS_POOR_THRESHOLD = 500; // ppb
