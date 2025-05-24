import React from 'react';
import { Users, LogOut } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account preferences and settings
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Button
                variant="danger"
                leftIcon={<LogOut size={16} />}
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-gray-400" />
              <h2 className="ml-3 text-lg font-medium text-gray-900">User Management</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Manage users and their permissions in the system
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/settings/users')}
              >
                Manage Users
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};