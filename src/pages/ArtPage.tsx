import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Calendar, MapPin, Users, Eye, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { useCartManager } from "@/hooks/useCart";
import artHero from "@/assets/ethiopian-art-hero.jpg"

const ArtPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("oeuvres");
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const { addToCart: addToCartHook } = useCartManager();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtrer pour la catégorie art
  const artFilters = { ...filters, category: 'art' as const };
  const { data: productsData, isLoading, error } = useProducts(artFilters);

  const artworks = [
    {
      id: 1,
      title: "Tisseuse de Habesha",
      artist: "Aida Muluneh",
      price: 850,
      category: "Photographie",
      image: "/api/placeholder/300/400",
      description: "Photographie contemporaine célébrant les tisseuses traditionnelles",
      dimensions: "60x80 cm",
      year: 2023,
      available: true
    },
    {
      id: 2,
      title: "Rythmes Ancestraux",
      artist: "Dawit Abebe",
      price: 1200,
      category: "Peinture",
      image: "/api/placeholder/300/400", 
      description: "Peinture acrylique représentant la musique traditionnelle éthiopienne",
      dimensions: "80x100 cm",
      year: 2022,
      available: true
    },
    {
      id: 3,
      title: "Sculpture Lalibela",
      artist: "Elias Sime",
      price: 2500,
      category: "Sculpture",
      image: "/api/placeholder/300/400",
      description: "Sculpture contemporaine inspirée de l'architecture de Lalibela", 
      dimensions: "40x25x60 cm",
      year: 2023,
      available: false
    }
  ];

  const events = [
    {
      id: 1,
      title: "Festival de Musique Éthiopienne Contemporaine",
      date: "2024-11-15",
      time: "19:00",
      location: "Salle des Fêtes, Paris",
      price: 35,
      image: "/api/placeholder/400/250",
      description: "Une soirée exceptionnelle avec les meilleurs artistes éthiopiens",
      availableSeats: 45,
      totalSeats: 200
    },
    {
      id: 2,
      title: "Exposition: L'Art Éthiopien à Travers les Siècles",
      date: "2024-11-20",
      time: "14:00", 
      location: "Galerie Éthiopienne, Paris",
      price: 15,
      image: "/api/placeholder/400/250",
      description: "Découvrez l'évolution de l'art éthiopien de l'Antiquité à nos jours",
      availableSeats: 120,
      totalSeats: 150
    },
    {
      id: 3,
      title: "Atelier de Cuisine & Peinture",
      date: "2024-11-25",
      time: "10:00",
      location: "Centre Culturel, Lyon",
      price: 55,
      image: "/api/placeholder/400/250",
      description: "Allier l'art culinaire et pictural dans un atelier unique",
      availableSeats: 8,
      totalSeats: 20
    }
  ];

  const handleAddToCart = (item: any, type: 'artwork' | 'ticket') => {
    addToCartHook(item);
    toast({
      title: type === 'artwork' ? "Œuvre ajoutée au panier" : "Billet ajouté au panier",
      description: `${item.title} a été ajouté à votre panier`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-warm flex items-center justify-center text-white">
      <div className="absolute inset-0 flex">
            <img 
              src={artHero} 
              alt="Cuisine éthiopienne traditionnelle" 
              className="w-full h-full object-cover"
            />
         
          </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-8">
            <TabsTrigger value="oeuvres" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Œuvres d'Art
            </TabsTrigger>
            <TabsTrigger value="evenements" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Événements
            </TabsTrigger>
            <TabsTrigger value="billetterie" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Billetterie
            </TabsTrigger>
          </TabsList>

          {/* Œuvres d'Art */}
          <TabsContent value="oeuvres" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Collection d'Art Éthiopien</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection d'œuvres d'art authentiques créées par des artistes éthiopiens reconnus
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork, index) => (
                <Card key={artwork.id} className="overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 animate-cultural-fade" style={{animationDelay: `${index * 0.15}s`}}>
                  <div className="relative h-80 overflow-hidden group">
                    <img 
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-4 right-4 ${artwork.available ? 'bg-ethiopian-green' : 'bg-ethiopian-red'}`}>
                      {artwork.available ? 'Disponible' : 'Vendu'}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium">{artwork.dimensions}</p>
                        <p className="text-xs opacity-80">{artwork.year}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{artwork.title}</CardTitle>
                        <p className="text-ethiopian-gold font-medium">{artwork.artist}</p>
                      </div>
                      <Badge variant="outline" className="border-ethiopian-silver">
                        {artwork.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{artwork.description}</p>
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ethiopian-green">{artwork.price}€</span>
                    <Button 
                      onClick={() => handleAddToCart(artwork, 'artwork')}
                      disabled={!artwork.available}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {artwork.available ? 'Acheter' : 'Indisponible'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Événements */}
          <TabsContent value="evenements" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Événements Culturels</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Participez à nos événements culturels et découvrez la richesse de la tradition éthiopienne
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Card key={event.id} className="overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 animate-cultural-fade" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-ethiopian-gold font-semibold text-sm">
                        {new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-ethiopian-red" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-ethiopian-blue" />
                        {event.availableSeats} places disponibles
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-ethiopian-green">{event.price}€</span>
                    <Button 
                      onClick={() => handleAddToCart(event, 'ticket')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billetterie */}
          <TabsContent value="billetterie">
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-ethiopian-gold mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Billetterie en Ligne</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Réservez vos places pour nos événements culturels. Vos billets seront envoyés par email avec un QR code.
              </p>
              <Button size="lg" onClick={() => setActiveTab("evenements")} className="bg-primary hover:bg-primary/90">
                Voir les Événements Disponibles
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtPage;