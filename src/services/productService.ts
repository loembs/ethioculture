import { apiService, ApiResponse, PaginatedResponse } from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'art';
  subcategory?: string;
  image: string;
  images?: string[];
  stock: number;
  available: boolean;
  rating?: number;
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
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await apiService.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getProductsByCategory(category: 'food' | 'art'): Promise<Product[]> {
    const response = await apiService.get<Product[]>(`/products/category/${category}`);
    return response.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiService.get<Product[]>('/products/featured');
    return response.data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await apiService.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiService.post<Product>('/products', product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response = await apiService.put<Product>(`/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/products/${id}`);
  }

  async addReview(productId: number, review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const response = await apiService.post<Review>(`/products/${productId}/reviews`, review);
    return response.data;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await apiService.get<Review[]>(`/products/${productId}/reviews`);
    return response.data;
  }
}

export const productService = new ProductService();
