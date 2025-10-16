import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCartManager } from '@/hooks/useCart';
import { formatPrice, getPreferredCurrency, Currency } from '@/utils/currency';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
  available?: boolean;
  category?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ProductCard = ({
  product,
  onViewDetails,
  showAddToCart = true,
  showWishlist = true,
  className = '',
  style
}: ProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useCartManager();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(getPreferredCurrency());

  // Écouter les changements de devise
  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrentCurrency(getPreferredCurrency());
    };
    
    window.addEventListener('currencyChanged', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  const handleAddToCart = async () => {
    if (!product.available) return;
    
    setIsLoading(true);
    try {
      await addToCart(product, 1);

      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté à votre panier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Retiré de la liste de souhaits" : "Ajouté à la liste de souhaits",
      description: `${product.name} ${isWishlisted ? 'retiré de' : 'ajouté à'} votre liste de souhaits`,
    });
  };

  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      // Navigation automatique vers la page de détails
      navigate(`/product/${product.id}`);
    }
  };


  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Card className={`overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 group ${className}`} style={style}>
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.available && (
            <Badge className="bg-ethiopian-red text-white">
              Indisponible
            </Badge>
          )}
          {product.stock < 10 && product.available && (
            <Badge className="bg-orange-500 text-white">
              Stock limité
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {showWishlist && (
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
              onClick={handleWishlist}
            >
              <Heart 
                className={`h-4 w-4 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`} 
              />
            </Button>
          )}
        </div>

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/90 hover:bg-white text-gray-900"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir les détails
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1 line-clamp-2">
              {product.name}
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                product.category === 'food' 
                  ? 'border-ethiopian-green text-ethiopian-green' 
                  : 'border-ethiopian-gold text-ethiopian-gold'
              }`}
            >
              {product.category === 'food' ? 'Cuisine' : 'Art'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {renderRating(product.rating)}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-ethiopian-green">
            {formatPrice(product.price, currentCurrency)}
          </span>
          {product.stock > 0 && (
            <span className="text-xs text-muted-foreground">
              {product.stock} en stock
            </span>
          )}
        </div>
        
        {showAddToCart && (
          <Button
            onClick={handleAddToCart}
            disabled={!product.available || isLoading}
            className={`${
              product.category === 'food' 
                ? 'bg-ethiopian-green hover:bg-ethiopian-green/90' 
                : 'bg-ethiopian-gold hover:bg-ethiopian-gold/90'
            } text-white`}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? 'Ajout...' : 'Ajouter'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
