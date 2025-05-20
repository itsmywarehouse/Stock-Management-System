import React from 'react';
import {
  LayoutDashboard,
  Package,
  History,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isMobile?: boolean;
}

const SidebarLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isMobile?: boolean;
}> = ({ to, icon, label, isActive, isMobile }) => (
  <Link
    to={to}
    className={`
      flex items-center space-x-3 p-3 rounded-md transition-all duration-200
      ${isMobile 
        ? `flex-col space-x-0 space-y-1 flex-1 ${isActive ? 'text-indigo-600' : 'text-gray-600'}`
        : `${isActive ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}`
      }
    `}
  >
    <div className={`
      ${isMobile && isActive ? 'relative' : ''}
      ${isMobile ? 'text-center' : ''}
    `}>
      <span className={`text-lg ${isMobile ? 'text-2xl' : ''}`}>{icon}</span>
      {isMobile && isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
      )}
    </div>
    <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{label}</span>
  </Link>
);

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = true }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/', icon: <LayoutDashboard size={isMobile ? 24 : 20} />, label: 'Dashboard' },
    { to: '/products', icon: <Package size={isMobile ? 24 : 20} />, label: 'Products' },
    { to: '/transactions', icon: <History size={isMobile ? 24 : 20} />, label: 'Transactions' },
    { to: '/reports', icon: <BarChart3 size={isMobile ? 24 : 20} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={isMobile ? 24 : 20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-between items-center px-4 py-2">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={isActive(link.to)}
              isMobile={true}
            />
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-700">InventoryPro</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isActive={isActive(link.to)}
          />
        ))}
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 w-full rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};