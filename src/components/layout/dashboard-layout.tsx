'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Sidebar } from './sidebar';
import { UserMenu } from './user-menu';
import { AiAssistant } from '@/components/chat/ai-assistant';
import { useTheme } from 'next-themes';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1">
          <header className={`sticky top-0 z-40 ${
            isDark 
              ? 'bg-gray-800/80 border-gray-800' 
              : 'bg-white/80 border-gray-200'
            } backdrop-blur-sm border-b`}>
            <div className="flex h-16 items-center px-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`rounded-md p-2 ${
                  isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden`}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" />
              </button>

              <div className="flex-1" />
              <div className="flex items-center">
                <UserMenu />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>

      <AiAssistant />
    </div>
  );
}
