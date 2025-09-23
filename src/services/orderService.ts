import { apiService, ApiResponse, PaginatedResponse } from './api';
import { Product } from './productService';
import { CartItem } from './cartService';

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await apiService.post<Order>('/orders', orderData);
    return response.data;
  }

  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Order>>(
      `/orders?${params.toString()}`
    );
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await apiService.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiService.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await apiService.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await apiService.put<Order>(`/orders/${id}/cancel`, { reason });
    return response.data;
  }

  async addTrackingNumber(id: number, trackingNumber: string): Promise<Order> {
    const response = await apiService.put<Order>(`/orders/${id}/tracking`, { trackingNumber });
    return response.data;
  }

  async getOrderHistory(): Promise<Order[]> {
    const response = await apiService.get<Order[]>('/orders/history');
    return response.data;
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const response = await apiService.get('/orders/statistics');
    return response.data;
  }

  // Méthodes pour les administrateurs
  async getAllOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Order>>(
      `/admin/orders?${params.toString()}`
    );
    return response.data;
  }

  async updateOrderPaymentStatus(id: number, paymentStatus: PaymentStatus): Promise<Order> {
    const response = await apiService.put<Order>(`/admin/orders/${id}/payment`, { paymentStatus });
    return response.data;
  }

  // Utilitaires
  getOrderStatusLabel(status: OrderStatus): string {
    const labels = {
      [OrderStatus.PENDING]: 'En attente',
      [OrderStatus.CONFIRMED]: 'Confirmée',
      [OrderStatus.PROCESSING]: 'En cours de traitement',
      [OrderStatus.SHIPPED]: 'Expédiée',
      [OrderStatus.DELIVERED]: 'Livrée',
      [OrderStatus.CANCELLED]: 'Annulée',
      [OrderStatus.REFUNDED]: 'Remboursée'
    };
    return labels[status] || status;
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    const labels = {
      [PaymentStatus.PENDING]: 'En attente',
      [PaymentStatus.PAID]: 'Payé',
      [PaymentStatus.FAILED]: 'Échoué',
      [PaymentStatus.REFUNDED]: 'Remboursé'
    };
    return labels[status] || status;
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    const labels = {
      [PaymentMethod.CREDIT_CARD]: 'Carte de crédit',
      [PaymentMethod.PAYPAL]: 'PayPal',
      [PaymentMethod.BANK_TRANSFER]: 'Virement bancaire',
      [PaymentMethod.CASH_ON_DELIVERY]: 'Paiement à la livraison'
    };
    return labels[method] || method;
  }
}

export const orderService = new OrderService();
