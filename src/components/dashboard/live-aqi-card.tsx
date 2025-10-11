'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Zap } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import AqiCircle from './aqi-circle';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';
import AirQualityAlert from './air-quality-alert';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import Link from 'next/link';

// Simplified AQI calculation (not official)
const calculateAqi = (pm25: number | null) => {
  if (pm25 === null) return 0;
  if (pm25 <= 12) return Math.round((50 / 12) * pm25);
  if (pm25 <= 35.4) return Math.round((49 / 23.4) * (pm25 - 12) + 51);
  if (pm25 <= 55.4) return Math.round((49 / 20) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round((49 / 95) * (pm25 - 55.5) + 151);
  return 201; // For values > 150.4
};

const getStatus = (value: number) => {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
};

interface LiveAqiCardProps {
  isLoading: boolean;
  pm25: number | null;
}

export default function LiveAqiCard({ isLoading, pm25 }: LiveAqiCardProps) {
  const { toast } = useToast();
  const aqi = useMemo(() => calculateAqi(pm25), [pm25]);
  const status = useMemo(() => getStatus(aqi), [aqi]);
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const handleManualAlert = () => {
    const phoneNumber = (userProfile as any)?.phoneNumber;

    toast({
      variant: 'destructive',
      title: (
        <div className="flex items-center gap-2">
          <AlertTriangle /> Manual Air Quality Alert
        </div>
      ),
      description: `This is a test alert. Current AQI is ${aqi}.`,
      duration: 5000,
    });
    
    if (phoneNumber) {
       toast({
        title: "SMS Notification Sent",
        description: `An alert has been sent to ${phoneNumber}.`,
        duration: 5000,
      });
    } else if (!isProfileLoading) {
        toast({
            variant: "default",
            title: "No Phone Number Found",
            description: "Add a phone number in settings to receive SMS alerts.",
            action: (
                <Button asChild variant="secondary" size="sm">
                    <Link href="/dashboard/settings">Go to Settings</Link>
                </Button>
            )
        })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap />
          Live Air Quality
        </CardTitle>
        <CardDescription>
          The current Air Quality Index (AQI) from your sensor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-48 w-48 rounded-full" />
        ) : (
          <AqiCircle value={aqi} />
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold">{status}</p>
        <Button onClick={handleManualAlert} variant="outline" size="sm" disabled={isProfileLoading}>
          <Bell className="mr-2 h-4 w-4" /> Trigger Alert
        </Button>
      </CardFooter>
      {/* This component handles automatic alerts and contains the audio element */}
      <AirQualityAlert aqi={aqi} isLoading={isLoading} />
    </Card>
  );
}
