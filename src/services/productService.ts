import { apiService, ApiResponse, PaginatedResponse } from './api';
import { CacheService } from './cacheService';
import { getStaticProducts, getStaticFeaturedProducts } from '@/data/staticData';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isFeatured:Boolean;
  totalSales:number;
  category: 'food' | 'art';
  subcategory?: string;
  artistId?: number;
  artistName?: string;
  image: string;
  images?: string[];
  stock: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: 'food' | 'art';
  subcategory?: string;
  artistId?: number;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

class ProductService {
  async getAllProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      // Créer une clé de cache unique basée sur les filtres
      const cacheKey = `products_${JSON.stringify(filters || {})}`;
      
      // Vérifier d'abord le cache
      const cachedData = CacheService.get<PaginatedResponse<Product>>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Si pas de cache, essayer l'API avec timeout augmenté (15s)
      const apiPromise = this.fetchFromAPI(filters);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 15000)
      );

      try {
        const result = await Promise.race([apiPromise, timeoutPromise]);
        
        // Sauvegarder dans le cache (5 minutes)
        CacheService.set(cacheKey, result, 5 * 60 * 1000);
        return result;
      } catch (apiError) {
        // Utiliser les données statiques en fallback
        const fallbackResult = this.getStaticFallback(filters);
        
        // Sauvegarder le fallback dans le cache (plus court)
        CacheService.set(cacheKey, fallbackResult, 2 * 60 * 1000);
        return fallbackResult;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // En cas d'erreur, relancer l'exception pour que React Query gère l'état d'erreur
      throw error;
    }
  }

  private async fetchFromAPI(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    // Si on a une catégorie, utiliser l'endpoint /category/{id}
    if (filters?.category) {
      const categoryId = filters.category === 'food' ? 1 : 2;
      let endpoint = `/product/category/${categoryId}`;
      
      // Ajouter les autres paramètres si nécessaire
      const otherParams = new URLSearchParams();
      if (filters.subcategory) {
        otherParams.append('subcategory', filters.subcategory);
      }
      if (filters.search) {
        otherParams.append('search', filters.search);
      }
      
      const response = await apiService.get<any[]>(endpoint);
      
      // Mapper les données du backend vers le format frontend
      const mappedProducts = (response.data || []).map((item: any): Product => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: (item.categoryName?.toLowerCase() === 'food' ? 'food' : 'art') as 'food' | 'art',
        subcategory: item.subcategoryName || item.subcategory,
        image: item.imageUrl || item.image,
        stock: item.stock,
        available: item.available,
        isFeatured: item.isFeatured || false,
        totalSales: item.totalSales || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      }));
      
      return {
        content: mappedProducts,
        totalElements: mappedProducts.length,
        totalPages: 1,
        currentPage: 0,
        size: mappedProducts.length
      };
    }
    
    // Sinon, utiliser l'endpoint général avec paramètres
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'category') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Product>>(
      `/product?${params.toString()}`
    );
    
    // Mapper les données du backend vers le format frontend
    if (response.data?.content) {
      const mappedProducts = response.data.content.map((item: any): Product => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: (item.categoryName?.toLowerCase() === 'food' ? 'food' : 'art') as 'food' | 'art',
        subcategory: item.subcategoryName || item.subcategory,
        image: item.imageUrl || item.image,
        stock: item.stock,
        available: item.available,
        isFeatured: item.isFeatured || false,
        totalSales: item.totalSales || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      }));
      
      return {
        ...response.data,
        content: mappedProducts
      };
    }
    
    return response.data || { content: [], totalElements: 0, totalPages: 0, currentPage: 0, size: 0 };
  }

  private getStaticFallback(filters?: ProductFilters): PaginatedResponse<Product> {
    console.log('Utilisation des données statiques de fallback');
    
    let products: Product[] = [];
    
    if (filters?.category) {
      products = getStaticProducts(filters.category, filters.subcategory);
    } else {
      products = [...getStaticProducts('art'), ...getStaticProducts('food')];
    }
    
    return {
      content: products,
      totalElements: products.length,
      totalPages: 1,
      currentPage: 0,
      size: products.length
    };
  }

  async getProductById(id: number): Promise<Product> {
    const response = await apiService.get<Product>(`/product/${id}`);
    return response.data;
  }

  async getProductsByCategory(category: 'food' | 'art', subcategory?: string): Promise<Product[]> {
    try {
      // Convertir la catégorie en ID numérique pour le backend
      const categoryId = category === 'food' ? 1 : 2;
      
      let endpoint = `/product/category/${categoryId}`;
      
      // Si on a une sous-catégorie, ajouter le filtre
      if (subcategory) {
        endpoint += `?subcategory=${encodeURIComponent(subcategory)}`;
      }
      
      const response = await apiService.get<any[]>(endpoint);
      
      // Mapper les données du backend vers le format frontend
      const products = (response.data || []).map((item: any): Product => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: (item.categoryName?.toLowerCase() === 'food' ? 'food' : 'art') as 'food' | 'art',
        subcategory: item.subcategoryName || item.subcategory,
        image: item.imageUrl || item.image,
        stock: item.stock,
        available: item.available,
        isFeatured: item.isFeatured || false,
        totalSales: item.totalSales || 0,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      }));
      
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      // Vérifier le cache d'abord
      const cacheKey = 'featured_products';
      const cachedData = CacheService.get<Product[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Essayer l'API avec timeout augmenté (10s)
      const apiPromise = apiService.get<Product[]>('/product/featured');
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 10000)
      );

      try {
        const response = await Promise.race([apiPromise, timeoutPromise]);
        const products = response.data;
        
        // Sauvegarder dans le cache
        CacheService.set(cacheKey, products, 10 * 60 * 1000); // 10 minutes
        return products;
      } catch (apiError) {
        // Utiliser les données statiques en fallback
        const fallbackProducts = getStaticFeaturedProducts();
        CacheService.set(cacheKey, fallbackProducts, 2 * 60 * 1000);
        return fallbackProducts;
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await apiService.get<Product[]>(`/product/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiService.post<Product>('/product', product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await apiService.put<Product>(`/product/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/product/${id}`);
  }

  async addReview(productId: number, review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const response = await apiService.post<Review>(`/product/${productId}/reviews`, review);
    return response.data;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await apiService.get<Review[]>(`/product/${productId}/reviews`);
    return response.data;
  }
}

export const productService = new ProductService();
