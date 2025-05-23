import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Edit } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { UserForm } from '../components/users/UserForm';
import { Table } from '../components/ui/Table';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const SettingsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*');
    if (data) {
      setUsers(data);
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    { header: 'Username', accessor: 'username' as keyof User, sortable: true },
    { header: 'Full Name', accessor: 'fullName' as keyof User, sortable: true },
    { header: 'Email', accessor: 'email' as keyof User, sortable: true },
    { header: 'Role', accessor: 'role' as keyof User, sortable: true },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedUser(user);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Button
          leftIcon={<UserPlus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">Manage users and their permissions</p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new user.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<UserPlus size={16} />}
              >
                Add User
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={users}
            keyExtractor={(item) => item.id}
          />
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <UserForm
          onSubmit={() => {
            fetchUsers();
            setIsAddModalOpen(false);
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        {selectedUser && (
          <UserForm
            initialData={selectedUser}
            onSubmit={() => {
              fetchUsers();
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};