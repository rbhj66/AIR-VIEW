'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AirVent, Fan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { createPurifierDevice } from '@/lib/create-purifier-device';

export default function DeviceControlCard({ className }: { className?: string }) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const deviceId = 'living_room_purifier';

  const deviceRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'air_purifier_devices', deviceId);
  }, [firestore, user, deviceId]);

  const { data: deviceState, isLoading } = useDoc(deviceRef);

  useEffect(() => {
    if (!isLoading && !deviceState && firestore) {
      createPurifierDevice(firestore, deviceId, {
        name: 'Living Room Purifier',
        location: 'Living Room',
        isPoweredOn: true,
        mode: 'auto',
        fanSpeed: 50,
      });
    }
  }, [isLoading, deviceState, firestore, deviceId]);

  const handlePowerChange = (poweredOn: boolean) => {
    if (deviceRef) {
      setDocumentNonBlocking(deviceRef, { isPoweredOn: poweredOn }, { merge: true });
    }
  };

  const handleModeChange = (newMode: string) => {
    if (deviceRef) {
      setDocumentNonBlocking(deviceRef, { mode: newMode }, { merge: true });
    }
  };

  const handleFanSpeedChange = (newFanSpeed: number[]) => {
    if (deviceRef) {
      setDocumentNonBlocking(deviceRef, { fanSpeed: newFanSpeed[0] }, { merge: true });
    }
  };

  const isPoweredOn = deviceState?.isPoweredOn ?? true;
  const mode = deviceState?.mode ?? 'auto';
  const fanSpeed = [deviceState?.fanSpeed ?? 50];

  return (
    <Card
      className={cn(
        'transition-all',
        !isPoweredOn && 'bg-muted/50',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AirVent className="text-primary" /> Living Room Purifier
            </CardTitle>
            <CardDescription className="mt-1">
              {isPoweredOn ? 'Device is On' : 'Device is Off'}
            </CardDescription>
          </div>
          <Switch
            checked={isPoweredOn}
            onCheckedChange={handlePowerChange}
            aria-label="Power"
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          'space-y-6 transition-opacity',
          !isPoweredOn && 'pointer-events-none opacity-40'
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="mode" className="flex items-center gap-2">
            <AirVent /> Mode
          </Label>
          <Select
            value={mode}
            onValueChange={handleModeChange}
            disabled={!isPoweredOn || isLoading}
          >
            <SelectTrigger id="mode" className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="turbo">Turbo</SelectItem>
              <SelectItem value="allergen">Allergen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label htmlFor="fan-speed" className="flex items-center gap-2">
            <Fan /> Fan Speed: {fanSpeed[0]}%
          </Label>
          <Slider
            id="fan-speed"
            value={fanSpeed}
            onValueChange={handleFanSpeedChange}
            max={100}
            step={10}
            disabled={!isPoweredOn || isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
