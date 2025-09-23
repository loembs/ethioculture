import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product, ProductFilters } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAllProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
    mutationFn: productService.createProduct,
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
    mutationFn: productService.deleteProduct,
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
    size: 20,
    sortBy: 'name',
    sortOrder: 'asc',
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
      size: 20,
      sortBy: 'name',
      sortOrder: 'asc',
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
