'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Activity, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LivePulseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind /> Air Flow
        </CardTitle>
        <CardDescription>
          A real-time visualization of air flow activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted/20">
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
              d="M0,100 Q100,10 200,100 T400,100 Q500,180 600,100 T800,100"
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

// Add keyframes for the animation in globals.css
// @layer utilities {
//   @keyframes pulse-wave {
//     0% {
//       transform: translateX(-100%);
//     }
//     100% {
//       transform: translateX(0);
//     }
//   }
//   .animate-pulse-wave {
//     animation: pulse-wave 4s linear infinite;
//   }
// }
