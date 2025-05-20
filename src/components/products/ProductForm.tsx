import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';

interface ProductFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<Product>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    sku: initialData.sku || '',
    category: initialData.category || '',
    quantity: initialData.quantity || 0,
    location: initialData.location || '',
    supplier: initialData.supplier || '',
    minStockLevel: initialData.minStockLevel || 0,
    price: initialData.price || 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialData.id) {
        await supabase
          .from('products')
          .update(formData)
          .eq('id', initialData.id);
      } else {
        await supabase
          .from('products')
          .insert([formData]);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving product:', error);
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
        label="SKU"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        required
      />
      <Input
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />
      <Input
        label="Quantity"
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        required
      />
      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
      />
      <Input
        label="Supplier"
        value={formData.supplier}
        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
      />
      <Input
        label="Minimum Stock Level"
        type="number"
        value={formData.minStockLevel}
        onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) })}
        required
      />
      <Input
        label="Price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        required
      />
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData.id ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  );
};