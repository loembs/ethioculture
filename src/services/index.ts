// Export de tous les services
export { apiService } from './api';
export { productService } from './productService';
export { cartService } from './cartService';
export { authService } from './authService';
export { orderService } from './orderService';

// Export des types
export type { Product, Review, ProductFilters } from './productService';
export type { CartItem, Cart, AddToCartRequest } from './cartService';
export type { User, LoginRequest, RegisterRequest, AuthResponse } from './authService';
export type { Order, OrderItem, ShippingAddress, CreateOrderRequest, OrderFilters } from './orderService';
export { OrderStatus, PaymentMethod, PaymentStatus } from './orderService';
