import { apiService, ApiResponse, PaginatedResponse } from './api';

export interface Artist {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  biography?: string;
  profileImage?: string;
  coverImage?: string;
  specialty?: string;
  yearsOfExperience?: number;
  website?: string;
  socialMediaLinks?: string;
  isFeatured: boolean;
  isActive: boolean;
  artworkCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWithArtworks extends Artist {
  artworks: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
  }>;
}

export interface CreateArtistRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  biography?: string;
  profileImage?: string;
  coverImage?: string;
  specialty?: string;
  yearsOfExperience?: number;
  website?: string;
  socialMediaLinks?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ArtistFilters {
  search?: string;
  specialty?: string;
  page?: number;
  size?: number;
  sortBy?: 'firstName' | 'lastName' | 'createdAt' | 'artworkCount';
  sortOrder?: 'asc' | 'desc';
}

class ArtistService {
  async getAllArtists(filters?: ArtistFilters): Promise<PaginatedResponse<Artist>> {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/artists?${queryString}` : '/artists';
    
    const response = await apiService.get<PaginatedResponse<Artist>>(endpoint);
    return response.data;
  }

  async getFeaturedArtists(): Promise<Artist[]> {
    const response = await apiService.get<Artist[]>('/artists/featured');
    return response.data;
  }

  async getArtistById(id: number): Promise<ArtistWithArtworks> {
    const response = await apiService.get<ArtistWithArtworks>(`/artists/${id}`);
    return response.data;
  }

  async getArtistArtworks(artistId: number, page: number = 0, size: number = 20): Promise<PaginatedResponse<any>> {
    const response = await apiService.get<PaginatedResponse<any>>(
      `/artists/${artistId}/artworks?page=${page}&size=${size}`
    );
    return response.data;
  }

  async createArtist(artistData: CreateArtistRequest): Promise<Artist> {
    const response = await apiService.post<Artist>('/artists', artistData);
    return response.data;
  }

  async updateArtist(id: number, artistData: CreateArtistRequest): Promise<Artist> {
    const response = await apiService.put<Artist>(`/artists/${id}`, artistData);
    return response.data;
  }

  async deleteArtist(id: number): Promise<void> {
    await apiService.delete(`/artists/${id}`);
  }
}

export const artistService = new ArtistService();

