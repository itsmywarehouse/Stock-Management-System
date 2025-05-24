import React from 'react';
import {
  LayoutDashboard,
  Package,
  History,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
      flex items-center transition-all duration-200 relative
      ${isMobile 
        ? `flex-col py-2 px-4 ${isActive ? 'text-indigo-600' : 'text-gray-600'}`
        : `space-x-3 p-3 rounded-md ${isActive ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}`
      }
    `}
  >
    <span className={`${isMobile ? 'mb-1' : ''}`}>
      {icon}
    </span>
    <span className={`font-medium ${isMobile ? `text-xs ${isActive ? 'hidden' : ''}` : ''}`}>
      {label}
    </span>
    {isMobile && isActive && (
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
    )}
  </Link>
);

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const location = useLocation();

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
        <nav className="flex justify-around items-center py-2">
          {links.map((link) => (
            <div key={link.to} className="relative">
              <SidebarLink
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={isActive(link.to)}
                isMobile={true}
              />
            </div>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <aside className="flex flex-col h-full">
      <div className="flex-1">
        <div className="p-4 flex items-center justify-between border-b">
          <h1 className="text-xl font-bold text-indigo-700">InventoryPro</h1>
        </div>
        <nav className="p-4 space-y-2">
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
      </div>
    </aside>
  );
};