'use client';

import { ArrowRight, Wind, Home, AirVent } from 'lucide-react';

export default function FreshAirDiagram() {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-muted/30 p-8">
      <div className="relative flex w-full max-w-2xl items-center justify-between">
        {/* Outdoor Air */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-blue-400/10">
            <Wind className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm font-semibold">Outdoor Air</p>
          <p className="text-xs text-muted-foreground">Fresh & Clean</p>
        </div>

        {/* Arrow to Purifier */}
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 px-24">
          <div className="relative">
            <div className="h-px w-full bg-border"></div>
            <ArrowRight className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-background" />
          </div>
        </div>

        {/* Air Purifier */}
        <div className="z-10 flex flex-col items-center gap-2 bg-background text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10">
            <AirVent className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm font-semibold">Air Purifier</p>
          <p className="text-xs text-muted-foreground">AirView Device</p>
        </div>

        {/* Arrow to Home */}
         <div className="absolute right-0 top-1/2 w-full -translate-y-1/2 px-24">
          <div className="relative">
             <div className="h-px w-full bg-border"></div>
            <ArrowRight className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-background" />
          </div>
        </div>
        
        {/* Healthy Home */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-green-500 bg-green-500/10">
            <Home className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm font-semibold">Healthy Home</p>
          <p className="text-xs text-muted-foreground">Purified Indoors</p>
        </div>
      </div>
    </div>
  );
}
