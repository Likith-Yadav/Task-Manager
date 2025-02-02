'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Sidebar } from './sidebar';
import { UserMenu } from './user-menu';
import { AiAssistant } from '@/components/chat/ai-assistant';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-gray-900 border-gray-800">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block w-64 fixed inset-y-0" />
        
        <div className="lg:pl-64 flex-1">
          <div className="flex flex-col min-h-screen">
            <header className="h-16 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 sticky top-0 z-40">
              <div className="flex items-center justify-between h-full px-4">
                <div className="lg:hidden">
                  {/* Mobile menu trigger is now in Sheet component */}
                </div>
                <UserMenu />
              </div>
            </header>
            <main className="flex-1 bg-gray-900">{children}</main>
          </div>
        </div>
        <AiAssistant />
      </div>
    </div>
  );
}
