import { apiService, ApiResponse } from './api';

export interface AdminStatistics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  availableProducts: number;
  featuredProducts: number;
  categoryStats: Record<string, number>;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerEmail: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  category: any;
  subcategory: string;
  stock: number;
  available: boolean;
  isFeatured: boolean;
  totalSales: number;
  rating: number;
  createdAt: string;
}

export interface DashboardData {
  statistics: AdminStatistics;
  recentOrders: AdminOrder[];
  popularProducts: AdminProduct[];
  salesEvolution: {
    thisMonth: number;
    lastMonth: number;
  };
}

class AdminService {
  // Récupérer les statistiques générales
  async getStatistics(): Promise<ApiResponse<AdminStatistics>> {
    return apiService.get('/admin/statistics');
  }

  // Récupérer toutes les commandes avec pagination
  async getOrders(params?: {
    page?: number;
    size?: number;
    status?: string;
    paymentStatus?: string;
  }): Promise<ApiResponse<{ content: AdminOrder[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    
    const url = `/admin/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get(url);
  }

  // Récupérer tous les produits avec pagination
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<ApiResponse<{ content: AdminProduct[]; totalElements: number; totalPages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `/admin/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return apiService.get(url);
  }

  // Récupérer les commandes récentes
  async getRecentOrders(limit: number = 10): Promise<ApiResponse<AdminOrder[]>> {
    return apiService.get(`/admin/recent-orders?limit=${limit}`);
  }

  // Récupérer les produits populaires
  async getPopularProducts(limit: number = 10): Promise<ApiResponse<AdminProduct[]>> {
    return apiService.get(`/admin/popular-products?limit=${limit}`);
  }

  // Récupérer toutes les données du dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return apiService.get('/admin/dashboard-data');
  }
}

export const adminService = new AdminService();
