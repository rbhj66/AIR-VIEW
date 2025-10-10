import { AirVent } from 'lucide-react';

export default function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary/20 p-2">
        <AirVent className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-xl font-headline font-bold tracking-tight text-foreground">
        AirView
      </h1>
    </div>
  );
}
