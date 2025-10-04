import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart, CartItem, AddToCartRequest } from '@/services/cartService';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export const useCart = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const result = await cartService.getCart();
        return result || { id: 0, userId: 0, items: [], totalItems: 0, totalPrice: 0, createdAt: '', updatedAt: '' };
      } catch (error) {
        console.error('Error fetching cart:', error);
        return { id: 0, userId: 0, items: [], totalItems: 0, totalPrice: 0, createdAt: '', updatedAt: '' };
      }
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCartItemCount = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: async () => {
      try {
        const result = await cartService.getCartItemCount();
        return result || 0;
      } catch (error) {
        console.error('Error fetching cart count:', error);
        return 0;
      }
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isAuthenticated = authService.isAuthenticated();

  return useMutation({
    mutationFn: (item: AddToCartRequest) => cartService.addToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'article",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé du panier",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
      toast({
        title: "Panier vidé",
        description: "Le panier a été vidé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier",
        variant: "destructive",
      });
    },
  });
};

// Hook pour gérer le panier local (utilisateurs non connectés)
export const useLocalCart = () => {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);
  const [localCartTotal, setLocalCartTotal] = useState(0);
  const [localCartItemCount, setLocalCartItemCount] = useState(0);

  const updateLocalCartState = () => {
    const items = cartService.getLocalCartItems();
    const total = cartService.getLocalCartTotal();
    const count = cartService.getLocalCartItemCount();
    
    setLocalCartItems(items);
    setLocalCartTotal(total);
    setLocalCartItemCount(count);
  };

  useEffect(() => {
    // Charger l'état initial
    updateLocalCartState();

    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'localCart') {
        updateLocalCartState();
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Écouter les changements personnalisés (pour les mêmes onglets)
    const handleCustomStorageChange = () => {
      updateLocalCartState();
    };

    window.addEventListener('localCartChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localCartChanged', handleCustomStorageChange);
    };
  }, []);

  const addToLocalCart = (product: any, quantity: number = 1) => {
    cartService.addToLocalCart(product, quantity);
    updateLocalCartState();
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('localCartChanged'));
  };

  const removeFromLocalCart = (productId: number) => {
    cartService.removeFromLocalCart(productId);
    updateLocalCartState();
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('localCartChanged'));
  };

  const updateLocalCartItem = (productId: number, quantity: number) => {
    cartService.updateLocalCartItem(productId, quantity);
    updateLocalCartState();
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('localCartChanged'));
  };

  const clearLocalCart = () => {
    cartService.clearLocalCart();
    updateLocalCartState();
    // Déclencher un événement personnalisé pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('localCartChanged'));
  };

  return {
    localCartItems,
    localCartTotal,
    localCartItemCount,
    addToLocalCart,
    removeFromLocalCart,
    updateLocalCartItem,
    clearLocalCart,
  };
};

// Hook principal pour gérer le panier (authentifié ou local)
export const useCartManager = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = authService.isAuthenticated();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: cartItemCount, isLoading: countLoading } = useCartItemCount();
  const localCart = useLocalCart();
  
  // Mutations pour les utilisateurs connectés
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  // Écouter les changements du panier local
  useEffect(() => {
    const handleLocalCartChange = () => {
      // Le panier local se met déjà à jour automatiquement
    };

    window.addEventListener('localCartChanged', handleLocalCartChange);
    
    return () => {
      window.removeEventListener('localCartChanged', handleLocalCartChange);
    };
  }, []);

  const addToCart = async (product: any, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        try {
          await addToCartMutation.mutateAsync({
            productId: product.id,
            quantity
          });
          // Forcer la mise à jour immédiate
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
          // Rafraîchir immédiatement les données
          await queryClient.refetchQueries({ queryKey: ['cart'] });
          await queryClient.refetchQueries({ queryKey: ['cart', 'count'] });
        } catch (error: any) {
          // Si erreur d'authentification, nettoyer et utiliser le panier local
          if (error.message?.includes('401')) {
            authService.clearAuth();
          }
          
          // Fallback vers le panier local
          localCart.addToLocalCart(product, quantity);
          // Forcer la mise à jour de l'état local
          window.dispatchEvent(new CustomEvent('localCartChanged'));
        }
      } else {
        // Utiliser le panier local
        localCart.addToLocalCart(product, quantity);
        // Forcer la mise à jour de l'état local
        window.dispatchEvent(new CustomEvent('localCartChanged'));
      }
    } catch (error) {
      // En dernier recours, utiliser le panier local
      localCart.addToLocalCart(product, quantity);
      // Forcer la mise à jour de l'état local
      window.dispatchEvent(new CustomEvent('localCartChanged'));
    }
  };

  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      try {
        // Trouver l'ID de l'item dans le panier
        const cartItem = cart?.items?.find(item => item.productId === productId);
        if (cartItem) {
          await removeFromCartMutation.mutateAsync(cartItem.id);
          // Forcer la mise à jour immédiate
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
          // Rafraîchir immédiatement les données
          await queryClient.refetchQueries({ queryKey: ['cart'] });
          await queryClient.refetchQueries({ queryKey: ['cart', 'count'] });
        }
      } catch (error) {
        // Fallback vers le panier local
        localCart.removeFromLocalCart(productId);
        // Forcer la mise à jour de l'état local
        window.dispatchEvent(new CustomEvent('localCartChanged'));
      }
    } else {
      // Utiliser le panier local
      localCart.removeFromLocalCart(productId);
      // Forcer la mise à jour de l'état local
      window.dispatchEvent(new CustomEvent('localCartChanged'));
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    if (isAuthenticated) {
      try {
        // Trouver l'ID de l'item dans le panier
        const cartItem = cart?.items?.find(item => item.productId === productId);
        if (cartItem) {
          await updateCartItemMutation.mutateAsync({
            itemId: cartItem.id,
            quantity
          });
          // Forcer la mise à jour immédiate
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
          // Rafraîchir immédiatement les données
          await queryClient.refetchQueries({ queryKey: ['cart'] });
          await queryClient.refetchQueries({ queryKey: ['cart', 'count'] });
        }
      } catch (error: any) {
        // Gestion spécifique des erreurs 500
        if (error.message?.includes('500') || 
            error.message?.includes('Erreur serveur') || 
            error.message?.includes('Internal Server Error')) {
          // En cas d'erreur serveur, utiliser le panier local et continuer
          localCart.updateLocalCartItem(productId, quantity);
          // Forcer la mise à jour de l'état local
          window.dispatchEvent(new CustomEvent('localCartChanged'));
          // Invalider les queries pour forcer une resynchronisation plus tard
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });
          // Ne pas relancer l'exception, le fallback local gère
          return;
        } else {
          // Pour les autres erreurs, fallback vers le panier local
          localCart.updateLocalCartItem(productId, quantity);
          // Forcer la mise à jour de l'état local
          window.dispatchEvent(new CustomEvent('localCartChanged'));
        }
      }
    } else {
      // Utiliser le panier local
      localCart.updateLocalCartItem(productId, quantity);
      // Forcer la mise à jour de l'état local
      window.dispatchEvent(new CustomEvent('localCartChanged'));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartMutation.mutateAsync();
      } catch (error) {
        // Fallback vers le panier local
        localCart.clearLocalCart();
        // Forcer la mise à jour de l'état local
        window.dispatchEvent(new CustomEvent('localCartChanged'));
      }
    } else {
      // Utiliser le panier local
      localCart.clearLocalCart();
      // Forcer la mise à jour de l'état local
      window.dispatchEvent(new CustomEvent('localCartChanged'));
    }
  };

  // Calculer le total côté frontend pour plus de fiabilité
  const calculateCartTotal = () => {
    // Toujours utiliser le panier local si disponible, sinon le panier serveur
    const items = localCart.localCartItems.length > 0 ? localCart.localCartItems : (cart?.items || []);
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  };

  const calculateCartItemCount = () => {
    // Toujours utiliser le panier local si disponible, sinon le panier serveur
    const items = localCart.localCartItems.length > 0 ? localCart.localCartItems : (cart?.items || []);
    if (!items || items.length === 0) return 0;
    
    return items.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  return {
    // Données du panier - priorité au panier local si disponible
    cart: isAuthenticated ? cart : null,
    cartItems: localCart.localCartItems.length > 0 ? localCart.localCartItems : (isAuthenticated ? cart?.items : localCart.localCartItems),
    cartTotal: calculateCartTotal(), // Calcul côté frontend
    cartItemCount: calculateCartItemCount(), // Calcul côté frontend
    
    // États de chargement
    isLoading: isAuthenticated ? (cartLoading || countLoading) : false,
    
    // Actions
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    
    // État d'authentification
    isAuthenticated,
  };
};
