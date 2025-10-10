import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/app-logo';
import {
  AreaChart,
  Home,
  Settings,
  LifeBuoy,
  PanelLeft,
} from 'lucide-react';
import type { ReactNode } from 'react';
import DashboardHeader from '@/components/dashboard/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/auth-guard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 bg-accent text-accent-foreground"
                  asChild
                >
                  <Link href="/dashboard">
                    <Home />
                    Dashboard
                  </Link>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                  <Link href="#">
                    <AreaChart />
                    Analytics
                  </Link>
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                  <Link href="#">
                    <Settings />
                    Settings
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                  <Link href="#">
                    <LifeBuoy />
                    Support
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
