'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function HourlyAqiTrends({ sensorReadings, isLoading }: { sensorReadings: any[] | null, isLoading: boolean }) {
 return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity /> Hourly AQI Trend
        </CardTitle>
        <CardDescription>
          A real-time visualization of hourly air quality fluctuations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted/20">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="pulseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <path
              d="M0,80 Q100,20 200,80 T400,80 Q500,140 600,80 T800,80"
              stroke="hsl(var(--primary))"
              fill="url(#pulseGradient)"
              strokeWidth="3"
              className="animate-pulse-wave"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
