import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

interface CategoryFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<Category>;
  parentCategories?: Category[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  parentCategories = [],
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    parentId: initialData.parentId || '',
    icon: initialData.icon || '',
    color: initialData.color || '#6366F1', // Default to indigo
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData.id) {
        await supabase
          .from('categories')
          .update(formData)
          .eq('id', initialData.id);
      } else {
        await supabase
          .from('categories')
          .insert([formData]);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Brief description of the category"
      />

      {parentCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
          >
            <option value="">None (Top Level)</option>
            {parentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input
        label="Icon"
        value={formData.icon}
        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        placeholder="Icon name (e.g., 'package' or 'shopping-bag')"
      />

      <Input
        label="Color"
        type="color"
        value={formData.color}
        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData.id ? 'Update' : 'Create'} Category
        </Button>
      </div>
    </form>
  );
};