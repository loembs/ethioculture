// =============================================
// HOOK PRELOAD DATA - SUPABASE UNIQUEMENT
// =============================================
// Précharge les données essentielles au démarrage

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';

export const usePreloadData = () => {
  const queryClient = useQueryClient();


  useEffect(() => {
    const preloadData = async () => {
      try {
        console.log('🔄 Préchargement des données depuis Supabase...');

        // Précharger TOUTES les données en PARALLÈLE pour être plus rapide
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['products', 'featured'],
            queryFn: () => productService.getFeaturedProducts(),
            staleTime: 15 * 60 * 1000
          }),
          queryClient.prefetchQuery({
            queryKey: ['products', { category: 'food' }],
            queryFn: () => productService.getAllProducts({ category: 'food' }),
            staleTime: 10 * 60 * 1000
          }),
          queryClient.prefetchQuery({
            queryKey: ['products', { category: 'art' }],
            queryFn: () => productService.getAllProducts({ category: 'art' }),
            staleTime: 10 * 60 * 1000
          })
        ]);

        console.log('✅ Données préchargées depuis Supabase');
      } catch (error) {
        console.error('❌ Erreur préchargement:', error);
      }
    };

    preloadData();
  }, [queryClient]);
};
