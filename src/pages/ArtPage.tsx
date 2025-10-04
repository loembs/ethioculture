import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Calendar, MapPin, Users, Eye, Filter, Search, Palette, Sparkles, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { useCartManager } from "@/hooks/useCart";
import artHero from "@/assets/ethiopian-art-hero.jpg"

const ArtPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("oeuvres");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { addToCart: addToCartHook } = useCartManager();
  
  
  // Filtrer pour la catégorie art
  const artFilters = { 
    category: 'art' as const,
    subcategory: selectedSubcategory || undefined
  };
  const { data: productsData, isLoading, error } = useProducts(artFilters);

  // Sous-catégories disponibles
  const subcategories = [
    { id: 4, name: 'Oeuvres', label: 'Toutes les Œuvres' },
    { id: 5, name: 'Tableaux', label: 'Tableaux' },
    { id: 6, name: 'Sculptures', label: 'Sculptures' },
    { id: 7, name: 'Accessoires décoratifs', label: 'Accessoires' },
    { id: 8, name: 'Evenements', label: 'Événements' }
  ];

  const handleSubcategoryFilter = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
  };

  // Filtrer les événements (sous-catégorie "Evenements")
  const eventFilters = { 
    category: 'art' as const,
    subcategory: 'Evenements'
  };
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useProducts(eventFilters);
  const events = eventsData?.content || [];
  
  // Si "Evenements" est sélectionné, utiliser les événements, sinon les produits normaux
  const products = selectedSubcategory === 'Evenements' ? events : (productsData?.content || []);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Immersif */}
      <section className="section-hero relative h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 flex">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(1.1) contrast(1.1)',
              imageRendering: 'auto'
            }}
            onError={(e) => {
              console.error('Erreur de chargement de la vidéo:', e);
              // Fallback vers une image si la vidéo ne charge pas
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="https://mjmihwjjoknmssnkhpua.supabase.co/storage/v1/object/sign/Art/videogeeza.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81MmY1ZTdhZi1lZjZjLTQyZTgtOWM4Ni01ZTBlNjFlODQ2N2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBcnQvdmlkZW9nZWV6YS5tcDQiLCJpYXQiOjE3NTkzMzg2ODcsImV4cCI6MTc5MDg3NDY4N30.t59Y_T7AZWFqgpRMIfum7RoK-R9tiRxrHvbOCZLpBN8" type="video/mp4" />
          </video>
          {/* Image de fallback si la vidéo ne charge pas */}
          
        </div>
        <div className="absolute inset-0 " />
        
        {/* Éléments décoratifs flottants - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-4 sm:w-6 h-4 sm:h-6 bg-ethiopian-gold rounded-full animate-spice-float opacity-60"></div>
          <div className="absolute top-32 sm:top-40 right-8 sm:right-20 w-3 sm:w-4 h-3 sm:h-4 bg-ethiopian-blue rounded-full animate-spice-float opacity-40 animate-delay-200"></div>
          <div className="absolute bottom-24 sm:bottom-32 left-8 sm:left-20 w-4 sm:w-5 h-4 sm:h-5 bg-ethiopian-red rounded-full animate-spice-float opacity-50 animate-delay-300"></div>
          <div className="absolute bottom-16 sm:bottom-20 right-16 sm:right-32 w-2 sm:w-3 h-2 sm:h-3 bg-ethiopian-gold rounded-full animate-spice-float opacity-30 animate-delay-400"></div>
        </div>
        
        {/* Titre principal */}
        

        {/* Bouton d'action centré */}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:py-12" id="art-section">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="oeuvres" className="flex items-center text-xs sm:text-sm px-2 sm:px-4">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Œuvres d'Art</span>
              <span className="sm:hidden">Art</span>
            </TabsTrigger>
            <TabsTrigger value="evenements" className="flex items-center text-xs sm:text-sm px-2 sm:px-4">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Événements</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="billetterie" className="flex items-center text-xs sm:text-sm px-2 sm:px-4">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Billetterie</span>
              <span className="sm:hidden">Tickets</span>
            </TabsTrigger>
          </TabsList>

          {/* Œuvres d'Art */}
          <TabsContent value="oeuvres" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6 animate-cultural-fade-in">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ethiopian-text-gradient">Collection d'Art </h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4 animate-cultural-slide-up text-sm sm:text-base px-4">
                Découvrez notre sélection d'œuvres d'art authentiques créées par des artistes talentueux
              </p>
            </div>

            {/* Filtres par sous-catégorie - Responsive */}
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 sm:mb-8 animate-cultural-slide-up">
              <Button
                variant={selectedSubcategory === null ? "default" : "outline"}
                onClick={() => handleSubcategoryFilter(null)}
                className={`transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 ${
                  selectedSubcategory === null 
                    ? 'ethiopian-button' 
                    : 'border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Toutes les Œuvres</span>
                <span className="sm:hidden">Toutes</span>
              </Button>
              {subcategories.map((sub, index) => (
                <Button
                  key={sub.id}
                  variant={selectedSubcategory === sub.name ? "default" : "outline"}
                  onClick={() => handleSubcategoryFilter(sub.name)}
                  className={`transition-all duration-300 animate-delay-${(index + 1) * 100} text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3 ${
                    selectedSubcategory === sub.name 
                      ? 'ethiopian-button' 
                      : 'border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white'
                  }`}
                >
                  {sub.label}
                </Button>
              ))}
            </div>

            {/* Affichage des produits */}
            {(selectedSubcategory === 'Evenements' ? eventsLoading : isLoading) ? (
              <ProductGrid products={[]} isLoading={true} skeletonCount={8} />
            ) : (selectedSubcategory === 'Evenements' ? eventsError : error) ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedSubcategory === 'Evenements' ? 'Erreur de chargement des événements' : 'Erreur de chargement des œuvres'}
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedSubcategory === 'Evenements' ? 'Aucun événement trouvé' : 'Aucune œuvre trouvée'}
                </p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}
          </TabsContent>

          {/* Événements */}
          <TabsContent value="evenements" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Événements Culturels</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Participez à nos événements culturels et découvrez la richesse de la tradition éthiopienne
              </p>
            </div>

            {/* Affichage des événements */}
            {eventsLoading ? (
              <ProductGrid products={[]} isLoading={true} skeletonCount={6} />
            ) : eventsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Erreur de chargement des événements</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun événement trouvé</p>
              </div>
            ) : (
              <ProductGrid products={events} />
            )}
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