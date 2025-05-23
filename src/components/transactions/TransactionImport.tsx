import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileText, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { supabase } from '../../lib/supabase';

interface TransactionImportProps {
  type: 'in' | 'out';
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransactionImport: React.FC<TransactionImportProps> = ({ type, onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/vnd.ms-excel' ||
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a CSV or Excel file');
        setFile(null);
      }
    }
  };

  const downloadSampleFile = () => {
    const sampleData = `Product SKU,Quantity,Reason
KB-001,10,Restock
MS-002,5,${type === 'in' ? 'Supplier delivery' : 'Customer order'}
ST-003,8,${type === 'in' ? 'Purchase' : 'Internal use'}`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample-stock-${type}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line) => {
      const values = line.split(',');
      return {
        sku: values[0]?.trim(),
        quantity: parseInt(values[1]?.trim() || '0'),
        reason: values[2]?.trim(),
      };
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const transactions = parseCSV(text);

      for (const transaction of transactions) {
        const { data: products } = await supabase
          .from('products')
          .select('id')
          .eq('sku', transaction.sku)
          .single();

        if (products) {
          await supabase
            .from('transactions')
            .insert([{
              product_id: products.id,
              type,
              quantity: transaction.quantity,
              reason: transaction.reason,
            }]);
        }
      }

      onSuccess();
    } catch (err) {
      setError('Failed to import transactions. Please check your file format and try again.');
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xls,.xlsx"
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Upload Stock {type === 'in' ? 'In' : 'Out'} Data</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV or Excel file containing your stock {type === 'in' ? 'in' : 'out'} data
            </p>
          </div>

          {file ? (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-red-600 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download size={16} />}
          onClick={downloadSampleFile}
        >
          Download Sample File
        </Button>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            isLoading={isLoading}
            disabled={!file}
          >
            Import Transactions
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-gray-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">Import Guidelines</h3>
            <div className="mt-2 text-sm text-gray-600">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use the sample file as a template</li>
                <li>Ensure all required fields are filled</li>
                <li>Product SKUs must exist in the system</li>
                <li>Quantities must be positive numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};