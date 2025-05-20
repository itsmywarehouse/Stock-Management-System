import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpCircle, ArrowDownCircle, FileText } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
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

  // Your existing filtering and sorting logic...

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
        <div className="flex space-x-2">
          <Button 
            leftIcon={<Plus size={16} />}
            variant="outline"
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
        {/* Your existing search and filter UI */}
        
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
    </div>
  );
};