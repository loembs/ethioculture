import { apiService, ApiResponse } from './api';
import { Product } from './productService';
import { CacheService } from './cacheService';
import { authService } from './authService';

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
    try {
      // Vérifier le cache d'abord
      const cacheKey = 'user_cart';
      const cachedCart = CacheService.get<Cart>(cacheKey);
      if (cachedCart) {
        return cachedCart;
      }

      // Essayer l'API avec timeout
      const apiPromise = apiService.get<Cart>('/cart');
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 3000)
      );

      try {
        const response = await Promise.race([apiPromise, timeoutPromise]);
        const cart = response?.data || { id: 0, userId: 0, items: [], totalItems: 0, totalPrice: 0, createdAt: '', updatedAt: '' };
        
        // Mapper les items du panier pour corriger les noms de champs
        if (cart.items) {
          cart.items = cart.items.map((item: any) => ({
            ...item,
            product: {
              ...item.product,
              image: item.product?.imageUrl || item.product?.image || '/placeholder.svg',
              category: item.product?.categoryId === 1 ? 'food' : 'art'
            }
          }));
        }
        
        // Sauvegarder dans le cache (2 minutes)
        CacheService.set(cacheKey, cart, 2 * 60 * 1000);
        return cart;
      } catch (apiError) {
        // Fallback vers le panier local
        return await this.getLocalCartAsCart();
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      return await this.getLocalCartAsCart();
    }
  }

  private async getLocalCartAsCart(): Promise<Cart> {
    const items = await this.getLocalCart();
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    return {
      id: 0,
      userId: 0,
      items,
      totalItems,
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async addToCart(item: AddToCartRequest): Promise<CartItem> {
    try {
      // Vérifier si l'utilisateur est authentifié
      const token = localStorage.getItem('token');
      
      if (!token) {
        const product = await this.getProductById(item.productId);
        this.addToLocalCart(product, item.quantity);
        
        return {
          id: Date.now(),
          productId: item.productId,
          product,
          quantity: item.quantity,
          price: product.price,
          addedAt: new Date().toISOString()
        };
      }


      // Essayer l'API avec timeout
      // Vérifier le token avant l'envoi
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          const payload = JSON.parse(atob(currentToken.split('.')[1]));
          
          // Vérifier si le token est expiré
          if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            const product = await this.getProductById(item.productId);
            this.addToLocalCart(product, item.quantity);
            return {
              id: Date.now(),
              productId: item.productId,
              product,
              quantity: item.quantity,
              price: product.price,
              addedAt: new Date().toISOString()
            };
          }
        } catch (e) {
          // Token invalide, continuer avec l'API
        }
      }
      
      const apiPromise = apiService.post<CartItem>('/cart/items', item);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 3000)
      );

      try {
        const response = await Promise.race([apiPromise, timeoutPromise]);
        const cartItem = response?.data || { id: 0, productId: 0, product: {} as any, quantity: 0, price: 0, addedAt: '' };
        
        // Invalider le cache du panier
        CacheService.remove('user_cart');
        CacheService.remove('cart_count');
        
        return cartItem;
      } catch (apiError: any) {
        // Vérifier si c'est une erreur d'authentification
        if (apiError.message?.includes('401')) {
          // Seulement nettoyer le token si c'est une erreur 401 (non authentifié)
          localStorage.removeItem('token');
        }
        
        // Fallback vers le panier local
        const product = await this.getProductById(item.productId);
        this.addToLocalCart(product, item.quantity);
        
        return {
          id: Date.now(),
          productId: item.productId,
          product,
          quantity: item.quantity,
          price: product.price,
          addedAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  private async getProductById(productId: number): Promise<Product> {
    // Essayer de récupérer le produit depuis le cache d'abord
    const cacheKey = `product_${productId}`;
    const cachedProduct = CacheService.get<Product>(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }

    // Si pas en cache, essayer l'API
    try {
      const response = await apiService.get<Product>(`/product/${productId}`);
      const product = response.data;
      CacheService.set(cacheKey, product, 10 * 60 * 1000); // 10 minutes
      return product;
    } catch (error) {
      // En cas d'erreur, relancer l'exception
      throw new Error(`Produit non trouvé: ${productId}`);
    }
  }

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    try {
      // Validation côté client avant l'envoi
      if (quantity < 0) {
        throw new Error('Quantité invalide');
      }
      
      // Vérifier si le serveur a des problèmes récents
      const lastError = localStorage.getItem('cart_server_error');
      if (lastError) {
        const lastErrorTime = parseInt(lastError);
        const timeSinceError = Date.now() - lastErrorTime;
        // Si moins de 30 secondes depuis la dernière erreur, utiliser le panier local
        if (timeSinceError < 30000) {
          throw new Error('Erreur serveur temporaire');
        } else {
          // Nettoyer l'erreur après 30 secondes
          localStorage.removeItem('cart_server_error');
        }
      }
      
      const response = await apiService.put<CartItem>(`/cart/items/${itemId}`, { quantity });
      
      // Invalider le cache du panier après mise à jour
      CacheService.remove('user_cart');
      CacheService.remove('cart_count');
      
      return response?.data || { id: 0, productId: 0, product: {} as any, quantity: 0, price: 0, addedAt: '' };
    } catch (error: any) {
      // Gestion spécifique des erreurs 500
      if (error.message?.includes('500') || error.message?.includes('Internal Server Error')) {
        // Marquer le serveur comme ayant des problèmes
        localStorage.setItem('cart_server_error', Date.now().toString());
        // En cas d'erreur serveur, ne pas relancer l'exception
        // Le fallback sera géré côté hook
        throw new Error('Erreur serveur temporaire');
      }
      throw error;
    }
  }

  async removeFromCart(itemId: number): Promise<void> {
    try {
      await apiService.delete(`/cart/items/${itemId}`);
      
      // Invalider le cache du panier
      CacheService.remove('user_cart');
      CacheService.remove('cart_count');
    } catch (error) {
      // En cas d'erreur 500, essayer de supprimer du panier local
      if (error instanceof Error && error.message.includes('500')) {
        this.removeFromLocalCartById(itemId);
      }
      
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    await apiService.delete('/cart');
  }

  async getCartItemCount(): Promise<number> {
    try {
      // Vérifier le cache d'abord
      const cacheKey = 'cart_count';
      const cachedCount = CacheService.get<number>(cacheKey);
      if (cachedCount !== null) {
        return cachedCount;
      }

      // Essayer l'API avec timeout
      const apiPromise = apiService.get<{ count: number }>('/cart/count');
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 2000)
      );

      try {
        const response = await Promise.race([apiPromise, timeoutPromise]);
        const count = response?.data?.count || 0;
        
        // Sauvegarder dans le cache (1 minute)
        CacheService.set(cacheKey, count, 1 * 60 * 1000);
        return count;
      } catch (apiError) {
        // Fallback vers le panier local
        return this.getLocalCartItemCount();
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      return this.getLocalCartItemCount();
    }
  }

  // Gestion locale du panier (pour les utilisateurs non connectés)
  private async getLocalCart(): Promise<CartItem[]> {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    
    // Vérifier que tous les items ont des détails complets du produit
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.product || !item.product.name || !item.product.image) {
          // Essayer de récupérer les détails du produit
          try {
            const product = await this.getProductById(item.productId);
            return {
              ...item,
              product,
              price: product.price
            };
          } catch (error) {
            // Retourner l'item tel quel si on ne peut pas récupérer les détails
            return item;
          }
        }
        return item;
      })
    );
    
    return enrichedItems;
  }

  private setLocalCart(items: CartItem[]): void {
    localStorage.setItem('localCart', JSON.stringify(items));
  }

  addToLocalCart(product: Product, quantity: number = 1): void {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = {
        id: Date.now(), // ID temporaire
        productId: product.id,
        product,
        quantity,
        price: product.price,
        addedAt: new Date().toISOString(),
      };
      items.push(newItem);
    }

    this.setLocalCart(items);
  }

  removeFromLocalCart(productId: number): void {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    const filteredItems = items.filter(item => item.productId !== productId);
    this.setLocalCart(filteredItems);
  }

  removeFromLocalCartById(itemId: number): void {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    const filteredItems = items.filter(item => item.id !== itemId);
    this.setLocalCart(filteredItems);
  }

  updateLocalCartItem(productId: number, quantity: number): void {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    const item = items.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromLocalCart(productId);
      } else {
        item.quantity = quantity;
        item.price = item.product?.price || item.price; // S'assurer que le prix est à jour
        this.setLocalCart(items);
      }
    }
  }

  getLocalCartItems(): CartItem[] {
    const cart = localStorage.getItem('localCart');
    return cart ? JSON.parse(cart) : [];
  }

  getLocalCartTotal(): number {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    return items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  }

  getLocalCartItemCount(): number {
    const cart = localStorage.getItem('localCart');
    const items = cart ? JSON.parse(cart) : [];
    return items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  }

  clearLocalCart(): void {
    localStorage.removeItem('localCart');
  }
}

export const cartService = new CartService();
