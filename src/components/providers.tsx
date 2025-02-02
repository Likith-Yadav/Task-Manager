'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthContextProvider } from '@/contexts/auth-context';
import { ToastContextProvider } from '@/contexts/toast-context';
import { ToastProvider } from '@/components/ui/toast';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          <ToastContextProvider>
            <AuthContextProvider>
              {children}
            </AuthContextProvider>
          </ToastContextProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
