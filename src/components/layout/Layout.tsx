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
      <main className="flex-1 p-6 pb-20 overflow-y-auto">
        {children}
      </main>
      <Sidebar />
    </div>
  );
};