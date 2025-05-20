import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 p-6 pb-20 md:pb-6 md:ml-64 overflow-y-auto">
        {children}
      </main>
      <div className="md:hidden">
        <Sidebar />
      </div>
      <div className="hidden md:block md:w-64 bg-white h-screen shadow-md fixed left-0 top-0 z-10">
        <Sidebar isMobile={false} />
      </div>
    </div>
  );
};