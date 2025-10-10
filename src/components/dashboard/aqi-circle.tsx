'use client';
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';

interface AqiCircleProps {
  value: number;
}

const MAX_AQI = 300; // AQI can go higher, but this is a common scale top for "Hazardous"

const getColor = (value: number) => {
  if (value <= 50) return '#4caf50'; // Good
  if (value <= 100) return '#ffc107'; // Moderate
  if (value <= 150) return '#ff9800'; // Unhealthy for Sensitive Groups
  if (value <= 200) return '#f44336'; // Unhealthy
  if (value <= 300) return '#9c27b0'; // Very Unhealthy
  return '#795548'; // Hazardous
};

export default function AqiCircle({ value }: AqiCircleProps) {
  const data = [{ name: 'AQI', value: value, fill: getColor(value) }];

  return (
    <div className="relative h-48 w-48">
      <RadialBarChart
        width={192}
        height={192}
        cx="50%"
        cy="50%"
        innerRadius="70%"
        outerRadius="90%"
        barSize={20}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, MAX_AQI]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          className="drop-shadow-md"
        />
        <defs>
          <radialGradient id="aqiGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="hsl(var(--card))" stopOpacity={1} />
            <stop offset="90%" stopColor="hsl(var(--background))" stopOpacity={1} />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="68%" fill="url(#aqiGradient)" />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-bold text-foreground drop-shadow-sm">
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground leading-tight">
          Live AQI
        </span>
      </div>
    </div>
  );
}
