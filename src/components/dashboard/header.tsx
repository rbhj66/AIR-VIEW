'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserProfile from '@/components/dashboard/user-profile';
import { useIsMobile } from '@/hooks/use-mobile';
import { Globe, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleButton } from '../theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function LanguageSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>English</DropdownMenuItem>
        <DropdownMenuItem>Español (Spanish)</DropdownMenuItem>
        <DropdownMenuItem>Français (French)</DropdownMenuItem>
        <DropdownMenuItem>Deutsch (German)</DropdownMenuItem>
        <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
        <DropdownMenuItem>ಕನ್ನಡ (Kannada)</DropdownMenuItem>
        <DropdownMenuItem>मराठी (Marathi)</DropdownMenuItem>
        <DropdownMenuItem>বাংলা (Bengali)</DropdownMenuItem>
        <DropdownMenuItem>தமிழ் (Tamil)</DropdownMenuItem>
        <DropdownMenuItem>తెలుగు (Telugu)</DropdownMenuItem>
        <DropdownMenuItem>日本語 (Japanese)</DropdownMenuItem>
        <DropdownMenuItem>中文 (Chinese)</DropdownMenuItem>
        <DropdownMenuItem>العربية (Arabic)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        {isMobile && (
          <SidebarTrigger>
            <Button variant="ghost" size="icon">
              <PanelLeft />
            </Button>
          </SidebarTrigger>
        )}
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggleButton />
        <UserProfile />
      </div>
    </header>
  );
}
