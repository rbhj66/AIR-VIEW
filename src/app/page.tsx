import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import FreshAirDiagram from '@/components/dashboard/fresh-air-diagram';

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
      </main>
      <footer className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AirView. All rights reserved.
      </footer>
    </div>
  );
}
