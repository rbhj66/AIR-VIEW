'use client';

import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface AirQualityAlertProps {
  aqi: number;
  isLoading: boolean;
  phoneNumber?: string | null;
  isProfileLoading?: boolean;
}

const ALERT_THRESHOLD = 101; // Trigger alert for AQI > 100 (Unhealthy for Sensitive Groups)

export default function AirQualityAlert({
  aqi,
  isLoading,
  phoneNumber,
  isProfileLoading,
}: AirQualityAlertProps) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const isAlertActive = useRef(false);

  useEffect(() => {
    if (isLoading || isProfileLoading) {
      return;
    }

    if (aqi >= ALERT_THRESHOLD && !isAlertActive.current) {
      isAlertActive.current = true;
      // 1. Visual Toast Alert
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

      // 2. Audio Alert
      audioRef.current?.play().catch(error => {
        console.warn("Buzzer sound autoplay was blocked by the browser.", error);
      });

      // 3. Automatic Simulated SMS Notification
      if (phoneNumber) {
        toast({
          title: "Automatic SMS Notification Sent",
          description: `An alert for high AQI (${aqi}) has been sent to ${phoneNumber}.`,
          duration: 10000,
        });
      } else {
         toast({
            variant: "default",
            title: "Enable Automatic SMS Alerts",
            description: "Add a phone number in settings to receive automatic SMS alerts when air quality is poor.",
            action: (
                <Button asChild variant="secondary" size="sm">
                    <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
            ),
            duration: 10000,
        })
      }
      
    } else if (aqi < ALERT_THRESHOLD && isAlertActive.current) {
      isAlertActive.current = false; // Reset the alert
    }
  }, [aqi, isLoading, isProfileLoading, phoneNumber, toast]);

  return (
    // The audio element is hidden but available to be played.
    <audio ref={audioRef} src="https://www.soundjay.com/buttons/sounds/beep-07a.mp3" preload="auto" />
  );
}
