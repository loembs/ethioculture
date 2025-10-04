// Composant de debug pour le panier
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartManager } from '@/hooks/useCart';
import { cartService } from '@/services/cartService';
import { formatPrice } from '@/utils/currency';

export const CartDebug = () => {
  const { cartItems, cartTotal, cartItemCount, isAuthenticated } = useCartManager();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      const localItems = cartService.getLocalCartItems();
      const localTotal = cartService.getLocalCartTotal();
      const localCount = cartService.getLocalCartItemCount();
      
      setDebugInfo({
        isAuthenticated,
        cartItems: cartItems?.length || 0,
        cartTotal: cartTotal || 0,
        cartItemCount: cartItemCount || 0,
        localItems: localItems.length,
        localTotal,
        localCount,
        localStorage: localStorage.getItem('localCart')
      });
    };

    updateDebugInfo();
    
    // Écouter les changements
    const interval = setInterval(updateDebugInfo, 1000);
    
    return () => clearInterval(interval);
  }, [cartItems, cartTotal, cartItemCount, isAuthenticated]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🐛 Debug Panier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">État d'authentification</h4>
            <Badge className={isAuthenticated ? "bg-green-500" : "bg-orange-500"}>
              {isAuthenticated ? "Connecté" : "Non connecté"}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Compteur API</h4>
            <Badge variant="outline">
              {debugInfo.cartItemCount || 0}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Compteur Local</h4>
            <Badge variant="outline">
              {debugInfo.localCount || 0}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Articles API</h4>
            <Badge variant="outline">
              {debugInfo.cartItems || 0}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Articles Local</h4>
            <Badge variant="outline">
              {debugInfo.localItems || 0}
            </Badge>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Total Local</h4>
            <Badge variant="outline">
              {formatPrice(debugInfo.localTotal || 0)}
            </Badge>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">localStorage</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {debugInfo.localStorage || "Vide"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
