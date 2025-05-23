import React from 'react';
import { LogOut, Users } from 'lucide-react';
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

      <Card>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
              <p className="text-sm text-gray-500">Manage your account preferences</p>
            </div>
          </div>

          <div className="border-t pt-6">
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
    </div>
  );
};