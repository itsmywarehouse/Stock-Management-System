import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileText, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';

interface ProductImportProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductImport: React.FC<ProductImportProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a CSV or XLS file');
        setFile(null);
      }
    }
  };

  const downloadSampleFile = () => {
    const sampleData = `Name,SKU,Category,Quantity,Location,Supplier,MinStockLevel,Price
Wireless Keyboard,KB-001,Electronics,25,Warehouse A,Tech Supplies Inc,10,59.99
Ergonomic Mouse,MS-002,Electronics,30,Warehouse A,Tech Supplies Inc,15,29.99
Monitor Stand,ST-003,Office Supplies,20,Warehouse B,Office Solutions,5,49.99`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): Product[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map((line) => {
      const values = line.split(',');
      const product: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        switch (header.trim()) {
          case 'Quantity':
          case 'MinStockLevel':
            product[header] = parseInt(value) || 0;
            break;
          case 'Price':
            product[header] = parseFloat(value) || 0;
            break;
          default:
            product[header] = value || '';
        }
      });
      
      return product;
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const products = parseCSV(text);

      const { error: importError } = await supabase
        .from('products')
        .insert(products);

      if (importError) throw importError;

      onSuccess();
    } catch (err) {
      setError('Failed to import products. Please check your file format and try again.');
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
            <p className="text-lg font-medium text-gray-900">Upload Product Data</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV or XLS file containing your product data
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
            Import Products
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
                <li>SKUs must be unique</li>
                <li>Quantities and prices must be numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};