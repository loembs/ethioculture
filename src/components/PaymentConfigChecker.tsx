// =============================================
// COMPOSANT: Vérificateur de Configuration Paiement
// =============================================
// Affiche un badge indiquant si Flutterwave est configuré

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { isFlutterwaveConfigured, flutterwaveConfig } from '@/config/flutterwave';
import { supabaseUrl, supabaseAnonKey } from '@/config/supabase';

export const PaymentConfigChecker = () => {
  const flutterwaveOk = isFlutterwaveConfigured();
  const supabaseOk = supabaseUrl && supabaseAnonKey;

  const allConfigured = flutterwaveOk && supabaseOk;

  if (allConfigured) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Configuration OK</AlertTitle>
        <AlertDescription className="text-green-700 text-sm">
          Le système de paiement est correctement configuré et prêt à l'emploi.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Configuration Incomplète</AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="text-sm">Certaines configurations sont manquantes :</p>
        <ul className="text-xs space-y-1 ml-4">
          {!supabaseOk && (
            <li className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              Supabase : Variables manquantes dans .env.local
            </li>
          )}
          {!flutterwaveOk && (
            <li className="flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              Flutterwave : VITE_FLUTTERWAVE_PUBLIC_KEY manquante
            </li>
          )}
        </ul>
        <p className="text-xs mt-2">
          Consultez <strong>INSTALLATION_WIDGET_PAIEMENT.md</strong> pour les instructions.
        </p>
      </AlertDescription>
    </Alert>
  );
};

// Badge simple pour afficher dans le header ou ailleurs
export const PaymentStatusBadge = () => {
  const configured = isFlutterwaveConfigured();

  if (configured) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Paiement activé
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Config. requise
    </Badge>
  );
};





