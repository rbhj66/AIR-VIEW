import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FreshAirDiagram from '@/components/dashboard/fresh-air-diagram';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Zap,
  BrainCircuit,
  SlidersHorizontal,
  ArrowRight,
  Mail,
  Instagram,
  Phone,
} from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Real-time AQI Tracking',
    description:
      'Monitor live air quality data from your connected sensors, including PM2.5, CO2, and VOC levels.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Predictions',
    description:
      'Leverage AI to forecast future air quality and receive intelligent recommendations for your air purifier.',
  },
  {
    icon: <SlidersHorizontal className="h-8 w-8 text-primary" />,
    title: 'Smart Device Control',
    description:
      'Remotely control your air purifier, adjust fan speed, and switch modes directly from your dashboard.',
  },
];

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

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4 lg:px-6">
        <AppLogo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Breathe Easy with Intelligent Air Quality Monitoring
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AirView provides real-time air quality data, intelligent
                    predictions, and personalized recommendations to help you
                    create a healthier indoor environment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/dashboard">View Demo</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
                <h3 className="text-lg font-bold tracking-tight">
                  Fresh Air Diagram
                </h3>
                <FreshAirDiagram />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-muted py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              Features at a Glance
            </h2>
            <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-3 md:gap-8">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="flex h-full flex-col items-center text-center"
                >
                  <CardHeader className="items-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl">
              How It Works
            </h2>
            <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-between gap-12 md:flex-row md:gap-8">
              <div className="absolute left-0 top-1/2 hidden h-1 w-full -translate-y-1/2 bg-border md:block"></div>
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                  1
                </div>
                <h3 className="font-semibold">Connect Sensor</h3>
                <p className="max-w-[200px] text-sm text-muted-foreground">
                  Link the Wokwi sensor simulation to your Firebase project.
                </p>
              </div>
              <ArrowRight className="h-8 w-8 rotate-90 text-muted-foreground md:hidden" />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                  2
                </div>
                <h3 className="font-semibold">Stream Data</h3>
                <p className="max-w-[200px] text-sm text-muted-foreground">
                  The ESP32 sends live sensor readings to Firestore in real-time.
                </p>
              </div>
               <ArrowRight className="h-8 w-8 rotate-90 text-muted-foreground md:hidden" />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background text-2xl font-bold text-primary">
                  3
                </div>
                <h3 className="font-semibold">Visualize & Control</h3>
                <p className="max-w-[200px] text-sm text-muted-foreground">
                  View live data on your dashboard and control your devices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center gap-4 p-6 text-sm text-muted-foreground">
        <div>Crafted with ❤️ for a breath of fresh air.</div>
      </footer>
    </div>
  );
}
