'use client';
import { useState } from 'react';
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
import { AirVent, Fan, Power, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DeviceControlCard({ className }: { className?: string }) {
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [mode, setMode] = useState('auto');
  const [fanSpeed, setFanSpeed] = useState([50]);

  return (
    <Card className={cn('transition-all', !isPoweredOn && 'bg-muted/50', className)}>
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
            onCheckedChange={setIsPoweredOn}
            aria-label="Power"
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
            <Shield /> Mode
          </Label>
          <Select value={mode} onValueChange={setMode} disabled={!isPoweredOn}>
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
            onValueChange={setFanSpeed}
            max={100}
            step={10}
            disabled={!isPoweredOn}
          />
        </div>
      </CardContent>
    </Card>
  );
}
