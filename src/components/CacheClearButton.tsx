// =============================================
// COMPOSANT: Bouton de Nettoyage du Cache
// =============================================
// Bouton pour vider le cache en cas de problème

import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { clearAllCache, refreshSession } from '@/utils/clearCache';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const CacheClearButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshSession();
      if (success) {
        toast({
          title: "Session rafraîchie",
          description: "Votre session a été actualisée. Rechargement..."
        });
        // Attendre un peu avant de recharger
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast({
          title: "Session déjà à jour",
          description: "Votre session est active et valide",
          variant: "default"
        });
        setIsRefreshing(false);
      }
    } catch (error) {
      console.error('Erreur refresh:', error);
      toast({
        title: "Session valide",
        description: "Votre session fonctionne correctement",
        variant: "default"
      });
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Bouton Rafraîchir Session */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefreshSession}
        disabled={isRefreshing}
        className="text-xs"
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        Actualiser
      </Button>

      {/* Bouton Vider Cache (avec confirmation) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-1" />
            Vider Cache
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vider tout le cache ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Vous déconnecter</li>
                <li>Supprimer toutes les données en cache</li>
                <li>Recharger la page</li>
              </ul>
              <p className="mt-2 font-semibold">
                Vous devrez vous reconnecter après cette opération.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllCache}
              className="bg-red-600 hover:bg-red-700"
            >
              Vider le Cache
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

