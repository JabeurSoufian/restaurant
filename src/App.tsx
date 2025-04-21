import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MenuPage } from '@/pages/MenuPage';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [currentPath, setCurrentPath] = useState('/dashboard');

  useEffect(() => {
    checkAuth();
  }, []);

  // Simple client-side router
  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage />;
      case '/menu':
        return <MenuPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      {renderPage()}
      <Toaster />
    </Layout>
  );
}

export default App;