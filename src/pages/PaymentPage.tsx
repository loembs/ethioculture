import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/utils/currency';
import { orderService } from '@/services/orderService';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const amount = searchParams.get('amount');
  const method = searchParams.get('method');
  
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Simuler le processus de paiement
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simuler un succès (90% de chance)
        const success = Math.random() > 0.1;
        
        if (success) {
          setPaymentStatus('success');
          toast({
            title: "Paiement réussi !",
            description: "Votre commande a été confirmée"
          });
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Paiement échoué",
            description: "Veuillez réessayer ou utiliser un autre moyen de paiement",
            variant: "destructive"
          });
        }
      } catch (error) {
        setPaymentStatus('failed');
        toast({
          title: "Erreur de paiement",
          description: "Une erreur est survenue lors du traitement",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (orderId && amount && method) {
      processPayment();
    }
  }, [orderId, amount, method, toast]);

  if (!orderId || !amount || !method) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Erreur</h2>
              <p className="text-muted-foreground">Informations de paiement manquantes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Paiement en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations de la commande */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Commande #</span>
                <span className="font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant</span>
                <span className="font-bold">{formatPrice(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span>Méthode</span>
                <Badge variant="outline" className="capitalize">{method}</Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              {/* Statut du paiement */}
              {isProcessing && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <div>
                    <h3 className="font-semibold">Traitement en cours...</h3>
                    <p className="text-sm text-muted-foreground">
                      Veuillez patienter pendant que nous traitons votre paiement
                    </p>
                  </div>
                </div>
              )}

              {!isProcessing && paymentStatus === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-green-600">Paiement réussi !</h3>
                    <p className="text-muted-foreground">
                      Votre commande a été confirmée et sera préparée sous peu
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => window.location.href = '/'}>
                    Retour à l'accueil
                  </Button>
                </div>
              )}

              {!isProcessing && paymentStatus === 'failed' && (
                <div className="text-center space-y-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-red-600">Paiement échoué</h3>
                    <p className="text-muted-foreground">
                      Votre paiement n'a pas pu être traité. Veuillez réessayer.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => window.location.href = '/checkout'}>
                      Réessayer
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
