import React, { useState, useEffect } from 'react';
import { Download, BarChart3, PieChart, Calendar, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { products, transactions, categories } from '../utils/mockData';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'inventory' | 'transactions' | 'categories' | 'top-selling'>('inventory');
  const [topSellingProducts, setTopSellingProducts] = useState<{ name: string; quantity: number; revenue: number }[]>([]);
  const [easySelling, setEasySelling] = useState<{ name: string; turnoverRate: number; daysToSell: number }[]>([]);
  
  useEffect(() => {
    // Calculate top selling products
    const productSales = transactions
      .filter(t => t.type === 'out')
      .reduce((acc, transaction) => {
        const product = products.find(p => p.id === transaction.productId);
        if (!product) return acc;
        
        if (!acc[product.id]) {
          acc[product.id] = {
            name: product.name,
            quantity: 0,
            revenue: 0
          };
        }
        
        acc[product.id].quantity += transaction.quantity;
        acc[product.id].revenue += transaction.quantity * product.price;
        
        return acc;
      }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setTopSellingProducts(sortedProducts);

    // Calculate easy selling products (based on turnover rate)
    const turnoverRates = products.map(product => {
      const sales = transactions
        .filter(t => t.type === 'out' && t.productId === product.id)
        .reduce((sum, t) => sum + t.quantity, 0);
      const turnoverRate = sales / (product.quantity + sales); // Sales divided by total inventory
      const daysToSell = 30 / turnoverRate; // Assuming 30-day period

      return {
        name: product.name,
        turnoverRate,
        daysToSell
      };
    }).sort((a, b) => b.turnoverRate - a.turnoverRate).slice(0, 5);

    setEasySelling(turnoverRates);
  }, []);

  const generateReport = () => {
    // In a real application, this would generate a CSV or PDF file
    alert(`Generating ${reportType} report...`);
  };

  const ReportOption: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    value: 'inventory' | 'transactions' | 'categories' | 'top-selling';
    selected: boolean;
    onClick: () => void;
  }> = ({ title, description, icon, selected, onClick }) => (
    <div 
      className={`
        border rounded-lg p-6 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${selected ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );

  const RankingTable: React.FC<{
    title: string;
    data: any[];
    columns: { header: string; accessor: (item: any) => React.ReactNode }[];
  }> = ({ title, data, columns }) => (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className={index === 0 ? 'bg-amber-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 1}
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <Button 
          variant="outline" 
          leftIcon={<Download size={16} />}
          onClick={generateReport}
        >
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportOption
          title="Inventory Report"
          description="Current stock levels, low stock items, and product details"
          icon={<BarChart3 size={24} />}
          value="inventory"
          selected={reportType === 'inventory'}
          onClick={() => setReportType('inventory')}
        />
        <ReportOption
          title="Transaction History"
          description="Stock movements, including in and out transactions"
          icon={<Calendar size={24} />}
          value="transactions"
          selected={reportType === 'transactions'}
          onClick={() => setReportType('transactions')}
        />
        <ReportOption
          title="Category Analysis"
          description="Products grouped by category with counts and values"
          icon={<PieChart size={24} />}
          value="categories"
          selected={reportType === 'categories'}
          onClick={() => setReportType('categories')}
        />
        <ReportOption
          title="Top Selling Products"
          description="Most sold products by quantity and revenue"
          icon={<TrendingUp size={24} />}
          value="top-selling"
          selected={reportType === 'top-selling'}
          onClick={() => setReportType('top-selling')}
        />
      </div>

      <Card title="Report Preview">
        {reportType === 'inventory' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {reportType === 'transactions' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'categories' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => {
                    const categoryProducts = products.filter(p => p.category === category.name);
                    const totalItems = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);
                    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

                    return (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{totalItems}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${totalValue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'top-selling' && (
          <div className="space-y-8">
            <RankingTable
              title="Top Selling Products by Volume"
              data={topSellingProducts}
              columns={[
                { header: 'Product', accessor: (item) => item.name },
                { header: 'Units Sold', accessor: (item) => item.quantity },
                { header: 'Revenue', accessor: (item) => `$${item.revenue.toFixed(2)}` }
              ]}
            />

            <RankingTable
              title="Easy Selling Products"
              data={easySelling}
              columns={[
                { header: 'Product', accessor: (item) => item.name },
                { header: 'Turnover Rate', accessor: (item) => `${(item.turnoverRate * 100).toFixed(1)}%` },
                { header: 'Avg. Days to Sell', accessor: (item) => Math.round(item.daysToSell) }
              ]}
            />
          </div>
        )}
      </Card>
    </div>
  );
};