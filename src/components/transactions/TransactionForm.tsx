import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';

interface TransactionFormProps {
  type: 'in' | 'out';
  onSubmit: () => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  onSubmit,
  onCancel,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*');
    if (data) {
      setProducts(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await supabase
        .from('transactions')
        .insert([{
          product_id: formData.productId,
          type,
          quantity: formData.quantity,
          reason: formData.reason,
        }]);
      onSubmit();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.productId}
          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (SKU: {product.sku})
            </option>
          ))}
        </select>
      </div>
      
      <Input
        label="Quantity"
        type="number"
        min="1"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        required
      />
      
      <Input
        label="Reason"
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        required
      />
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Record Stock {type === 'in' ? 'In' : 'Out'}
        </Button>
      </div>
    </form>
  );
};