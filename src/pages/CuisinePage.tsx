import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Star, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFiltersComponent } from "@/components/ProductFilters";
import { useCartManager } from "@/hooks/useCart";

const CuisinePage = () => {
  const { toast } = useToast();
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const { addToCart: addToCartHook } = useCartManager();
  const [selectedCategory, setSelectedCategory] = useState("tous");
  
  // Filtrer pour la catégorie cuisine
  const cuisineFilters = { ...filters, category: 'food' as const };
  const { data: productsData, isLoading, error } = useProducts(cuisineFilters);

  const categories = [
    { id: "tous", name: "Tous les plats" },
    { id: "plats-principaux", name: "Plats Principaux" },
    { id: "vegetariens", name: "Végétariens" },
    { id: "boissons", name: "Boissons" },
  ];

  // Gérer les erreurs de chargement
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-4">
            Impossible de charger les produits. Vérifiez votre connexion.
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const dishes = [
    {
      id: 1,
      name: "Doro Wat",
      description: "Ragoût de poulet épicé avec œufs durs, servi sur injera traditionnelle",
      price: 18,
      category: "plats-principaux",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      prepTime: "45 min",
      spiceLevel: 3,
      popular: true
    },
    {
      id: 2,
      name: "Kitfo",
      description: "Bœuf tartare éthiopien aux épices, servi avec mitmita et ayib",
      price: 22,
      category: "plats-principaux", 
      image: "/api/placeholder/300/200",
      rating: 4.9,
      prepTime: "15 min",
      spiceLevel: 2,
      popular: true
    },
    {
      id: 3,
      name: "Vegetarian Combo",
      description: "Assortiment de lentilles, légumes et épinards sur injera",
      price: 15,
      category: "vegetariens",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      prepTime: "30 min",
      spiceLevel: 2,
      popular: false
    },
    {
      id: 4,
      name: "Tej",
      description: "Hydromel éthiopien traditionnel au miel",
      price: 8,
      category: "boissons",
      image: "/api/placeholder/300/200", 
      rating: 4.6,
      prepTime: "5 min",
      spiceLevel: 0,
      popular: false
    }
  ];

  const filteredDishes = selectedCategory === "tous" 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  const handleAddToCart = (dish: typeof dishes[0]) => {
    addToCartHook(dish);
    toast({
      title: "Ajouté au panier",
      description: `${dish.name} a été ajouté à votre panier`,
    });
  };

  const renderSpiceLevel = (level: number) => {
    return (
      <div className="flex">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full mr-1 ${
              i <= level ? "bg-ethiopian-red" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-warm flex items-center justify-center text-white">
        <div className="absolute inset-0 flex">
            <img 
              src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza05_ui5m1p.jpg" 
              alt="Cuisine éthiopienne traditionnelle" 
              className="w-full h-full object-cover"
            />
         
          {/* <div className="w-1/2 h-full">
            <img 
              src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758300357/Geeza04_b48ova.jpg" 
              alt="Plats éthiopiens authentiques" 
              className="w-full h-full object-cover"
            />
          </div> */}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-black/60 to-blue-900/60" />
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="animate-cultural-fade"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Popular Dishes Section */}
        {selectedCategory === "tous" && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-ethiopian-gold mr-2" />
              <h2 className="text-2xl font-bold">Plats les plus vendus</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes
                .filter(dish => dish.popular)
                .map((dish) => (
                  <Card key={dish.id} className="group overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 animate-cultural-fade">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 left-4 bg-ethiopian-gold text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Populaire
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-ethiopian-gold mr-1" />
                          <span className="text-sm font-semibold">{dish.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{dish.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {dish.prepTime}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2 text-xs">Épicé:</span>
                          {renderSpiceLevel(dish.spiceLevel)}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-ethiopian-green">{dish.price}FCFA</span>
                      <Button 
                        onClick={() => handleAddToCart(dish)}
                        className="bg-primary hover:bg-primary/90 animate-dish-hover"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Dishes Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "tous" ? "Tous nos plats" : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish, index) => (
            <Card key={dish.id} className="group overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 animate-cultural-fade" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {dish.popular && (
                  <Badge className="absolute top-4 left-4 bg-ethiopian-gold text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Populaire
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{dish.name}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-ethiopian-gold mr-1" />
                    <span className="text-sm font-semibold">{dish.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{dish.description}</p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {dish.prepTime}
                  </div>
                  {dish.spiceLevel > 0 && (
                    <div className="flex items-center">
                      <span className="mr-2 text-xs">Épicé:</span>
                      {renderSpiceLevel(dish.spiceLevel)}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex items-center justify-between">
                <span className="text-2xl font-bold text-ethiopian-green">{dish.price}€</span>
                <Button 
                  onClick={() => handleAddToCart(dish)}
                  className="bg-primary hover:bg-primary/90 animate-dish-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuisinePage;