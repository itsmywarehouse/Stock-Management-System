import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';

interface UserFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<User>;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    username: initialData.username || '',
    email: initialData.email || '',
    fullName: initialData.fullName || '',
    role: initialData.role || 'staff',
    permissions: initialData.permissions || {
      canAddProduct: true,
      canEditProduct: true,
      canDeleteProduct: false,
      canViewReports: true,
      canManageUsers: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData.id) {
        await supabase
          .from('users')
          .update(formData)
          .eq('id', initialData.id);
      } else {
        await supabase
          .from('users')
          .insert([formData]);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Card title="Permissions">
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.permissions.canAddProduct}
              onChange={(e) => setFormData({
                ...formData,
                permissions: {
                  ...formData.permissions,
                  canAddProduct: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Can Add Products</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.permissions.canEditProduct}
              onChange={(e) => setFormData({
                ...formData,
                permissions: {
                  ...formData.permissions,
                  canEditProduct: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Can Edit Products</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.permissions.canDeleteProduct}
              onChange={(e) => setFormData({
                ...formData,
                permissions: {
                  ...formData.permissions,
                  canDeleteProduct: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Can Delete Products</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.permissions.canViewReports}
              onChange={(e) => setFormData({
                ...formData,
                permissions: {
                  ...formData.permissions,
                  canViewReports: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Can View Reports</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.permissions.canManageUsers}
              onChange={(e) => setFormData({
                ...formData,
                permissions: {
                  ...formData.permissions,
                  canManageUsers: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Can Manage Users</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData.id ? 'Update' : 'Create'} User
        </Button>
      </div>
    </form>
  );
};