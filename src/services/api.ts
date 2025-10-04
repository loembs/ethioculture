import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

class ApiService {
  private baseURL: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 seconde

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      // Logs supprimés pour la sécurité
      
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Vérifier si la réponse a du contenu
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { data: null as unknown as T, success: true };
      }
      
      const data = await response.json();
      
      return { data, success: true };
    } catch (error) {
      // Gestion spécifique des erreurs réseau
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Essayer de nouveau si c'est un problème de connexion
        if (retryCount < this.maxRetries) {
          await this.sleep(this.retryDelay * Math.pow(2, retryCount)); // Backoff exponentiel
          return this.request(endpoint, options, retryCount + 1);
        }
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard.');
      }
      
      if (error instanceof Error) {
        // Vérifier les erreurs HTTP2 spécifiques
        if (error.message.includes('ERR_HTTP2_PING_FAILED') || 
            error.message.includes('ERR_NETWORK') ||
            error.message.includes('ERR_INTERNET_DISCONNECTED')) {
          // Essayer de nouveau si c'est un problème réseau
          if (retryCount < this.maxRetries) {
            await this.sleep(this.retryDelay * Math.pow(2, retryCount));
            return this.request(endpoint, options, retryCount + 1);
          }
          throw new Error('Serveur temporairement indisponible. Veuillez réessayer dans quelques minutes.');
        }
        
        // Vérifier les erreurs de timeout
        if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
          // Essayer de nouveau si c'est un timeout
          if (retryCount < this.maxRetries) {
            await this.sleep(this.retryDelay * Math.pow(2, retryCount));
            return this.request(endpoint, options, retryCount + 1);
          }
          throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
        }
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
