import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import { useToast } from '@/hooks/use-toast';

// Types (à garder localement pour compatibilité)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  totalSales: number;
  category: 'food' | 'art';
  subcategory?: string;
  image: string;
  stock: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilters {
  category?: 'food' | 'art';
  subcategory?: string;
  search?: string;
  page?: number;
  size?: number;
}

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAllProducts(filters),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: 'food' | 'art') => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productService.getProductsByCategory(category),
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productService.searchProducts(query),
    enabled: !!query && query.length > 2,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (product: any) => productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    },
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, review }: { productId: number; review: any }) =>
      productService.addReview(productId, review),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Avis ajouté",
        description: "Votre avis a été ajouté avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'avis",
        variant: "destructive",
      });
    },
  });
};

// Hook personnalisé pour gérer les filtres de produits
export const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 0,
    size: 20
  });

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset page when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 0,
      size: 20
    });
  };

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
  };
};
