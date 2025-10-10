
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCode, Rocket, Rss, View } from 'lucide-react';
import HardwareDiagram from '@/components/dashboard/hardware-diagram';

export default function ConnectivityPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rss className="text-primary" />
                Live Sensor Simulation
              </CardTitle>
              <CardDescription>
                This is a live Wokwi simulation of an ESP32 microcontroller with
                air quality sensors. Follow the steps on the right to connect it
                to your project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] w-full">
                <iframe
                  src="https://wokwi.com/projects/399949987878844417?embed=1"
                  className="h-full w-full rounded-md border"
                  allow="autoplay; encrypted-media"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Sensor</CardTitle>
              <CardDescription>
                Follow these steps to link the simulation to your Firebase
                project and see live data on your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <FileCode className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Step 1: Configure Credentials</p>
                        <p className="text-sm text-muted-foreground">
                        In the simulation on the left, open the{' '}
                        <Badge variant="outline">secrets.h</Badge> tab and enter your
                        Firebase project details.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Step 2: Run the Simulation</p>
                        <p className="text-sm text-muted-foreground">
                        Click the green "play" button in the Wokwi
                        simulation. Sensor readings will appear in the serial monitor as it connects.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <View className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Step 3: View Live Data</p>
                        <p className="text-sm text-muted-foreground">
                        Navigate back to your main dashboard. The charts and gauges will
                        update in real-time with data from your sensor.
                        </p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Hardware Connectivity Diagram</CardTitle>
          <CardDescription>
            A visual representation of how the hardware components are connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HardwareDiagram />
        </CardContent>
      </Card>
    </main>
  );
}
