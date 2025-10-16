import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye, Star, Sparkles, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useCartManager } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';

interface EnhancedProductCardProps {
  product: Product;
  variant?: 'cuisine' | 'art' | 'event';
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  variant = 'cuisine',
  onViewDetails,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCartManager();

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

  const getVariantStyles = () => {
    switch (variant) {
      case 'cuisine':
        return {
          cardClass: 'cuisine-card',
          accentClass: 'cuisine-accent',
          badgeColor: 'bg-ethiopian-green',
          gradientOverlay: 'linear-gradient(135deg, rgba(7, 137, 48, 0.1) 0%, rgba(244, 164, 96, 0.1) 100%)'
        };
      case 'art':
        return {
          cardClass: 'art-card',
          accentClass: 'art-accent',
          badgeColor: 'bg-ethiopian-blue',
          gradientOverlay: 'linear-gradient(135deg, rgba(15, 71, 175, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%)'
        };
      case 'event':
        return {
          cardClass: 'ethiopian-card',
          accentClass: 'ethiopian-card',
          badgeColor: 'bg-ethiopian-red',
          gradientOverlay: 'linear-gradient(135deg, rgba(218, 2, 14, 0.1) 0%, rgba(252, 221, 9, 0.1) 100%)'
        };
      default:
        return {
          cardClass: 'ethiopian-card',
          accentClass: 'ethiopian-card',
          badgeColor: 'bg-gray-600',
          gradientOverlay: 'linear-gradient(135deg, rgba(128, 128, 128, 0.1) 0%, rgba(192, 192, 192, 0.1) 100%)'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div 
      className={`group ${styles.accentClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`${styles.cardClass} h-full transition-all duration-500 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}>
        <CardContent className="p-0">
          {/* Image avec overlay */}
          <div className="relative overflow-hidden">
            <img
              src={product.image || '/api/placeholder/400/300'}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay avec gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: styles.gradientOverlay }}
            ></div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className={`${styles.badgeColor} text-white animate-golden-glow`}>
                  <Crown className="h-3 w-3 mr-1" />
                  Vedette
                </Badge>
              )}
              {product.category === 'food' && variant === 'cuisine' && (
                <Badge className="bg-spice-gold text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Authentique
                </Badge>
              )}
            </div>

            {/* Actions rapides */}
            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlist}
                className={`h-8 w-8 p-0 rounded-full ${
                  isWishlisted 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/80 hover:bg-white text-gray-700'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(product)}
                  className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white text-gray-700"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Indicateur de disponibilité */}
            {!product.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Épuisé
                </Badge>
              </div>
            )}
          </div>

          {/* Contenu de la carte */}
          <div className="p-6">
            <div className="space-y-3">
              {/* Nom et catégorie */}
              <div>
                <h3 className="font-bold text-xl text-gray-900 group-hover:text-ethiopian-red transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {product.category === 'food' ? 'Cuisine Éthiopienne' : 'Art & Culture'}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0} avis)
                  </span>
                </div>
              )}

              {/* Prix et actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold ethiopian-text-gradient">
                    {formatPrice(product.price)}
                  </p>
                  {product.stock && (
                    <p className="text-xs text-gray-500">
                      {product.stock} en stock
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!product.available || isLoading}
                  className={`ethiopian-button transition-all duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  size="sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};














