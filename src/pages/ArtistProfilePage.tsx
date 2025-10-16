// =============================================
// PAGE GALERIE ARTISTE - SUPABASE
// =============================================
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, ArrowLeft, Globe, Mail, Phone, Sparkles } from "lucide-react";
import { artistsService } from "@/services";
import { ProductGrid } from "@/components/ProductGrid";

export default function ArtistProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Récupérer l'artiste
  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistsService.getArtistById(Number(id)),
    enabled: !!id
  });

  // Récupérer les œuvres de l'artiste
  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ['artist-artworks', id],
    queryFn: () => artistsService.getArtistArtworks(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Artiste non trouvé</h2>
          <p className="text-muted-foreground mb-4">L'artiste demandé n'existe pas</p>
          <Button onClick={() => navigate('/art')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section avec Cover Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {artist.coverImage ? (
            <img 
              src={artist.coverImage} 
              alt={artist.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"></div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Profil de l'artiste */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              className="text-white mb-4 hover:bg-white/20"
              onClick={() => navigate('/art')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la galerie
            </Button>

            <div className="flex items-end gap-6">
              {/* Photo de profil */}
              {artist.profileImage ? (
                <img
                  src={artist.profileImage}
                  alt={artist.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center shadow-xl">
                  <Palette className="h-16 w-16 text-purple-600" />
                </div>
              )}

              {/* Informations */}
              <div className="flex-1 text-white pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{artist.fullName}</h1>
                  {artist.isFeatured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Vedette
                    </Badge>
                  )}
                </div>

                {artist.specialty && (
                  <p className="text-xl text-white/90">{artist.specialty}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Biographie */}
        {artist.biography && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Biographie</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">
              {artist.biography}
            </p>
          </div>
        )}

        {artist.website && (
          <div className="mb-8">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Globe className="h-4 w-4 mr-2" />
              <a href={artist.website} target="_blank" rel="noopener noreferrer">
                Site web
              </a>
            </Badge>
          </div>
        )}

        <Separator className="my-8" />

        {/* Œuvres de l'artiste */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Palette className="h-8 w-8 text-ethiopian-gold" />
              Œuvres de {artist.firstName}
            </h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {artworks?.length || 0} œuvre{(artworks?.length || 0) > 1 ? 's' : ''}
            </Badge>
          </div>

          {artworksLoading ? (
            <ProductGrid products={[]} isLoading={true} skeletonCount={6} />
          ) : !artworks || artworks.length === 0 ? (
            <div className="text-center py-20">
              <Palette className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Aucune œuvre disponible</h3>
              <p className="text-muted-foreground mb-6">
                Cet artiste n'a pas encore d'œuvres publiées
              </p>
              <Button onClick={() => navigate('/art')}>
                Découvrir d'autres artistes
              </Button>
            </div>
          ) : (
            <ProductGrid 
              products={artworks} 
              showAddToCart={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
