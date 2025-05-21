import React from 'react';
import {
  LayoutDashboard,
  Package,
  History,
  BarChart3,
  Settings,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

export const Sidebar: React.FC = () => {
  const location = useLocation();

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
};