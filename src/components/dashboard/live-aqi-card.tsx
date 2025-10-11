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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip';

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

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.89-5.451 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.95 5.688l-1.42 5.179 5.333-1.397z" />
    </svg>
  );

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
  const phoneNumber = (userProfile as any)?.phoneNumber;

  const handleManualAlert = () => {
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

  const handleWhatsAppAlert = () => {
    if (phoneNumber) {
        const sanitizedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const message = encodeURIComponent(`Air Quality Alert!\n\nCurrent AQI is ${aqi} (${status}). Please take necessary precautions.`);
        const whatsappUrl = `https://wa.me/${sanitizedPhoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
  }

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
        <div className="flex gap-2">
            <Button onClick={handleManualAlert} variant="outline" size="sm" disabled={isProfileLoading}>
                <Bell className="mr-2 h-4 w-4" /> Trigger SMS
            </Button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <div className='inline-block'>
                            <Button onClick={handleWhatsAppAlert} variant="outline" size="sm" disabled={isProfileLoading || !phoneNumber}>
                                <WhatsAppIcon className="mr-2 h-4 w-4" /> Send to WhatsApp
                            </Button>
                         </div>
                    </TooltipTrigger>
                    {!phoneNumber && !isProfileLoading && (
                        <TooltipContent>
                            <p>Add a phone number in settings to enable.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardFooter>
      {/* This component handles automatic alerts and contains the audio element */}
      <AirQualityAlert aqi={aqi} isLoading={isLoading} phoneNumber={phoneNumber} isProfileLoading={isProfileLoading} />
    </Card>
  );
}
