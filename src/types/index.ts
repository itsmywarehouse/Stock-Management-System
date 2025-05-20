export type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff';
  permissions: {
    canAddProduct: boolean;
    canEditProduct: boolean;
    canDeleteProduct: boolean;
    canViewReports: boolean;
    canManageUsers: boolean;
  };
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  location: string;
  supplier: string;
  minStockLevel: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  addedBy: string;
};

export type Transaction = {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  performedBy: string;
  auditLog: {
    userId: string;
    action: string;
    timestamp: string;
  };
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  slug: string;
  count: number;
  createdAt: string;
  updatedAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type DashboardStats = {
  totalProducts: number;
  lowStockItems: number;
  totalTransactions: number;
  recentActivity: Transaction[];
};

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export type Alert = {
  type: AlertType;
  message: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'product' | 'transaction' | 'user';
  entityId: string;
  details: string;
  timestamp: string;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type ReportFilters = {
  dateRange: DateRange;
  productId?: string;
  userId?: string;
  type?: 'in' | 'out';
};

export type ReportData = {
  transactions: Transaction[];
  summary: {
    totalIn: number;
    totalOut: number;
    productWiseStats: {
      productId: string;
      productName: string;
      totalIn: number;
      totalOut: number;
      currentStock: number;
    }[];
    userWiseStats: {
      userId: string;
      username: string;
      totalTransactions: number;
    }[];
  };
};