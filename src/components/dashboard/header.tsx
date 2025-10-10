'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserProfile from '@/components/dashboard/user-profile';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger>
          <Button variant="ghost" size="icon">
            <PanelLeft />
          </Button>
        </SidebarTrigger>}
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <UserProfile />
    </header>
  );
}
