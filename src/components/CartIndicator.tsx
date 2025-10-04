// Composant pour afficher l'indicateur du panier avec le nombre d'articles
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCartManager } from '@/hooks/useCart';
import { useState, useEffect } from 'react';

export const CartIndicator = () => {
  const { cartItemCount, isLoading } = useCartManager();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Écouter les changements du panier local
  useEffect(() => {
    const handleCartChange = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('localCartChanged', handleCartChange);
    
    return () => {
      window.removeEventListener('localCartChanged', handleCartChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative">
        <ShoppingCart className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ShoppingCart className="h-6 w-6" />
      {cartItemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </Badge>
      )}
    </div>
  );
};



