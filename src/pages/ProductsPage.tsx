import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, AlertCircle, Package, Trash2, Edit } from 'lucide-react';
import { Table } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/products/ProductForm';
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

  // Rest of your existing filtering and sorting logic...

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
        <Button 
          leftIcon={<Plus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <Card>
        {/* Your existing search and filter UI */}
        
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