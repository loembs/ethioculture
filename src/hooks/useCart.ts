import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, Cart, CartItem, AddToCartRequest } from '@/services/cartService';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export const useCart = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCartItemCount = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  return useQuery({
    queryKey: ['cart', 'count'],
    queryFn: () => cartService.getCartItemCount(),
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

  useEffect(() => {
    const items = cartService.getLocalCartItems();
    const total = cartService.getLocalCartTotal();
    const count = cartService.getLocalCartItemCount();
    
    setLocalCartItems(items);
    setLocalCartTotal(total);
    setLocalCartItemCount(count);
  }, []);

  const addToLocalCart = (product: any, quantity: number = 1) => {
    cartService.addToLocalCart(product, quantity);
    updateLocalCartState();
  };

  const removeFromLocalCart = (productId: number) => {
    cartService.removeFromLocalCart(productId);
    updateLocalCartState();
  };

  const updateLocalCartItem = (productId: number, quantity: number) => {
    cartService.updateLocalCartItem(productId, quantity);
    updateLocalCartState();
  };

  const clearLocalCart = () => {
    cartService.clearLocalCart();
    updateLocalCartState();
  };

  const updateLocalCartState = () => {
    const items = cartService.getLocalCartItems();
    const total = cartService.getLocalCartTotal();
    const count = cartService.getLocalCartItemCount();
    
    setLocalCartItems(items);
    setLocalCartTotal(total);
    setLocalCartItemCount(count);
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
  const isAuthenticated = authService.isAuthenticated();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: cartItemCount, isLoading: countLoading } = useCartItemCount();
  const localCart = useLocalCart();

  const addToCart = (product: any, quantity: number = 1) => {
    if (isAuthenticated) {
      // Utiliser l'API pour les utilisateurs connectés
      // Note: Vous devrez implémenter la mutation ici
      console.log('Adding to authenticated cart:', product, quantity);
    } else {
      // Utiliser le panier local
      localCart.addToLocalCart(product, quantity);
    }
  };

  const removeFromCart = (productId: number) => {
    if (isAuthenticated) {
      // Utiliser l'API pour les utilisateurs connectés
      console.log('Removing from authenticated cart:', productId);
    } else {
      // Utiliser le panier local
      localCart.removeFromLocalCart(productId);
    }
  };

  const updateCartItem = (productId: number, quantity: number) => {
    if (isAuthenticated) {
      // Utiliser l'API pour les utilisateurs connectés
      console.log('Updating authenticated cart item:', productId, quantity);
    } else {
      // Utiliser le panier local
      localCart.updateLocalCartItem(productId, quantity);
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      // Utiliser l'API pour les utilisateurs connectés
      console.log('Clearing authenticated cart');
    } else {
      // Utiliser le panier local
      localCart.clearLocalCart();
    }
  };

  return {
    // Données du panier
    cart: isAuthenticated ? cart : null,
    cartItems: isAuthenticated ? cart?.items : localCart.localCartItems,
    cartTotal: isAuthenticated ? cart?.totalPrice : localCart.localCartTotal,
    cartItemCount: isAuthenticated ? cartItemCount : localCart.localCartItemCount,
    
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
