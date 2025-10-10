import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import HardwareDiagram from '@/components/dashboard/hardware-diagram';

export default function ConnectivityPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wokwi IoT Sensor Simulation</CardTitle>
              <CardDescription>
                This is a live simulation of an ESP32 microcontroller with BME680
                and CCS811 sensors to measure air quality.
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
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Connecting to Your Project</CardTitle>
              <CardDescription>
                Follow these steps to connect the simulation to your Firebase
                project and see live data in your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      1. Configure Firebase Credentials
                    </p>
                    <p>
                      In the Wokwi simulation on the left, open the{' '}
                      <Badge variant="outline">secrets.h</Badge> file. You will
                      need to fill in your Firebase project details here.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">2. Set the Sensor ID</p>
                    <p>
                      In the same <Badge variant="outline">secrets.h</Badge>{' '}
                      file, set the `SENSOR_ID` to a unique name for your
                      simulated device, like &quot;living_room_sensor&quot;.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">3. Run the Simulation</p>
                    <p>
                      Click the green &quot;play&quot; button in the Wokwi
                      simulation. You should see sensor readings appear in the
                      serial monitor. After a moment, the device will connect to
                      Firebase and start sending data.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">4. View Live Data</p>
                    <p>
                      Navigate back to your main dashboard. The cards will
                      update in real-time with the data from your simulation.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
