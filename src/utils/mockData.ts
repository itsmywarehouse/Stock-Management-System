import { Product, Transaction, Category, Supplier, User } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    permissions: {
      canAddProduct: true,
      canEditProduct: true,
      canDeleteProduct: true,
      canViewReports: true,
      canManageUsers: true,
    },
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'staff1',
    fullName: 'John Smith',
    email: 'john@example.com',
    role: 'staff',
    permissions: {
      canAddProduct: true,
      canEditProduct: true,
      canDeleteProduct: false,
      canViewReports: true,
      canManageUsers: false,
    },
    createdAt: '2025-01-02T00:00:00Z',
  },
];

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    slug: 'electronics',
    icon: 'smartphone',
    color: '#6366F1',
    count: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'General office equipment and supplies',
    slug: 'office-supplies',
    icon: 'briefcase',
    color: '#10B981',
    count: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Accessories',
    description: 'Various accessories and add-ons',
    slug: 'accessories',
    icon: 'package',
    color: '#F59E0B',
    count: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Keyboard',
    sku: 'KB-001',
    category: 'Electronics',
    quantity: 25,
    location: 'Warehouse A',
    supplier: 'Tech Supplies Inc',
    minStockLevel: 10,
    price: 59.99,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-04-20T14:15:00Z',
    addedBy: 'admin',
  },
  {
    id: '2',
    name: 'Ergonomic Mouse',
    sku: 'MS-002',
    category: 'Electronics',
    quantity: 8,
    location: 'Warehouse A',
    supplier: 'Tech Supplies Inc',
    minStockLevel: 10,
    price: 29.99,
    createdAt: '2025-01-15T10:35:00Z',
    updatedAt: '2025-05-10T11:20:00Z',
    addedBy: 'admin',
  },
  {
    id: '3',
    name: 'Monitor Stand',
    sku: 'ST-003',
    category: 'Office Supplies',
    quantity: 15,
    location: 'Warehouse B',
    supplier: 'Office Solutions',
    minStockLevel: 5,
    price: 49.99,
    createdAt: '2025-02-05T09:15:00Z',
    updatedAt: '2025-04-18T16:45:00Z',
    addedBy: 'staff1',
  },
  {
    id: '4',
    name: 'USB-C Cable',
    sku: 'CB-004',
    category: 'Accessories',
    quantity: 42,
    location: 'Warehouse A',
    supplier: 'Tech Supplies Inc',
    minStockLevel: 20,
    price: 12.99,
    createdAt: '2025-02-10T13:45:00Z',
    updatedAt: '2025-05-05T10:30:00Z',
    addedBy: 'admin',
  },
  {
    id: '5',
    name: 'Wireless Headphones',
    sku: 'HP-005',
    category: 'Electronics',
    quantity: 12,
    location: 'Warehouse C',
    supplier: 'Audio Experts',
    minStockLevel: 8,
    price: 89.99,
    createdAt: '2025-01-20T15:30:00Z',
    updatedAt: '2025-04-25T09:10:00Z',
    addedBy: 'staff1',
  },
  {
    id: '6',
    name: 'Desk Lamp',
    sku: 'LP-006',
    category: 'Office Supplies',
    quantity: 18,
    location: 'Warehouse B',
    supplier: 'Office Solutions',
    minStockLevel: 10,
    price: 34.99,
    createdAt: '2025-03-05T11:20:00Z',
    updatedAt: '2025-05-12T14:35:00Z',
    addedBy: 'admin',
  },
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Wireless Keyboard',
    type: 'in',
    quantity: 10,
    date: '2025-04-20T14:15:00Z',
    reason: 'Restock',
    performedBy: 'Admin User',
    auditLog: {
      userId: '1',
      action: 'Stock received',
      timestamp: '2025-04-20T14:15:00Z',
    },
  },
  {
    id: '2',
    productId: '2',
    productName: 'Ergonomic Mouse',
    type: 'out',
    quantity: 5,
    date: '2025-05-10T11:20:00Z',
    reason: 'Customer Order #12345',
    performedBy: 'John Smith',
    auditLog: {
      userId: '2',
      action: 'Stock shipped',
      timestamp: '2025-05-10T11:20:00Z',
    },
  },
  {
    id: '3',
    productId: '3',
    productName: 'Monitor Stand',
    type: 'in',
    quantity: 8,
    date: '2025-04-18T16:45:00Z',
    reason: 'Restock',
    performedBy: 'Admin User',
    auditLog: {
      userId: '1',
      action: 'Stock received',
      timestamp: '2025-04-18T16:45:00Z',
    },
  },
  {
    id: '4',
    productId: '4',
    productName: 'USB-C Cable',
    type: 'out',
    quantity: 12,
    date: '2025-05-05T10:30:00Z',
    reason: 'Customer Order #12346',
    performedBy: 'John Smith',
    auditLog: {
      userId: '2',
      action: 'Stock shipped',
      timestamp: '2025-05-05T10:30:00Z',
    },
  },
  {
    id: '5',
    productId: '5',
    productName: 'Wireless Headphones',
    type: 'in',
    quantity: 6,
    date: '2025-04-25T09:10:00Z',
    reason: 'Restock',
    performedBy: 'Admin User',
    auditLog: {
      userId: '1',
      action: 'Stock received',
      timestamp: '2025-04-25T09:10:00Z',
    },
  },
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Tech Supplies Inc',
    email: 'contact@techsupplies.com',
    phone: '555-123-4567',
  },
  {
    id: '2',
    name: 'Office Solutions',
    email: 'info@officesolutions.com',
    phone: '555-987-6543',
  },
  {
    id: '3',
    name: 'Audio Experts',
    email: 'support@audioexperts.com',
    phone: '555-456-7890',
  },
];

// Get low stock items
export const getLowStockItems = (): Product[] => {
  return products.filter(product => product.quantity <= product.minStockLevel);
};

// Get dashboard stats
export const getDashboardStats = () => {
  return {
    totalProducts: products.length,
    lowStockItems: getLowStockItems().length,
    totalTransactions: transactions.length,
    recentActivity: transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5)
  };
};