import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, FileText, Upload } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionImport } from '../components/transactions/TransactionImport';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState<'all' | 'in' | 'out'>('all');
  const [sortColumn, setSortColumn] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [isImportInModalOpen, setIsImportInModalOpen] = useState(false);
  const [isImportOutModalOpen, setIsImportOutModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select(`
        *,
        products (
          name
        )
      `);
    if (data) {
      setTransactions(data);
      setFilteredTransactions(data);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterTransactions(value, transactionType);
  };

  const handleTypeFilter = (type: 'all' | 'in' | 'out') => {
    setTransactionType(type);
    filterTransactions(searchTerm, type);
  };

  const filterTransactions = (search: string, type: 'all' | 'in' | 'out') => {
    let filtered = [...transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.productName.toLowerCase().includes(searchLower) ||
        transaction.reason.toLowerCase().includes(searchLower)
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === type);
    }

    setFilteredTransactions(filtered);
  };

  const handleSort = (column: keyof Transaction) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);

    const sorted = [...filteredTransactions].sort((a, b) => {
      if (a[column] < b[column]) return isAsc ? 1 : -1;
      if (a[column] > b[column]) return isAsc ? -1 : 1;
      return 0;
    });

    setFilteredTransactions(sorted);
  };

  const columns = [
    { 
      header: 'Type', 
      accessor: (transaction: Transaction) => (
        <div className={`flex items-center ${
          transaction.type === 'in' ? 'text-green-600' : 'text-amber-600'
        }`}>
          {transaction.type === 'in' 
            ? <ArrowDownCircle className="mr-2 h-5 w-5" /> 
            : <ArrowUpCircle className="mr-2 h-5 w-5" />}
          <span>{transaction.type === 'in' ? 'Stock In' : 'Stock Out'}</span>
        </div>
      )
    },
    { header: 'Product', accessor: 'productName' as keyof Transaction, sortable: true },
    { header: 'Quantity', accessor: 'quantity' as keyof Transaction, sortable: true },
    { 
      header: 'Date', 
      accessor: (transaction: Transaction) => new Date(transaction.date).toLocaleString(),
      sortable: true 
    },
    { header: 'Reason', accessor: 'reason' as keyof Transaction, sortable: true },
    { header: 'Performed By', accessor: 'performedBy' as keyof Transaction, sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            leftIcon={<Upload size={16} />}
            onClick={() => setIsImportInModalOpen(true)}
          >
            Import Stock In
          </Button>
          <Button 
            variant="outline"
            leftIcon={<Upload size={16} />}
            onClick={() => setIsImportOutModalOpen(true)}
          >
            Import Stock Out
          </Button>
          <Button 
            variant="outline"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsStockInModalOpen(true)}
          >
            Stock In
          </Button>
          <Button 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsStockOutModalOpen(true)}
          >
            Stock Out
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={transactionType}
                onChange={(e) => handleTypeFilter(e.target.value as 'all' | 'in' | 'out')}
              >
                <option value="all">All Types</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </Card>

      {/* Stock In Modal */}
      <Modal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
        title="Record Stock In"
      >
        <TransactionForm
          type="in"
          onSubmit={() => {
            fetchTransactions();
            setIsStockInModalOpen(false);
          }}
          onCancel={() => setIsStockInModalOpen(false)}
        />
      </Modal>

      {/* Stock Out Modal */}
      <Modal
        isOpen={isStockOutModalOpen}
        onClose={() => setIsStockOutModalOpen(false)}
        title="Record Stock Out"
      >
        <TransactionForm
          type="out"
          onSubmit={() => {
            fetchTransactions();
            setIsStockOutModalOpen(false);
          }}
          onCancel={() => setIsStockOutModalOpen(false)}
        />
      </Modal>

      {/* Import Stock In Modal */}
      <Modal
        isOpen={isImportInModalOpen}
        onClose={() => setIsImportInModalOpen(false)}
        title="Import Stock In Data"
      >
        <TransactionImport
          type="in"
          onSuccess={() => {
            fetchTransactions();
            setIsImportInModalOpen(false);
          }}
          onCancel={() => setIsImportInModalOpen(false)}
        />
      </Modal>

      {/* Import Stock Out Modal */}
      <Modal
        isOpen={isImportOutModalOpen}
        onClose={() => setIsImportOutModalOpen(false)}
        title="Import Stock Out Data"
      >
        <TransactionImport
          type="out"
          onSuccess={() => {
            fetchTransactions();
            setIsImportOutModalOpen(false);
          }}
          onCancel={() => setIsImportOutModalOpen(false)}
        />
      </Modal>
    </div>
  );
};