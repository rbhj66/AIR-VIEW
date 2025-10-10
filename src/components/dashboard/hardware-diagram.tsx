'use client';

import { ArrowRight, HardDrive, Cpu, Lightbulb } from 'lucide-react';

export default function HardwareDiagram() {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-muted/30 p-8">
      <div className="relative flex w-full max-w-2xl items-center justify-between">
        {/* MQ-135 Sensor */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10">
            <HardDrive className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-semibold">MQ-135</p>
          <p className="text-xs text-muted-foreground">Gas Sensor</p>
        </div>

        {/* Arrow to Microcontroller */}
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 px-24">
          <div className="relative">
            <div className="h-px w-full bg-border"></div>
            <ArrowRight className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-background" />
            <span className="absolute left-1/2 top-0 -translate-y-full -translate-x-1/2 transform bg-muted/30 px-1 text-xs text-muted-foreground">
              Analog Signal
            </span>
          </div>
        </div>

        {/* Microcontroller */}
        <div className="z-10 flex flex-col items-center gap-2 bg-background text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/10">
            <Cpu className="h-8 w-8 text-accent-foreground" />
          </div>
          <p className="text-sm font-semibold">Microcontroller</p>
          <p className="text-xs text-muted-foreground">e.g., ESP32</p>
        </div>

        {/* Arrow to Indicator */}
         <div className="absolute right-0 top-1/2 w-full -translate-y-1/2 px-24">
          <div className="relative">
             <div className="h-px w-full bg-border"></div>
            <ArrowRight className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-background" />
             <span className="absolute right-1/2 top-full translate-x-1/2 transform bg-muted/30 px-1 text-xs text-muted-foreground">
              Digital Signal
            </span>
          </div>
        </div>
        
        {/* Indicator */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-destructive bg-destructive/10">
            <Lightbulb className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm font-semibold">Indicator</p>
          <p className="text-xs text-muted-foreground">e.g., LED</p>
        </div>
      </div>
    </div>
  );
}
