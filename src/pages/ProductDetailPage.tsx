// =============================================
// PAGE DÉTAILS PRODUIT
// =============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Shield } from 'lucide-react';
import { productService } from '@/services';
import { useCartManager } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { WishlistButton } from '@/components/WishlistButton';
import { formatPrice } from '@/utils/currency';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCartManager();
  const [quantity, setQuantity] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);

  // Récupérer le produit
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(Number(id)),
    enabled: !!id
  });

  // Tracker la vue
  useEffect(() => {
    if (product) {
      import('@/services/tracking.service').then(({ trackingService }) => {
        trackingService.trackProductView(product.id);
      });
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast({
        title: 'Ajouté au panier',
        description: `${product.name} (x${quantity}) ajouté au panier`
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter au panier",
        variant: 'destructive'
      });
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    try {
      // Créer la commande directement
      const orderData = {
        items: [{
          product_id: product.id,
          quantity,
          unit_price: product.price
        }],
        total_amount: product.price * quantity,
        payment_method: 'CARD',
        shipping_address: {
          // À compléter par l'utilisateur dans CheckoutPage
          first_name: '',
          last_name: '',
          address: '',
          city: '',
          postal_code: '',
          country: 'Sénégal',
          phone: ''
        }
      };

      // Rediriger vers la page de checkout
      navigate('/checkout', { state: { product, quantity } });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de passer la commande',
        variant: 'destructive'
      });
    } finally {
      setBuyingNow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produit non trouvé</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <WishlistButton productId={product.id} size="lg" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={product.available ? 'default' : 'secondary'}>
                  {product.available ? 'Disponible' : 'Rupture de stock'}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    <Star className="h-3 w-3 mr-1" />
                    En vedette
                  </Badge>
                )}
              </div>

              <p className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)} XOF
              </p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-gray-300"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (Pas encore d'avis)
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {product.stock} en stock
              </span>
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantité</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  disabled={quantity <= 1}
                  type="button"
                >
                  -
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuantity(Math.min(product.stock || 999, quantity + 1));
                  }}
                  disabled={quantity >= (product.stock || 999)}
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.available || product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleBuyNow}
                disabled={!product.available || product.stock === 0 || buyingNow}
              >
                Acheter maintenant
              </Button>
            </div>

            {/* Garanties */}
            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span>Livraison rapide disponible</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span>Emballage soigné</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

