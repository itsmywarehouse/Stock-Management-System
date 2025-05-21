import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, History, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
  { path: '/inventory', label: 'Inventory', icon: <Package size={24} /> },
  { path: '/transactions', label: 'Transaction', icon: <History size={24} /> },
  { path: '/reports', label: 'Report', icon: <BarChart3 size={24} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={24} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (isMobile) {
    return (
      <nav className="flex justify-around items-center h-16">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full text-sm
              ${isActive(item.path) 
                ? 'text-indigo-600 border-t-2 border-indigo-600' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="h-full py-6">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">App Name</h1>
      </div>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150
              ${isActive(item.path)
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};