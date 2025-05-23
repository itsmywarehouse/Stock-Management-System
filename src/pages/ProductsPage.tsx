import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle, Package, Trash2, Edit, Upload } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/products/ProductForm';
import { ProductImport } from '../components/products/ProductImport';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*');
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('name');
    if (data) {
      setCategories(data.map(c => c.name));
    }
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterProducts(value, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search: string, category: string) => {
    let filtered = [...products];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.supplier?.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleSort = (column: keyof Product) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);

    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[column] < b[column]) return isAsc ? 1 : -1;
      if (a[column] > b[column]) return isAsc ? -1 : 1;
      return 0;
    });

    setFilteredProducts(sorted);
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Product, sortable: true },
    { header: 'SKU', accessor: 'sku' as keyof Product, sortable: true },
    { header: 'Category', accessor: 'category' as keyof Product, sortable: true },
    { 
      header: 'Quantity', 
      accessor: (product: Product) => {
        const isLowStock = product.quantity <= product.minStockLevel;
        return (
          <div className="flex items-center">
            <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
              {product.quantity}
            </span>
            {isLowStock && (
              <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
            )}
          </div>
        );
      }
    },
    { header: 'Location', accessor: 'location' as keyof Product, sortable: true },
    { header: 'Supplier', accessor: 'supplier' as keyof Product, sortable: true },
    { 
      header: 'Actions', 
      accessor: (product: Product) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            leftIcon={<Upload size={16} />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Import
          </Button>
          <Button 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus size={16} />}
              >
                Add Product
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={() => {
            fetchProducts();
            setIsAddModalOpen(false);
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Import Products Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Products"
      >
        <ProductImport
          onSuccess={() => {
            fetchProducts();
            setIsImportModalOpen(false);
          }}
          onCancel={() => setIsImportModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
      >
        {selectedProduct && (
          <ProductForm
            initialData={selectedProduct}
            onSubmit={() => {
              fetchProducts();
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Delete Product"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};