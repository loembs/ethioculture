import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Smartphone, Wallet, ArrowLeft, Lock, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [deliveryMethod, setDeliveryMethod] = useState("livraison");

  // Mock cart summary
  const cartSummary = {
    items: [
      { name: "Doro Wat", quantity: 2, price: 36 },
      { name: "Tisseuse de Habesha", quantity: 1, price: 850 },
      { name: "Billet Festival", quantity: 2, price: 70 }
    ],
    subtotal: 956,
    delivery: 5,
    total: 961
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Commande en cours de traitement",
      description: "Vous allez être redirigé vers le paiement sécurisé"
    });
  };

  const paymentOptions = [
    { id: "stripe", name: "Carte bancaire (Stripe)", icon: CreditCard, description: "Visa, Mastercard, Apple Pay, Google Pay" },
    { id: "paypal", name: "PayPal", icon: Wallet, description: "Paiement sécurisé via PayPal" },
    { id: "wave", name: "Wave Money", icon: Smartphone, description: "Paiement mobile en Afrique" },
    { id: "orange", name: "Orange Money", icon: Smartphone, description: "Service de paiement mobile" }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input id="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Mode de récupération
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="livraison" id="livraison" />
                      <Label htmlFor="livraison" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Livraison à domicile</div>
                          <div className="text-sm text-muted-foreground">Frais de livraison : 5€ • Délai : 30-45 min</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="emporter" id="emporter" />
                      <Label htmlFor="emporter" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">À emporter</div>
                          <div className="text-sm text-muted-foreground">Gratuit • Prêt en 20-30 min</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryMethod === "livraison" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Adresse de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse *</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input id="postalCode" required />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays *</Label>
                        <Input id="country" defaultValue="France" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                      <Textarea id="instructions" placeholder="Étage, code d'accès, etc." />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Méthode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center">
                            <option.icon className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les{" "}
                      <a href="#" className="text-primary hover:underline">
                        conditions générales de vente
                      </a>{" "}
                      et la{" "}
                      <a href="#" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 animate-ethiopian-pulse" size="lg">
                <Lock className="h-4 w-4 mr-2" />
                Payer {cartSummary.total}€
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Qté: {item.quantity}</div>
                    </div>
                    <span>{item.price}€</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartSummary.subtotal}€</span>
                  </div>
                  {deliveryMethod === "livraison" && (
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{cartSummary.delivery}€</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-ethiopian-green">{cartSummary.total}€</span>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-sm">
                  <div className="flex items-center mb-2">
                    <Lock className="h-4 w-4 mr-2 text-ethiopian-green" />
                    <span className="font-medium">Paiement sécurisé</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Vos informations de paiement sont cryptées et sécurisées selon les normes PCI DSS.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;