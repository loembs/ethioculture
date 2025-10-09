import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Sparkles,
  ShoppingCart,
  Eye
} from "lucide-react";
import { artistService } from "@/services/artistService";
import { formatPrice } from "@/utils/currency";
import { useCartManager } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const ArtistProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCartManager();

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistService.getArtistById(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = async (artwork: any) => {
    try {
      await addToCart(artwork, 1);
      toast({
        title: "Ajouté au panier",
        description: `${artwork.name} a été ajouté à votre panier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Artiste non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Cet artiste n'existe pas ou a été supprimé
          </p>
          <Button onClick={() => navigate('/artists')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la galerie
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-purple-400 to-pink-400">
        {artist.coverImage ? (
          <img src={artist.coverImage} alt={artist.fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Palette className="h-32 w-32 text-white opacity-30" />
          </div>
        )}
        {artist.isFeatured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-500 text-white">
              <Sparkles className="h-4 w-4 mr-1" />
              Artiste en Vedette
            </Badge>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {artist.profileImage ? (
                  <img
                    src={artist.profileImage}
                    alt={artist.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-background shadow-lg">
                    <Palette className="h-16 w-16 text-purple-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{artist.fullName}</h1>
                    {artist.specialty && (
                      <Badge variant="secondary" className="text-sm">
                        {artist.specialty}
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => navigate('/artists')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </div>

                {artist.biography && (
                  <p className="text-muted-foreground mb-4 leading-relaxed">{artist.biography}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  {artist.yearsOfExperience && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span>{artist.yearsOfExperience} ans d'expérience</span>
                    </div>
                  )}
                  {artist.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{artist.phone}</span>
                    </div>
                  )}
                  {artist.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${artist.email}`} className="hover:underline">
                        {artist.email}
                      </a>
                    </div>
                  )}
                  {artist.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={artist.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Site web
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artworks Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Œuvres ({artist.artworks?.length || 0})
            </h2>
          </div>

          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artist.artworks.map((artwork: any) => (
                <Card key={artwork.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={artwork.imageUrl || artwork.image}
                      alt={artwork.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!artwork.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive">Non disponible</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg line-clamp-1 mb-2">{artwork.name}</CardTitle>
                    {artwork.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {artwork.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{formatPrice(artwork.price)}</span>
                      {artwork.available && (
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(artwork)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune œuvre disponible</h3>
              <p className="text-muted-foreground">
                Cet artiste n'a pas encore d'œuvres publiées
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfilePage;

