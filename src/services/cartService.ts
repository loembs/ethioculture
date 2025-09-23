import { apiService, ApiResponse } from './api';
import { Product } from './productService';

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

class CartService {
  async getCart(): Promise<Cart> {
    const response = await apiService.get<Cart>('/cart');
    return response.data;
  }

  async addToCart(item: AddToCartRequest): Promise<CartItem> {
    const response = await apiService.post<CartItem>('/cart/items', item);
    return response.data;
  }

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await apiService.put<CartItem>(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<void> {
    await apiService.delete(`/cart/items/${itemId}`);
  }

  async clearCart(): Promise<void> {
    await apiService.delete('/cart');
  }

  async getCartItemCount(): Promise<number> {
    const response = await apiService.get<{ count: number }>('/cart/count');
    return response.data.count;
  }

  // Gestion locale du panier (pour les utilisateurs non connectés)
  private getLocalCart(): CartItem[] {
    const cart = localStorage.getItem('localCart');
    return cart ? JSON.parse(cart) : [];
  }

  private setLocalCart(items: CartItem[]): void {
    localStorage.setItem('localCart', JSON.stringify(items));
  }

  addToLocalCart(product: Product, quantity: number = 1): void {
    const items = this.getLocalCart();
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({
        id: Date.now(), // ID temporaire
        productId: product.id,
        product,
        quantity,
        price: product.price,
        addedAt: new Date().toISOString(),
      });
    }

    this.setLocalCart(items);
  }

  removeFromLocalCart(productId: number): void {
    const items = this.getLocalCart();
    const filteredItems = items.filter(item => item.productId !== productId);
    this.setLocalCart(filteredItems);
  }

  updateLocalCartItem(productId: number, quantity: number): void {
    const items = this.getLocalCart();
    const item = items.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromLocalCart(productId);
      } else {
        item.quantity = quantity;
        this.setLocalCart(items);
      }
    }
  }

  getLocalCartItems(): CartItem[] {
    return this.getLocalCart();
  }

  getLocalCartTotal(): number {
    const items = this.getLocalCart();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getLocalCartItemCount(): number {
    const items = this.getLocalCart();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  clearLocalCart(): void {
    localStorage.removeItem('localCart');
  }
}

export const cartService = new CartService();
