import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Simple client-side navigation - In a real app, you'd use a router
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}