import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Search,
  MapPin,
  Globe,
  Mail,
  Phone,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { artistService, Artist } from "@/services/artistService";
import { formatPrice } from "@/utils/currency";

const ArtGalleryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName' | 'artworkCount'>('artworkCount');

  // Récupérer tous les artistes
  const { data: artistsData, isLoading } = useQuery({
    queryKey: ['artists', searchTerm, sortBy],
    queryFn: () => artistService.getAllArtists({
      search: searchTerm || undefined,
      sortBy,
      sortOrder: 'desc',
      size: 50
    }),
  });

  // Récupérer les artistes en vedette
  const { data: featuredArtists } = useQuery({
    queryKey: ['featured-artists'],
    queryFn: () => artistService.getFeaturedArtists(),
  });

  const artists = artistsData?.content || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full mb-6">
              <Palette className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Galerie d'Art Éthiopienne</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Découvrez Nos Artistes
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Une collection unique d'œuvres d'art africains créées par des artistes talentueux
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Artistes en Vedette */}
        {featuredArtists && featuredArtists.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Artistes en Vedette</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists.slice(0, 3).map((artist) => (
                <FeaturedArtistCard key={artist.id} artist={artist} onClick={() => navigate(`/artists/${artist.id}`)} />
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* Filtres et Recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un artiste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artworkCount">Plus d'œuvres</SelectItem>
              <SelectItem value="firstName">Prénom</SelectItem>
              <SelectItem value="lastName">Nom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des Artistes */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => navigate(`/artists/${artist.id}`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun artiste trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Essayez une autre recherche" : "Aucun artiste disponible pour le moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Carte d'artiste en vedette
const FeaturedArtistCard = ({ artist, onClick }: { artist: Artist; onClick: () => void }) => (
  <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
    <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
      {artist.coverImage ? (
        <img src={artist.coverImage} alt={artist.fullName} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Palette className="h-16 w-16 text-white opacity-50" />
        </div>
      )}
      <div className="absolute top-4 right-4">
        <Badge className="bg-yellow-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          Vedette
        </Badge>
      </div>
    </div>
    <CardHeader>
      <div className="flex items-start gap-4">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.fullName} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Palette className="h-8 w-8 text-purple-600" />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-xl mb-1">{artist.fullName}</CardTitle>
          {artist.specialty && (
            <p className="text-sm text-muted-foreground">{artist.specialty}</p>
          )}
          {artist.artworkCount !== undefined && (
            <p className="text-xs text-muted-foreground mt-2">
              {artist.artworkCount} œuvre{artist.artworkCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </CardHeader>
  </Card>
);

// Carte d'artiste normale
const ArtistCard = ({ artist, onClick }: { artist: Artist; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
    <CardHeader>
      <div className="flex items-start gap-4 mb-4">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.fullName} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
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

      <Button variant="outline" className="w-full mt-4" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        Voir les œuvres
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </CardHeader>
  </Card>
);

export default ArtGalleryPage;

