import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ReportFilters, DateRange } from '../../types';
import { supabase } from '../../lib/supabase';

interface ReportFormProps {
  onSubmit: (filters: ReportFilters) => void;
  onCancel: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onCancel }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [productId, setProductId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [type, setType] = useState<'in' | 'out' | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const filters: ReportFilters = {
      dateRange,
      ...(productId && { productId }),
      ...(userId && { userId }),
      ...(type && { type }),
    };

    onSubmit(filters);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Start Date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          required
        />
        <Input
          type="date"
          label="End Date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={type || ''}
          onChange={(e) => setType(e.target.value as 'in' | 'out' | undefined)}
        >
          <option value="">All Types</option>
          <option value="in">Stock In</option>
          <option value="out">Stock Out</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="">All Products</option>
          {/* Products will be populated from the database */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">All Users</option>
          {/* Users will be populated from the database */}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Generate Report
        </Button>
      </div>
    </form>
  );
};