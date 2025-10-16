import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Eye, Palette, Sparkles, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts, useProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/ProductGrid";
import { artistsService } from "@/services";
import { ProductFiltersAdvanced } from "@/components/ProductFiltersAdvanced";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Artist {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  biography?: string;
  profileImage?: string;
  coverImage?: string;
  specialty?: string;
  yearsOfExperience?: number;
  isFeatured?: boolean;
  artworkCount?: number;
}

// Composant pour les cartes d'artistes en vedette
const FeaturedArtistCard = ({ artist, onClick }: { artist: Artist; onClick: () => void }) => (
  <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" onClick={onClick}>
    <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
      {artist.coverImage ? (
        <img src={artist.coverImage} alt={artist.fullName} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Palette className="h-16 w-16 text-white opacity-50" />
        </div>
      )}
      <div className="absolute top-4 right-4">
        <Badge className="bg-yellow-500 text-white shadow-lg">
          <Sparkles className="h-3 w-3 mr-1" />
          Vedette
        </Badge>
      </div>
    </div>
    <CardHeader>
      <div className="flex items-start gap-4">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-ethiopian-gold" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center border-2 border-ethiopian-gold">
            <Palette className="h-8 w-8 text-purple-600" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-xl mb-1">{artist.fullName}</CardTitle>
          {artist.specialty && (
            <p className="text-sm text-muted-foreground">{artist.specialty}</p>
          )}
          {artist.artworkCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Palette className="h-3 w-3" />
              {artist.artworkCount} œuvre{artist.artworkCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </CardHeader>
  </Card>
);

// Composant pour les cartes d'artistes normales
const ArtistCard = ({ artist, onClick }: { artist: Artist; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" onClick={onClick}>
    <CardHeader>
      <div className="flex items-start gap-4 mb-4">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.fullName} className="w-20 h-20 rounded-full object-cover border-2 border-purple-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-purple-200">
            <Palette className="h-10 w-10 text-purple-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg mb-1 truncate">{artist.fullName}</CardTitle>
          {artist.specialty && (
            <Badge variant="secondary" className="text-xs">
              {artist.specialty}
            </Badge>
          )}
        </div>
      </div>

      {artist.biography && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {artist.biography}
        </p>
      )}

      <div className="space-y-2 text-sm">
        {artist.artworkCount !== undefined && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Palette className="h-4 w-4" />
            <span>{artist.artworkCount} œuvre{artist.artworkCount > 1 ? 's' : ''}</span>
          </div>
        )}
        {artist.yearsOfExperience && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{artist.yearsOfExperience} ans d'expérience</span>
          </div>
        )}
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-4 border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white" 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        Voir les œuvres
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </CardHeader>
  </Card>
);

const ArtPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("oeuvres");
  const [viewMode, setViewMode] = useState<'products' | 'artists'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceFilters, setPriceFilters] = useState<any>({});
  const { filters, updateFilters } = useProductFilters();
  
  // Filtrer pour la catégorie art avec filtres e-commerce
  const artFilters = { 
    category: 'art' as const,
    search: searchQuery || filters.search
  };
  const { data: productsData, isLoading, error } = useProducts(artFilters);

  // Récupérer les artistes depuis Supabase
  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: () => artistsService.getAllArtists(),
    staleTime: 10 * 60 * 1000
  });

  // Récupérer les artistes en vedette
  const { data: featuredArtists } = useQuery({
    queryKey: ['featured-artists'],
    queryFn: () => artistsService.getFeaturedArtists(),
    staleTime: 15 * 60 * 1000
  });

  // Filtrer les événements
  const eventFilters = { 
    category: 'art' as const,
    subcategory: 'Evenements'
  };
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useProducts(eventFilters);
  const events = eventsData?.content || [];
  
  // Produits pour l'onglet Œuvres d'Art
  let products = productsData?.content || [];
  
  // Appliquer les filtres de prix
  if (priceFilters.minPrice || priceFilters.maxPrice) {
    products = products.filter(p => {
      if (priceFilters.minPrice && p.price < priceFilters.minPrice) return false;
      if (priceFilters.maxPrice && p.price > priceFilters.maxPrice) return false;
      return true;
    });
  }

  // Appliquer le tri
  if (sortBy === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'popular') {
    products = [...products].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0));
  }


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

            {/* Sélecteur de vue : Produits ou Artistes */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                variant={viewMode === 'products' ? "default" : "outline"}
                onClick={() => setViewMode('products')}
                className={`transition-all duration-300 ${
                  viewMode === 'products' 
                    ? 'ethiopian-button' 
                    : 'border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white'
                }`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir les Produits
              </Button>
              <Button
                variant={viewMode === 'artists' ? "default" : "outline"}
                onClick={() => setViewMode('artists')}
                className={`transition-all duration-300 ${
                  viewMode === 'artists' 
                    ? 'ethiopian-button' 
                    : 'border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white'
                }`}
              >
                <Palette className="h-4 w-4 mr-2" />
                Voir les Artistes
              </Button>
            </div>

            {/* Vue Produits */}
            {viewMode === 'products' && (
              <>
                {/* Barre de recherche et filtres e-commerce */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  {/* Recherche */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher une œuvre d'art..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Tri */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-[200px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="price-asc">Prix croissant</SelectItem>
                      <SelectItem value="price-desc">Prix décroissant</SelectItem>
                      <SelectItem value="popular">Plus populaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtres avancés */}
                <ProductFiltersAdvanced 
                  onFilterChange={setPriceFilters}
                  maxPrice={50000}
                />

                {/* Résultats */}
                <div className="mb-4 text-sm text-muted-foreground">
                  {products.length} œuvre{products.length > 1 ? 's' : ''} trouvée{products.length > 1 ? 's' : ''}
                </div>

                {/* Affichage des produits */}
                {isLoading ? (
                  <ProductGrid products={[]} isLoading={true} skeletonCount={8} />
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Erreur de chargement des œuvres</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Aucune œuvre trouvée</p>
                    <p className="text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                  </div>
                ) : (
                  <ProductGrid products={products} />
                )}
              </>
            )}

            {/* Vue Artistes */}
            {viewMode === 'artists' && (
              <>
                {/* Artistes en Vedette */}
                {featuredArtists && featuredArtists.length > 0 && (
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="h-6 w-6 text-ethiopian-gold" />
                      <h3 className="text-2xl font-bold">Artistes en Vedette</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredArtists.map((artist) => (
                        <FeaturedArtistCard 
                          key={artist.id} 
                          artist={artist} 
                          onClick={() => navigate(`/artists/${artist.id}`)} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {featuredArtists && featuredArtists.length > 0 && (
                  <Separator className="my-8" />
                )}

                {/* Tous les Artistes */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Tous les Artistes</h3>
                    <Badge variant="secondary">{artists?.length || 0} artiste{(artists?.length || 0) > 1 ? 's' : ''}</Badge>
                  </div>

                  {artistsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardHeader>
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : artists && artists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artists.map((artist) => (
                        <ArtistCard 
                          key={artist.id} 
                          artist={artist} 
                          onClick={() => navigate(`/artists/${artist.id}`)} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucun artiste trouvé</h3>
                      <p className="text-muted-foreground">Les artistes seront ajoutés bientôt</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setViewMode('products')}
                      >
                        Voir les produits
                      </Button>
                    </div>
                  )}
                </div>
              </>
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