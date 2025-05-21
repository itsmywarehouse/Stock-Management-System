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
  isActive: boolean;
}> = ({ to, icon, isActive }) => (
  <Link
    to={to}
    className={`
      flex items-center justify-center p-3 rounded-md transition-all duration-200
      ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}
      relative
    `}
  >
    <div className="text-2xl">
      {icon}
      {isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
      )}
    </div>
  </Link>
);

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = true }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/', icon: <LayoutDashboard size={24} /> },
    { to: '/products', icon: <Package size={24} /> },
    { to: '/transactions', icon: <History size={24} /> },
    { to: '/reports', icon: <BarChart3 size={24} /> },
    { to: '/settings', icon: <Settings size={24} /> },
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
        <nav className="flex justify-between items-center px-6 py-2">
          {links.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              isActive={isActive(link.to)}
            />
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-center">
        <h1 className="text-2xl font-bold text-indigo-700">IP</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-6 flex flex-col items-center">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            isActive={isActive(link.to)}
          />
        ))}
      </nav>

      <div className="p-4 border-t mt-auto bg-gray-50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center p-3 rounded-md text-gray-600 hover:text-gray-900 transition-all duration-200"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
};