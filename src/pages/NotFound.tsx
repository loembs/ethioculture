import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src="/logogeeza.png" 
              alt="EthioCulture" 
              className="h-20 mx-auto"
            />
          </div>

          {/* Titre 404 */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-ethiopian-red mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Non Trouvée</h2>
            <p className="text-muted-foreground">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="ethiopian-button gap-2"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </div>

          {/* Liens rapides */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">Liens rapides :</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/cuisine')}
                className="text-xs"
              >
                Cuisine
              </Button>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/art')}
                className="text-xs"
              >
                Art
              </Button>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/artists')}
                className="text-xs"
              >
                Artistes
              </Button>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => navigate('/cart')}
                className="text-xs"
              >
                Panier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
