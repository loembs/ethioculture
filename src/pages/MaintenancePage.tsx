// =============================================
// PAGE MAINTENANCE / ERREUR
// =============================================
// Affichée en cas de grosse erreur ou maintenance

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Home, RefreshCw, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface MaintenancePageProps {
  type?: 'maintenance' | 'error';
  message?: string;
}

const MaintenancePage = ({ type = 'maintenance', message }: MaintenancePageProps) => {
  const handleRefresh = () => {
    // Nettoyer le cache et recharger
    localStorage.removeItem('error-state');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ethiopian-green/5 via-background to-ethiopian-gold/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-ethiopian-gold/20">
        <CardContent className="p-8 sm:p-12 text-center">
          {/* Logo Geeza */}
          <div className="mb-8">
            <img 
              src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758210753/Geeza_Logo_lwpeuv.png"
              alt="Geeza Logo"
              className="h-24 sm:h-32 w-auto mx-auto"
            />
          </div>

          {/* Icône */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-ethiopian-gold/10 mb-6">
            <Settings className="h-10 w-10 sm:h-12 sm:w-12 text-ethiopian-gold animate-spin-slow" />
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {type === 'maintenance' ? 'En Maintenance' : 'Une erreur est survenue'}
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            {message || 
              (type === 'maintenance' 
                ? "Nous effectuons actuellement des améliorations pour vous offrir une meilleure expérience. Nous serons de retour très bientôt."
                : "Nous rencontrons un problème technique temporaire. Notre équipe travaille à le résoudre."
              )
            }
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRefresh}
              size="lg"
              className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold px-8"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Réessayer
            </Button>
            
            <Link to="/">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-900 text-black font-semibold px-8 w-full sm:w-auto"
              >
                <Home className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Besoin d'aide ?
            </p>
            <a 
              href="mailto:geezacultures@gmail.com"
              className="text-ethiopian-gold hover:text-ethiopian-gold/80 font-medium text-sm flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              geezacultures@gmail.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;

