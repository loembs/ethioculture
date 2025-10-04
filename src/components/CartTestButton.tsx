// Composant de test pour vérifier l'ajout au panier
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartManager } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

export const CartTestButton = () => {
  const { addToCart } = useCartManager();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const testProduct = {
    id: 999,
    name: "Produit Test",
    description: "Produit de test pour vérifier le panier",
    price: 25,
    category: 'art' as const,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    stock: 10,
    available: true,
    isFeatured: false,
    totalSales: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleTestAdd = async () => {
    setIsLoading(true);
    try {
      await addToCart(testProduct, 1);
      toast({
        title: "Test réussi !",
        description: "Le produit de test a été ajouté au panier",
      });
    } catch (error) {
      toast({
        title: "Erreur de test",
        description: "Impossible d'ajouter le produit de test",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTestAdd}
      disabled={isLoading}
      className="bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-white"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? 'Test...' : 'Test Ajout Panier'}
    </Button>
  );
};
