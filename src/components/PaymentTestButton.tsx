import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/services/paymentService';
import { authService } from '@/services/authService';

/**
 * Composant de test pour le système de paiement
 * À utiliser uniquement en développement
 */
const PaymentTestButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('1000');
  
  const handleTestPayment = async () => {
    setIsLoading(true);
    try {
      // Vérifier l'authentification
      const user = authService.getUser();
      if (!user) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour tester le paiement",
          variant: "destructive"
        });
        return;
      }

      // Préparer la requête de test
      const testPaymentRequest = {
        amount: parseFloat(amount),
        currency: 'XOF',
        email: user.email,
        phoneNumber: user.phone || '+221000000000',
        name: `${user.firstName} ${user.lastName}`,
        redirectUrl: `${window.location.origin}/payment/callback`
      };

      console.log('🧪 Test de paiement:', testPaymentRequest);

      // Initier le paiement
      const response = await paymentService.initiatePayment(testPaymentRequest);

      if (response.status === 'success' && response.data.link) {
        toast({
          title: "Lien de paiement généré !",
          description: "Redirection vers Flutterwave..."
        });

        console.log('✅ Lien de paiement:', response.data.link);
        console.log('📋 TX Ref:', response.data.tx_ref);

        // Rediriger vers Flutterwave après un court délai
        setTimeout(() => {
          window.location.href = response.data.link;
        }, 1500);
      } else {
        throw new Error('Impossible de générer le lien de paiement');
      }
    } catch (error: any) {
      console.error('❌ Erreur test paiement:', error);
      toast({
        title: "Erreur de test",
        description: error.message || "Impossible de tester le paiement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-yellow-400 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Test de Paiement (Dev)
        </CardTitle>
        <CardDescription>
          Testez le système de paiement Flutterwave
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test-amount">Montant (XOF)</Label>
          <Input
            id="test-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
          />
        </div>
        
        <Button 
          onClick={handleTestPayment}
          disabled={isLoading || !amount}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération du lien...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Tester le paiement ({amount} XOF)
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>🔒 Utilisez les cartes de test Flutterwave :</p>
          <p className="font-mono">5531886652142950 • CVV: 564 • Exp: 09/32 • Pin: 3310 • OTP: 12345</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTestButton;

