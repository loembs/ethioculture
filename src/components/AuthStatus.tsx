// Composant pour afficher le statut d'authentification et permettre la connexion
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const AuthStatus = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      // Recharger la page pour mettre à jour l'état
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Statut d'Authentification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {authLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-ethiopian-gold" />
            <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
          </div>
        ) : isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                Connecté
              </Badge>
              <span className="text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <div className="text-sm">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rôle:</strong> {user?.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                Non connecté
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Vous utilisez le panier local. Connectez-vous pour synchroniser votre panier.
            </p>
            <Button
              onClick={handleLogin}
              className="w-full bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

