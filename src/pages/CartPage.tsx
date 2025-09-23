import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { toast } = useToast();
  
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Doro Wat",
      price: 18,
      quantity: 2,
      category: "cuisine",
      image: "/api/placeholder/80/80",
      description: "Ragoût de poulet épicé traditionnel"
    },
    {
      id: 2,
      name: "Tisseuse de Habesha",
      price: 850,
      quantity: 1,
      category: "art",
      image: "/api/placeholder/80/80",
      description: "Photographie par Aida Muluneh"
    },
    {
      id: 3,
      name: "Billet Festival Musique",
      price: 35,
      quantity: 2,
      category: "evenement",
      image: "/api/placeholder/80/80",
      description: "Festival de Musique Éthiopienne - 15 Nov"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as typeof cartItems
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Article supprimé",
      description: "L'article a été retiré de votre panier"
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.some(item => item.category === 'cuisine') ? 5 : 0;
  const total = subtotal + deliveryFee;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'cuisine':
        return <Badge className="bg-ethiopian-green text-white">Cuisine</Badge>;
      case 'art':
        return <Badge className="bg-ethiopian-gold text-white">Art</Badge>;
      case 'evenement':
        return <Badge className="bg-ethiopian-blue text-white">Événement</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuer les achats
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Mon Panier</h1>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">Découvrez nos délicieux plats et œuvres d'art</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cuisine">
                  <Button className="bg-primary hover:bg-primary/90">
                    Explorer la Cuisine
                  </Button>
                </Link>
                <Link to="/art">
                  <Button variant="outline">
                    Découvrir l'Art
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={item.id} className="animate-cultural-fade" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {getCategoryBadge(item.category)}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-ethiopian-green">
                              {(item.price * item.quantity).toFixed(2)}€
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Frais de livraison</span>
                      <span>{deliveryFee.toFixed(2)}€</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-ethiopian-green">{total.toFixed(2)}€</span>
                  </div>
                  
                  <Link to="/checkout" className="w-full block">
                    <Button className="w-full bg-primary hover:bg-primary/90 animate-ethiopian-pulse">
                      Procéder au paiement
                    </Button>
                  </Link>
                  
                  <div className="text-center">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                      Continuer les achats
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;