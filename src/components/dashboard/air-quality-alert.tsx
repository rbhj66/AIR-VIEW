'use client';

import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AirQualityAlertProps {
  aqi: number;
  isLoading: boolean;
}

const ALERT_THRESHOLD = 101; // Trigger alert for AQI > 100 (Unhealthy for Sensitive Groups)

export default function AirQualityAlert({ aqi, isLoading }: AirQualityAlertProps) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const isAlertActive = useRef(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (aqi >= ALERT_THRESHOLD && !isAlertActive.current) {
      isAlertActive.current = true;
      toast({
        variant: 'destructive',
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle /> Air Quality Alert
          </div>
        ),
        description: `Current AQI is ${aqi}. Air quality is considered unhealthy.`,
        duration: 10000, // Keep toast longer
      });

      audioRef.current?.play().catch(error => {
        // Autoplay might be blocked by the browser, which is a common issue.
        // We can log this, but usually we can't force it.
        console.warn("Buzzer sound autoplay was blocked by the browser.", error);
      });
      
    } else if (aqi < ALERT_THRESHOLD && isAlertActive.current) {
      isAlertActive.current = false; // Reset the alert
    }
  }, [aqi, isLoading, toast]);

  return (
    // The audio element is hidden but available to be played.
    // I'm using a placeholder sound from a reliable source.
    // In a real app, you'd host your own audio file.
    <audio ref={audioRef} src="https://www.soundjay.com/buttons/sounds/beep-07a.mp3" preload="auto" />
  );
}
