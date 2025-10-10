'use client';

import { Wind, Home, AirVent, Building2, Car, ArrowRight } from 'lucide-react';

const AnimatedArrow = ({ delay }: { delay: string }) => (
  <ArrowRight
    className="h-6 w-6 animate-flow-x text-muted-foreground"
    style={{ animationDelay: delay }}
  />
);

export default function FreshAirDiagram() {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-muted/30 p-8 overflow-hidden">
      <div className="relative flex w-full max-w-4xl items-center justify-center gap-12">
        {/* Left Side: Source */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-blue-400 bg-blue-400/10">
            <Wind className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm font-semibold">Outdoor Air</p>
          <p className="text-xs text-muted-foreground">Source</p>
        </div>

        {/* Animated Arrows to Purifier */}
        <div className="absolute left-1/4 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform gap-4">
          <AnimatedArrow delay="0s" />
          <AnimatedArrow delay="0.5s" />
          <AnimatedArrow delay="1s" />
        </div>


        {/* Middle: Purifier */}
        <div className="z-10 flex flex-col items-center gap-2 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10">
            <AirVent className="h-10 w-10 text-primary" />
          </div>
          <p className="text-sm font-semibold">Air Purifier</p>
          <p className="text-xs text-muted-foreground">AirView Device</p>
        </div>
        
        {/* Animated Arrows to Destinations */}
        <div className="absolute right-1/4 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform gap-4">
           <AnimatedArrow delay="0s" />
           <AnimatedArrow delay="0.5s" />
           <AnimatedArrow delay="1s" />
        </div>

        {/* Right Side: Destinations */}
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-green-500 bg-green-500/10">
              <Home className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold">Healthy Home</p>
            <p className="text-xs text-muted-foreground">Purified Indoors</p>
          </div>
           <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-green-500 bg-green-500/10">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold">Clean Office</p>
            <p className="text-xs text-muted-foreground">Productive Space</p>
          </div>
           <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-green-500 bg-green-500/10">
              <Car className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold">Fresh Car</p>
            <p className="text-xs text-muted-foreground">Clear Commute</p>
          </div>
        </div>
      </div>
    </div>
  );
}
