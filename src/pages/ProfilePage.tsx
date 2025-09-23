import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  ShoppingBag, 
  Ticket, 
  Heart, 
  Settings, 
  Download,
  Eye,
  Star,
  MapPin,
  Calendar,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");

  // Mock user data
  const user = {
    name: "Amara Bekele",
    email: "amara.bekele@email.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la Paix, 75001 Paris",
    joinDate: "Mars 2023",
    totalOrders: 12,
    favoriteItems: 8
  };

  // Mock orders data
  const orders = [
    {
      id: "CMD001",
      date: "2024-01-15",
      status: "Livré",
      items: ["Doro Wat", "Kitfo", "Tej"],
      total: 45,
      type: "cuisine"
    },
    {
      id: "CMD002", 
      date: "2024-01-10",
      status: "En préparation",
      items: ["Vegetarian Combo"],
      total: 15,
      type: "cuisine"
    }
  ];

  // Mock tickets data
  const tickets = [
    {
      id: "TKT001",
      event: "Festival de Musique Éthiopienne",
      date: "2024-11-15",
      time: "19:00",
      location: "Salle des Fêtes, Paris",
      qrCode: "QR123456789",
      status: "Confirmé"
    },
    {
      id: "TKT002",
      event: "Exposition Art Éthiopien",
      date: "2024-11-20", 
      time: "14:00",
      location: "Galerie Éthiopienne",
      qrCode: "QR987654321",
      status: "Confirmé"
    }
  ];

  // Mock favorites data
  const favorites = [
    {
      id: 1,
      name: "Doro Wat",
      type: "Plat",
      price: 18,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Tisseuse de Habesha",
      type: "Œuvre d'art",
      price: 850,
      image: "/api/placeholder/100/100"
    }
  ];

  const handleUpdateProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès"
    });
  };

  const downloadTicket = (ticketId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Votre billet PDF sera téléchargé dans quelques instants"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Livré":
        return <Badge className="bg-ethiopian-green text-white">Livré</Badge>;
      case "En préparation":
        return <Badge className="bg-ethiopian-gold text-white">En préparation</Badge>;
      case "Confirmé":
        return <Badge className="bg-ethiopian-blue text-white">Confirmé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos commandes, billets et informations personnelles</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback className="bg-gradient-ethiopian text-white text-lg">AB</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Membre depuis</span>
                    <span className="font-medium">{user.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commandes</span>
                    <span className="font-medium">{user.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favoris</span>
                    <span className="font-medium">{user.favoriteItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders" className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Commandes
                </TabsTrigger>
                <TabsTrigger value="tickets" className="flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  Billets
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoris
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">Commande #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold text-ethiopian-green mt-1">{order.total}€</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium mb-1">Articles commandés:</p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.join(", ")}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tickets Tab */}
              <TabsContent value="tickets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes billets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{ticket.event}</h3>
                              <div className="space-y-1 mt-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {new Date(ticket.date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {ticket.time}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {ticket.location}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(ticket.status)}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => downloadTicket(ticket.id)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded text-center">
                            <p className="text-xs text-muted-foreground mb-1">Code QR</p>
                            <p className="font-mono text-sm">{ticket.qrCode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes favoris</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {favorites.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex items-center gap-4">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.type}</p>
                            <p className="text-lg font-bold text-ethiopian-green">{item.price}€</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      <div>
                        <Label htmlFor="birthday">Date de naissance</Label>
                        <Input id="birthday" type="date" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" defaultValue={user.address} />
                    </div>
                    
                    <Separator />
                    
                    <Button onClick={handleUpdateProfile} className="bg-primary hover:bg-primary/90">
                      <Settings className="h-4 w-4 mr-2" />
                      Sauvegarder les modifications
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;