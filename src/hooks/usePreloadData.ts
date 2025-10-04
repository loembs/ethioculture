// Hook pour précharger les données essentielles
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import { CacheService } from '@/services/cacheService';

export const usePreloadData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const preloadEssentialData = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const isAuthenticated = authService.isAuthenticated();
        
        // Précharger les produits en vedette
        const featuredCacheKey = 'featured_products';
        if (!CacheService.has(featuredCacheKey)) {
          console.log('Préchargement des produits en vedette...');
          await queryClient.prefetchQuery({
            queryKey: ['products', 'featured'],
            queryFn: () => productService.getFeaturedProducts(),
            staleTime: 15 * 60 * 1000,
          });
        }

        // Précharger les produits d'art
        const artCacheKey = 'products_{"category":"art"}';
        if (!CacheService.has(artCacheKey)) {
          console.log('Préchargement des produits d\'art...');
          await queryClient.prefetchQuery({
            queryKey: ['products', { category: 'art' }],
            queryFn: () => productService.getAllProducts({ category: 'art' }),
            staleTime: 10 * 60 * 1000,
          });
        }

        // Précharger les produits de cuisine
        const foodCacheKey = 'products_{"category":"food"}';
        if (!CacheService.has(foodCacheKey)) {
          console.log('Préchargement des produits de cuisine...');
          await queryClient.prefetchQuery({
            queryKey: ['products', { category: 'food' }],
            queryFn: () => productService.getAllProducts({ category: 'food' }),
            staleTime: 10 * 60 * 1000,
          });
        }

        // Si l'utilisateur est connecté, précharger ses données
        if (isAuthenticated) {
          console.log('Préchargement des données utilisateur...');
          
          // Précharger en parallèle les données utilisateur
          await Promise.all([
            // Profil utilisateur
            queryClient.prefetchQuery({
              queryKey: ['user-profile'],
              queryFn: () => authService.getCurrentUser(),
              staleTime: 5 * 60 * 1000,
            }),
            
            // Commandes de l'utilisateur
            queryClient.prefetchQuery({
              queryKey: ['user-orders'],
              queryFn: () => orderService.getOrderHistory(),
              staleTime: 2 * 60 * 1000,
            }),
            
            // Panier de l'utilisateur
            queryClient.prefetchQuery({
              queryKey: ['user-cart'],
              queryFn: () => cartService.getCart(),
              staleTime: 1 * 60 * 1000,
            }),
          ]);
        }

        console.log('Préchargement terminé avec succès');
      } catch (error) {
        console.warn('Erreur lors du préchargement:', error);
      }
    };

    // Démarrer le préchargement après un court délai
    const timeoutId = setTimeout(preloadEssentialData, 1000);

    return () => clearTimeout(timeoutId);
  }, [queryClient]);
};

// Hook pour précharger les données en arrière-plan
export const useBackgroundPreload = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Précharger les données moins critiques en arrière-plan
    const backgroundPreload = async () => {
      try {
        // Attendre que l'utilisateur soit inactif
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Précharger les sous-catégories d'art
        const subcategories = ['Tableaux', 'Sculptures', 'Accessoires décoratifs', 'Evenements'];
        
        for (const subcategory of subcategories) {
          const cacheKey = `products_{"category":"art","subcategory":"${subcategory}"}`;
          if (!CacheService.has(cacheKey)) {
            await queryClient.prefetchQuery({
              queryKey: ['products', { category: 'art', subcategory }],
              queryFn: () => productService.getAllProducts({ category: 'art', subcategory }),
              staleTime: 10 * 60 * 1000,
            });
          }
        }

        console.log('Préchargement en arrière-plan terminé');
      } catch (error) {
        console.warn('Erreur lors du préchargement en arrière-plan:', error);
      }
    };

    backgroundPreload();
  }, [queryClient]);
};

// Hook pour précharger les données utilisateur après connexion
export const useUserDataPreload = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const preloadUserData = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) return;

        console.log('Préchargement des données utilisateur après connexion...');
        
        // Précharger toutes les données utilisateur en parallèle
        await Promise.allSettled([
          // Profil utilisateur complet
          queryClient.prefetchQuery({
            queryKey: ['user-profile'],
            queryFn: () => authService.getCurrentUser(),
            staleTime: 5 * 60 * 1000,
          }),
          
          // Historique des commandes
          queryClient.prefetchQuery({
            queryKey: ['user-orders'],
            queryFn: () => orderService.getOrderHistory(),
            staleTime: 2 * 60 * 1000,
          }),
          
          // Panier utilisateur
          queryClient.prefetchQuery({
            queryKey: ['user-cart'],
            queryFn: () => cartService.getCart(),
            staleTime: 1 * 60 * 1000,
          }),
          
          // Statistiques des commandes (pour le dashboard) - optionnel
          queryClient.prefetchQuery({
            queryKey: ['user-order-stats'],
            queryFn: () => orderService.getOrderStatistics(),
            staleTime: 5 * 60 * 1000,
            retry: 1, // Une seule tentative en cas d'erreur
          }).catch(error => {
            console.warn('Impossible de précharger les statistiques:', error);
          }),
        ]);

        console.log('Préchargement des données utilisateur terminé');
      } catch (error) {
        console.warn('Erreur lors du préchargement des données utilisateur:', error);
      }
    };

    // Précharger immédiatement si l'utilisateur est déjà connecté
    preloadUserData();

    // Écouter les changements d'authentification
    const handleAuthChange = () => {
      if (authService.isAuthenticated()) {
        preloadUserData();
      }
    };

    // Écouter les événements de connexion
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [queryClient]);
};

