'use client';
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { useState, useEffect }from 'react';

interface AqiCircleProps {
  value: number;
  size?: 'md' | 'sm';
}

const MAX_AQI = 300; // AQI can go higher, but this is a common scale top for "Hazardous"

const getStatus = (value: number) => {
  if (value <= 50) return 'good';
  if (value <= 100) return 'moderate';
  if (value <= 150) return 'unhealthy-sensitive';
  if (value <= 200) return 'unhealthy';
  if (value <= 300) return 'very-unhealthy';
  return 'hazardous';
};

export default function AqiCircle({ value, size = 'md' }: AqiCircleProps) {
  const [angle, setAngle] = useState(90);

  useEffect(() => {
      const animation = requestAnimationFrame(() => {
          setAngle(prev => prev + 0.5);
      });
      return () => cancelAnimationFrame(animation);
  }, [angle]);


  const percentage = Math.round((value / MAX_AQI) * 100);
  const data = [{ name: 'AQI', value: value }];
  const chartSize = size === 'md' ? 192 : 128;
  const barSize = size === 'md' ? 20 : 14;
  const innerRadius = size === 'md' ? '70%' : '65%';
  const outerRadius = size === 'md' ? '90%' : '85%';
  const circleRadius = size === 'md' ? '68%' : '63%';
  const status = getStatus(value);


  return (
    <div className={cn("relative", size === 'md' ? "h-48 w-48" : "h-32 w-32")}>
      <RadialBarChart
        width={chartSize}
        height={chartSize}
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={barSize}
        data={data}
        startAngle={angle}
        endAngle={angle - 360}
      >
        <defs>
          <radialGradient id="aqiGlass" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="hsl(var(--card) / 0.5)" />
            <stop offset="90%" stopColor="hsl(var(--background) / 0.9)" />
            <stop offset="100%" stopColor="hsl(var(--background))" />
          </radialGradient>
          <linearGradient id="gradient-good" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#81c784" />
          </linearGradient>
          <linearGradient id="gradient-moderate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffc107" />
            <stop offset="100%" stopColor="#ffd54f" />
          </linearGradient>
           <linearGradient id="gradient-unhealthy-sensitive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9800" />
            <stop offset="100%" stopColor="#ffb74d" />
          </linearGradient>
          <linearGradient id="gradient-unhealthy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f44336" />
            <stop offset="100%" stopColor="#e57373" />
          </linearGradient>
          <linearGradient id="gradient-very-unhealthy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9c27b0" />
            <stop offset="100%" stopColor="#ba68c8" />
          </linearGradient>
          <linearGradient id="gradient-hazardous" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#795548" />
            <stop offset="100%" stopColor="#a1887f" />
          </linearGradient>
        </defs>
        <PolarAngleAxis
          type="number"
          domain={[0, MAX_AQI]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: 'hsl(var(--muted))' }}
          dataKey="value"
          cornerRadius={10}
          className="drop-shadow-lg"
          fill={`url(#gradient-${status})`}
        />
        <circle cx="50%" cy="50%" r={circleRadius} fill="url(#aqiGlass)" stroke="hsl(var(--border) / 0.5)" />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn(
            "font-bold text-foreground drop-shadow-sm",
             size === 'md' ? "text-5xl" : "text-4xl"
            )}>
          {value}
        </span>
        <span className={cn(
            "font-medium text-muted-foreground leading-tight",
            size === 'md' ? "text-sm" : "text-xs"
            )}>
          AQI
        </span>
      </div>
    </div>
  );
}
