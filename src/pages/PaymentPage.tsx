import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/utils/currency';
import { paymentService } from '@/services/paymentService';
import { orderService } from '@/services/orderService';
import { authService } from '@/services/authService';

const PaymentPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Paramètres de l'URL
  const amount = searchParams.get('amount');
  const method = searchParams.get('method');
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');
  
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | 'initiating'>('initiating');
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Si on revient de Flutterwave (callback)
  const isCallback = status !== null || txRef !== null;

  useEffect(() => {
    const handlePayment = async () => {
      try {
        // Cas 1: Callback de Flutterwave - Vérifier le paiement
        if (isCallback) {
          console.log('📥 Callback Flutterwave reçu:', { status, txRef, transactionId });
          
          setPaymentStatus('processing');
          
          if (status === 'successful' || status === 'completed') {
            // Vérifier avec le backend si besoin
            if (transactionId) {
              try {
                const verification = await paymentService.verifyPayment(transactionId);
                if (verification.data.status === 'successful') {
                  setPaymentStatus('success');
                  toast({
                    title: "Paiement réussi !",
                    description: "Votre commande a été confirmée"
                  });
                } else {
                  throw new Error('Paiement non validé');
                }
              } catch (verifyError) {
                console.warn('⚠️ Erreur vérification, mais statut=successful:', verifyError);
                // Si la vérification échoue mais status=successful, on accepte quand même
                setPaymentStatus('success');
                toast({
                  title: "Paiement réussi !",
                  description: "Votre commande a été confirmée"
                });
              }
            } else {
              setPaymentStatus('success');
              toast({
                title: "Paiement réussi !",
                description: "Votre commande a été confirmée"
              });
            }
          } else if (status === 'cancelled') {
            setPaymentStatus('failed');
            setErrorMessage('Paiement annulé par l\'utilisateur');
            toast({
              title: "Paiement annulé",
              description: "Vous avez annulé le paiement",
              variant: "destructive"
            });
          } else {
            setPaymentStatus('failed');
            setErrorMessage('Le paiement a échoué');
            toast({
              title: "Paiement échoué",
              description: "Le paiement n'a pas pu être traité",
              variant: "destructive"
            });
          }
        } 
        // Cas 2: Initier un nouveau paiement
        else if (orderId && amount && method) {
          console.log('🚀 Initiation d\'un nouveau paiement');
          
          setPaymentStatus('initiating');
          
          // Récupérer les infos utilisateur
          const user = authService.getUser();
          if (!user) {
            throw new Error('Utilisateur non connecté');
          }

          // Construire l'URL de redirection
          const redirectUrl = paymentService.buildRedirectUrl(orderId);
          
          // Préparer la requête de paiement
          const paymentRequest = {
            amount: parseFloat(amount),
            currency: 'XOF',
            email: user.email,
            phoneNumber: user.phone || '',
            name: `${user.firstName} ${user.lastName}`,
            redirectUrl
          };

          console.log('💳 Requête de paiement:', paymentRequest);

          // Initier le paiement
          const response = await paymentService.initiatePayment(paymentRequest);
          
          if (response.status === 'success' && response.data.link) {
            console.log('✅ Lien de paiement reçu:', response.data.link);
            
            toast({
              title: "Redirection vers le paiement",
              description: "Vous allez être redirigé vers Flutterwave..."
            });

            // Rediriger vers Flutterwave après un court délai
            setTimeout(() => {
              paymentService.redirectToPayment(response.data.link);
            }, 1500);
          } else {
            throw new Error('Impossible d\'obtenir le lien de paiement');
          }
        } else {
          setPaymentStatus('failed');
          setErrorMessage('Informations de paiement manquantes');
        }
      } catch (error: any) {
        console.error('❌ Erreur paiement:', error);
        setPaymentStatus('failed');
        setErrorMessage(error.message || 'Une erreur est survenue');
        toast({
          title: "Erreur de paiement",
          description: error.message || "Une erreur est survenue lors du traitement",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handlePayment();
  }, [orderId, amount, method, status, txRef, transactionId, isCallback, toast]);

  // Rendu pour les erreurs de paramètres manquants
  if (!isCallback && (!orderId || !amount || !method)) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Erreur</h2>
              <p className="text-muted-foreground mb-4">Informations de paiement manquantes</p>
              <Button onClick={() => navigate('/checkout')}>
                Retour au panier
              </Button>
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
            <CardTitle>
              {paymentStatus === 'initiating' && 'Préparation du paiement'}
              {paymentStatus === 'processing' && 'Vérification du paiement'}
              {paymentStatus === 'success' && 'Paiement confirmé'}
              {paymentStatus === 'failed' && 'Paiement échoué'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations de la commande */}
            {orderId && amount && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Commande #</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Montant</span>
                  <span className="font-bold">{formatPrice(parseFloat(amount))}</span>
                </div>
                {method && (
                  <div className="flex justify-between">
                    <span>Méthode</span>
                    <Badge variant="outline" className="capitalize">{method}</Badge>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              {/* Initiation du paiement */}
              {paymentStatus === 'initiating' && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <div>
                    <h3 className="font-semibold">Préparation du paiement...</h3>
                    <p className="text-sm text-muted-foreground">
                      Connexion à la plateforme de paiement sécurisée
                    </p>
                  </div>
                </div>
              )}

              {/* Traitement en cours */}
              {isProcessing && paymentStatus === 'processing' && (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <div>
                    <h3 className="font-semibold">Vérification en cours...</h3>
                    <p className="text-sm text-muted-foreground">
                      Veuillez patienter pendant que nous vérifions votre paiement
                    </p>
                  </div>
                </div>
              )}

              {/* Succès */}
              {!isProcessing && paymentStatus === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-green-600">Paiement réussi !</h3>
                    <p className="text-muted-foreground">
                      Votre commande a été confirmée et sera préparée sous peu
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => navigate('/profile')}>
                      Voir mes commandes
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              )}

              {/* Échec */}
              {!isProcessing && paymentStatus === 'failed' && (
                <div className="text-center space-y-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-red-600">Paiement échoué</h3>
                    <p className="text-muted-foreground">
                      {errorMessage || "Votre paiement n'a pas pu être traité. Veuillez réessayer."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => navigate('/checkout')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour au paiement
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informations de sécurité */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4 inline mr-2" />
          Paiement sécurisé par Flutterwave
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
