// =============================================
// COMPOSANT: Widget de Paiement Flutterwave
// =============================================
// Affiche le widget de paiement Flutterwave inline

import { useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CreditCard, Loader2 } from 'lucide-react';
import { flutterwaveConfig } from '@/config/flutterwave';
import { formatPrice } from '@/utils/currency';

export interface FlutterwavePaymentConfig {
  amount: number;
  email: string;
  phone: string;
  name: string;
  orderId: number;
  orderNumber: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
}

interface FlutterwavePaymentModalProps {
  config: FlutterwavePaymentConfig;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlutterwavePaymentModal = ({ 
  config, 
  isOpen, 
  onOpenChange 
}: FlutterwavePaymentModalProps) => {
  
  // Configuration du paiement Flutterwave
  const flutterwavePaymentConfig = {
    public_key: flutterwaveConfig.publicKey,
    tx_ref: `GZ-${Date.now()}-${config.orderId}`,
    amount: config.amount,
    currency: flutterwaveConfig.currency,
    payment_options: 'card,mobilemoney,ussd,account,banktransfer',
    customer: {
      email: config.email,
      phone_number: config.phone,
      name: config.name,
    },
    customizations: {
      title: flutterwaveConfig.company.name,
      description: `Commande #${config.orderNumber}`,
      logo: flutterwaveConfig.company.logo,
    },
    meta: {
      order_id: config.orderId,
      order_number: config.orderNumber
    }
  };

  // Hook Flutterwave
  const handleFlutterPayment = useFlutterwave(flutterwavePaymentConfig);

  // Ouvrir le widget automatiquement quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Petit délai pour s'assurer que la modal est complètement rendue
      const timer = setTimeout(() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log('✅ Réponse Flutterwave:', response);
            closePaymentModal(); // Fermer le widget Flutterwave
            
            // Vérifier si le paiement est réussi
            if (response.status === 'successful' || response.status === 'completed') {
              config.onSuccess(response);
            } else {
              console.warn('⚠️ Paiement non réussi:', response.status);
            }
            
            onOpenChange(false); // Fermer notre modal
          },
          onClose: () => {
            console.log('❌ Widget Flutterwave fermé');
            closePaymentModal();
            config.onClose();
            onOpenChange(false);
          },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-ethiopian-gold" />
            Paiement sécurisé
          </DialogTitle>
          <DialogDescription>
            Montant à payer : <span className="font-bold text-ethiopian-green">{formatPrice(config.amount)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-ethiopian-gold" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Ouverture du widget de paiement...</p>
            <p className="text-xs text-muted-foreground">
              La fenêtre de paiement Flutterwave va s'ouvrir dans quelques instants
            </p>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg w-full">
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 mt-0.5 text-ethiopian-green flex-shrink-0" />
              <div className="text-xs space-y-1">
                <p className="font-medium">Méthodes de paiement acceptées :</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Cartes bancaires (Visa, Mastercard)</li>
                  <li>Mobile Money (MTN, Orange, Moov)</li>
                  <li>Virement bancaire</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              closePaymentModal();
              config.onClose();
              onOpenChange(false);
            }}
            className="mt-2"
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

