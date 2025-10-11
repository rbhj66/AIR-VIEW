'use client';

import { cn } from '@/lib/utils';
import { AirVent, Cpu, Fan, Lightbulb, Thermometer, Droplets, FlaskConical, Wind } from 'lucide-react';

const ComponentBox = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("relative rounded-lg border-2 bg-card p-2 shadow-sm", className)}>
    {children}
  </div>
);

const Pin = ({ name, position, isConnected }: { name: string; position: string; isConnected?: boolean }) => (
  <div className={cn("absolute text-[8px] font-mono text-muted-foreground", position)}>
    <div className="flex items-center gap-1">
      <span>{name}</span>
      <div className={cn("h-1.5 w-1.5 rounded-full border border-foreground/50", isConnected ? 'bg-primary' : 'bg-background')} />
    </div>
  </div>
);

const SVGLine = ({ d, colorClass = "stroke-muted-foreground", id }: { d: string; colorClass?: string; id?: string }) => (
  <path
    d={d}
    className={cn("fill-none stroke-[2]", colorClass)}
    markerEnd={id ? `url(#${id})` : undefined}
  />
);

export default function HardwareDiagram() {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-muted/30 p-4 md:p-8 min-h-[500px]">
      <div className="relative w-full max-w-4xl h-[450px] scale-90 md:scale-100">
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary" />
            </marker>
          </defs>
          {/* Arduino GND to Breadboard */}
          <SVGLine d="M 330 180 V 220 H 100 V 260" colorClass="stroke-black dark:stroke-gray-400" />
          {/* MQ-135 Connections */}
          <SVGLine d="M 125 70 H 150 V 100 H 290" colorClass="stroke-red-500" /> {/* VCC */}
          <SVGLine d="M 125 90 H 160 V 180 H 310" colorClass="stroke-black dark:stroke-gray-400" /> {/* GND */}
          <SVGLine d="M 125 110 H 170 V 200 H 420" colorClass="stroke-green-500" /> {/* AOUT */}
          <SVGLine d="M 125 50 H 180 V 10 H 510" colorClass="stroke-orange-500" /> {/* DOUT */}
          
          {/* ENS160+AHT21 Connections */}
          <SVGLine d="M 100 320 V 300 H 280" colorClass="stroke-red-500" /> {/* 3V3 */}
          <SVGLine d="M 100 280 H 110" colorClass="stroke-black dark:stroke-gray-400" /> {/* GND */}
          <SVGLine d="M 100 340 V 360 H 450" colorClass="stroke-yellow-500" /> {/* SCL */}
          <SVGLine d="M 100 360 V 380 H 460" colorClass="stroke-purple-500" /> {/* SDA */}
          
          {/* Fan Connections */}
          <SVGLine d="M 680 180 H 650 V 10 H 490" colorClass="stroke-blue-500" /> {/* 5V to D9 */}
          <SVGLine d="M 680 220 H 640 V 280 H 310" colorClass="stroke-black dark:stroke-gray-400" /> {/* GND */}

          {/* LED Connections */}
          <SVGLine d="M 600 80 V 20 H 470" colorClass="stroke-teal-500" /> {/* Anode to D13 */}
          <SVGLine d="M 600 120 V 170 H 310" colorClass="stroke-black dark:stroke-gray-400" /> {/* Cathode to GND */}
          
        </svg>

        {/* Arduino UNO */}
        <ComponentBox className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-64 border-blue-500/50 bg-blue-500/10">
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Cpu className="text-blue-400" />
            <span className="font-bold text-blue-300">Arduino UNO</span>
          </div>
          <Pin name="3.3V" position="top-[68px] left-[270px]" isConnected />
          <Pin name="5V" position="top-[88px] left-[285px]" isConnected />
          <Pin name="GND" position="top-[108px] left-[300px]" isConnected />
          <Pin name="GND" position="top-[128px] left-[300px]" isConnected />
          <Pin name="Vin" position="top-[148px] left-[310px]" />

          <Pin name="A0" position="top-[188px] left-[410px] rotate-90" isConnected />
          
          <Pin name="SCL" position="top-[35px] left-[440px] rotate-90" isConnected />
          <Pin name="SDA" position="top-[35px] left-[450px] rotate-90" isConnected />
          
          <Pin name="D13" position="top-[8px] left-[460px] rotate-90" isConnected />
          <Pin name="D9" position="top-[8px] left-[480px] rotate-90" isConnected />
          <Pin name="D7" position="top-[8px] left-[500px] rotate-90" isConnected />
        </ComponentBox>
        
        {/* MQ 135 */}
        <ComponentBox className="absolute top-12 left-0 w-32 h-24 border-cyan-500/50 bg-cyan-500/10">
          <div className="flex flex-col items-center justify-center h-full">
            <Wind className="text-cyan-400" />
            <p className="text-[10px] font-bold">MQ 135</p>
            <p className="text-[8px] text-muted-foreground">Gas Sensor</p>
          </div>
           <Pin name="D OUT" position="top-[15px] right-[-35px]" isConnected />
           <Pin name="A OUT" position="top-[35px] right-[-35px]" isConnected />
           <Pin name="GND" position="top-[55px] right-[-30px]" isConnected />
           <Pin name="VCC" position="top-[75px] right-[-30px]" isConnected />
        </ComponentBox>
        
        {/* ENS160+AHT21 */}
        <ComponentBox className="absolute bottom-4 left-0 w-24 h-40 border-indigo-500/50 bg-indigo-500/10">
           <div className="flex flex-col items-center justify-center h-full gap-1">
             <AirVent className="text-indigo-400" />
             <p className="text-[10px] font-bold text-center">ENS160+ AHT21</p>
          </div>
          <Pin name="VIN" position="top-[15px] right-[-25px]" />
          <Pin name="3V3" position="top-[35px] right-[-25px]" isConnected />
          <Pin name="GND" position="top-[55px] right-[-30px]" isConnected />
          <Pin name="SCL" position="top-[75px] right-[-25px]" isConnected />
          <Pin name="SDA" position="top-[95px] right-[-25px]" isConnected />
        </ComponentBox>

        {/* Fan */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-card border-2 flex items-center justify-center">
                <Fan className="text-foreground h-16 w-16 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <p className="text-sm font-semibold">Fan</p>
            <Pin name="5V" position="top-[35px] left-[-20px]" isConnected />
            <Pin name="GND" position="top-[55px] left-[-30px]" isConnected />
        </div>

        {/* LED */}
        <div className="absolute top-10 right-24 flex flex-col items-center gap-2">
            <Lightbulb className="text-red-500 h-10 w-10" />
            <p className="text-sm font-semibold">LED</p>
            <Pin name="anode" position="top-[0px] left-[-35px]" isConnected />
            <Pin name="cathode" position="bottom-[-10px] left-[-45px]" isConnected />
        </div>
      </div>
    </div>
  );
}
