import { apiService, ApiResponse } from './api';
import { LocalStorageUtils } from '../utils/localStorageUtils';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  role: 'USER' | 'ADMIN' | 'CLIENT';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface AdminRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Stocker le token et les informations utilisateur
    this.setToken(response.data.token);
    this.setUser(response.data.user);
    
    // Déclencher un événement pour signaler la connexion
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    // Stocker le token et les informations utilisateur
    this.setToken(response.data.token);
    this.setUser(response.data.user);
    
    // Déclencher un événement pour signaler la connexion
    window.dispatchEvent(new CustomEvent('userLoggedIn'));
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/refresh');
    
    this.setToken(response.data.token);
    this.setUser(response.data.user);
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    this.setUser(response.data);
    return response.data;
  }

  async testAuth(): Promise<{authenticated: boolean, user?: User}> {
    try {
      console.log('🔍 Test d\'authentification - Token présent:', !!this.getToken());
      const user = await this.getCurrentUser();
      console.log('✅ Utilisateur récupéré:', user.email, 'Rôle:', user.role);
      return { authenticated: true, user };
    } catch (error) {
      console.error('❌ Test auth failed:', error);
      return { authenticated: false };
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>('/auth/profile', userData);
    this.setUser(response.data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    await apiService.post('/auth/forgot-password', request);
  }

  async confirmPasswordReset(confirm: PasswordResetConfirm): Promise<void> {
    await apiService.post('/auth/reset-password', confirm);
  }

  // Gestion locale du token et de l'utilisateur
  setToken(token: string): void {
    LocalStorageUtils.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return LocalStorageUtils.getItem(this.TOKEN_KEY);
  }

  setUser(user: User): void {
    LocalStorageUtils.setJSONItem(this.USER_KEY, user);
  }

  getUser(): User | null {
    return LocalStorageUtils.getJSONItem<User>(this.USER_KEY);
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  isShopOwner(): boolean {
    const user = this.getUser();
    return user?.role === 'CLIENT';
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Créer un compte administrateur
  async registerAdmin(data: AdminRegisterRequest): Promise<ApiResponse<string>> {
    return apiService.post('/auth/create-admin', data);
  }

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export const authService = new AuthService();
