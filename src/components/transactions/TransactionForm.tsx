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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*');
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
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

  const handleProductSelect = (product: Product) => {
    setFormData({ ...formData, productId: product.id });
    setSearchTerm(product.name);
    setShowDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Product</label>
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a product..."
          required
        />
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No products found</div>
            )}
          </div>
        )}
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