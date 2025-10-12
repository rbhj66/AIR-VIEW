
'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Fingerprint, Activity, ShieldCheck, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

// Helper function to get health advice based on AQI
const getHealthAdvice = (aqi: number) => {
  if (aqi <= 50) {
    return {
      level: 'Good',
      advice: 'Air quality is excellent. It’s a great day to be active outside!',
      recommendation: 'Set purifier to "Auto" or a low fan speed to maintain air quality.',
      icon: <ShieldCheck className="h-6 w-6 text-green-500" />,
    };
  }
  if (aqi <= 100) {
    return {
      level: 'Moderate',
      advice: 'Air quality is acceptable. Unusually sensitive individuals should consider reducing outdoor exertion.',
      recommendation: 'Keep the purifier on "Auto" to handle any fluctuations.',
      icon: <Activity className="h-6 w-6 text-yellow-500" />,
    };
  }
  if (aqi <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      advice: 'Sensitive groups may experience health effects. The general public is less likely to be affected.',
      recommendation: 'Consider using "Allergen" mode. Keep windows closed during peak pollution hours.',
      icon: <Wind className="h-6 w-6 text-orange-500" />,
    };
  }
  return {
    level: 'Unhealthy',
    advice: 'Everyone may begin to experience health effects. Sensitive groups may have more serious effects.',
    recommendation: 'Use "Turbo" mode for rapid purification. Avoid intense outdoor activities.',
    icon: <Activity className="h-6 w-6 text-red-500" />,
  };
};

const calculateAqi = (pm25: number | null) => {
    if (pm25 === null) return 0;
    if (pm25 <= 12) return Math.round((50 / 12) * pm25);
    if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
    if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
    if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
    return 201; // For values > 150.4
};


export default function FingerprintScanner({ pm25 }: { pm25: number | null }) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned'>('idle');
  const [showResult, setShowResult] = useState(false);
  const scanTimeout = useRef<NodeJS.Timeout>();

  const handleScanStart = () => {
    setShowResult(false);
    setScanState('scanning');
    scanTimeout.current = setTimeout(() => {
      setScanState('scanned');
      setShowResult(true);
    }, 2000); // Simulate a 2-second scan
  };

  const handleScanEnd = () => {
    clearTimeout(scanTimeout.current);
    if (scanState === 'scanning') {
      setScanState('idle');
    }
  };

  const handleReset = () => {
    setScanState('idle');
    setShowResult(false);
  }

  const aqi = calculateAqi(pm25);
  const advice = getHealthAdvice(aqi);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Biometric Health Scan</CardTitle>
        <CardDescription>
          Get personalized health insights based on the current AQI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {!showResult ? (
            <>
                <div
                    className={cn(
                    'relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-primary/50 transition-all duration-300',
                    scanState === 'scanning' && 'animate-pulse-glow border-primary',
                    scanState !== 'scanning' && 'hover:scale-105 hover:border-primary'
                    )}
                    onMouseDown={handleScanStart}
                    onMouseUp={handleScanEnd}
                    onTouchStart={handleScanStart}
                    onTouchEnd={handleScanEnd}
                    style={{ perspective: '1000px' }}
                >
                    <Fingerprint
                    className={cn(
                        'h-20 w-20 text-primary/70 transition-all duration-300',
                        scanState === 'scanning' && 'scale-110 text-primary',
                        scanState !== 'scanning' && 'group-hover:text-primary'
                    )}
                    style={{ transform: 'rotateX(10deg) translateZ(10px)' }}
                    />
                    {scanState === 'scanning' && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                        <div className="animate-scan-line absolute -top-full h-full w-full bg-primary/30" />
                    </div>
                    )}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                    {scanState === 'idle' && 'Press and hold to scan'}
                    {scanState === 'scanning' && 'Scanning...'}
                    {scanState === 'scanned' && 'Scan Complete!'}
                </p>
            </>
        ) : (
            <div className="w-full space-y-4 text-left">
                 <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    {advice.icon}
                    <div>
                        <p className="font-semibold">{advice.level} (AQI: {aqi})</p>
                        <p className="text-sm text-muted-foreground">{advice.advice}</p>
                    </div>
                 </div>
                 <div className="rounded-lg bg-muted/50 p-3">
                    <p className="font-semibold">Recommendation</p>
                    <p className="text-sm text-muted-foreground">{advice.recommendation}</p>
                 </div>
                 <Button onClick={handleReset} className="w-full" variant="outline">
                    Scan Again
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
