import React from 'react';
import { 
  Package, 
  AlertCircle, 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getLowStockItems } from '../utils/mockData';
import { Transaction, Product } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const lowStockItems = getLowStockItems();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        -Math.round(diffInHours),
        'hour'
      );
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, value, icon, color, onClick }) => (
    <Card 
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center p-2">
        <div className={`p-4 rounded-xl ${color} mr-4 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );

  const ActivityItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <div className="group flex items-center py-4 px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
      <div className={`p-3 rounded-xl mr-4 transition-colors duration-200 ${
        transaction.type === 'in' 
          ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
          : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
      }`}>
        {transaction.type === 'in' 
          ? <ArrowDownCircle className="w-6 h-6" /> 
          : <ArrowUpCircle className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.type === 'in' ? 'Received' : 'Shipped'} {transaction.quantity} {transaction.productName}
          </p>
          <span className="ml-2 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {transaction.reason}
          </span>
        </div>
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <Clock className="mr-1 h-3 w-3" />
          {formatDate(transaction.date)}
          <span className="mx-2">•</span>
          <span className="font-medium">{transaction.performedBy}</span>
        </div>
      </div>
    </div>
  );

  const LowStockItem: React.FC<{ product: Product }> = ({ product }) => (
    <div className="group flex items-center justify-between py-4 px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
      <div className="flex items-center min-w-0">
        <div className="bg-red-100 text-red-600 p-3 rounded-xl mr-4 transition-colors duration-200 group-hover:bg-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <span className="font-medium">SKU: {product.sku}</span>
            <span className="mx-2">•</span>
            <span>{product.location}</span>
          </div>
        </div>
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-red-600">
          {product.quantity} of {product.minStockLevel} min
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-red-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${(product.quantity / product.minStockLevel) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            leftIcon={<Package size={16} />}
            onClick={() => navigate('/products/new')}
            className="shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          onClick={() => navigate('/products')}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={<AlertCircle className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-red-500 to-red-600"
          onClick={() => navigate('/products?filter=low-stock')}
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<LayoutDashboard className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
          onClick={() => navigate('/transactions')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((transaction) => (
                <ActivityItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">No recent activity</p>
                <p className="mt-1 text-sm text-gray-500">New transactions will appear here</p>
              </div>
            )}
          </div>
          {stats.recentActivity.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/transactions')}
                className="w-full justify-center"
              >
                View All Transactions
              </Button>
            </div>
          )}
        </Card>

        <Card title="Low Stock Alerts" className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((product) => (
                <LowStockItem key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">No low stock items</p>
                <p className="mt-1 text-sm text-gray-500">All products are above minimum stock levels</p>
              </div>
            )}
          </div>
          {lowStockItems.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/products?filter=low-stock')}
                className="w-full justify-center"
              >
                View All Low Stock Items
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};