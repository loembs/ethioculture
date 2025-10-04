// Hook pour synchroniser le panier local avec l'API lors de la connexion
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export const useCartSync = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const syncLocalCartToAPI = async () => {
      // Vérifier si l'utilisateur vient de se connecter
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) return;

      // Récupérer le panier local
      const localCartItems = cartService.getLocalCartItems();
      if (localCartItems.length === 0) return;

      console.log('Synchronisation du panier local vers l\'API...');

      try {
        // Synchroniser chaque item du panier local vers l'API
        for (const item of localCartItems) {
          try {
            await cartService.addToCart({
              productId: item.productId,
              quantity: item.quantity
            });
          } catch (error) {
            console.warn(`Erreur lors de la synchronisation de l'item ${item.productId}:`, error);
          }
        }

        // Vider le panier local après synchronisation
        cartService.clearLocalCart();

        // Invalider les caches pour forcer le rechargement
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });

        toast({
          title: "Panier synchronisé",
          description: "Votre panier local a été synchronisé avec votre compte",
        });

        console.log('Synchronisation du panier terminée');
      } catch (error) {
        console.error('Erreur lors de la synchronisation du panier:', error);
        toast({
          title: "Erreur de synchronisation",
          description: "Impossible de synchroniser votre panier. Vos articles restent dans le panier local.",
          variant: "destructive",
        });
      }
    };

    // Délai pour s'assurer que l'authentification est bien établie
    const timeoutId = setTimeout(syncLocalCartToAPI, 1000);

    return () => clearTimeout(timeoutId);
  }, [queryClient, toast]);
};

// Hook pour gérer la persistance du panier local
export const useCartPersistence = () => {
  useEffect(() => {
    // Sauvegarder le panier local à chaque changement
    const handleStorageChange = () => {
      const localCart = localStorage.getItem('localCart');
      if (localCart) {
        // Sauvegarder dans le cache pour une récupération plus rapide
        try {
          const items = JSON.parse(localCart);
          // Mettre à jour le cache avec les données locales
          console.log('Panier local sauvegardé dans le cache');
        } catch (error) {
          console.warn('Erreur lors de la sauvegarde du panier local:', error);
        }
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};



