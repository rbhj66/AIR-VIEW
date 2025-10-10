'use client';

import { ArrowRight, HardDrive, Cpu, Wifi } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function HardwareDiagram() {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-muted/30 p-8">
      <div className="relative flex w-full max-w-4xl flex-col items-center justify-between gap-8 md:flex-row">
        {/* Step 1: Sensor */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10">
            <HardDrive className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-semibold">MQ-135 & Others</p>
          <p className="text-xs text-muted-foreground">Air Quality Sensors</p>
        </div>

        <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground md:rotate-0" />

        {/* Step 2: Microcontroller */}
        <div className="z-10 flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/10">
            <Cpu className="h-8 w-8 text-accent-foreground" />
          </div>
          <p className="text-sm font-semibold">ESP32</p>
          <p className="text-xs text-muted-foreground">Microcontroller</p>
        </div>

        <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground md:rotate-0" />

        {/* Step 3: Firebase */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-destructive bg-destructive/10">
            <Wifi className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm font-semibold">Firebase</p>
          <p className="text-xs text-muted-foreground">Cloud Database</p>
        </div>
      </div>
    </div>
  );
}
