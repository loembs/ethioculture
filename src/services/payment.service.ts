// =============================================
// SERVICE PAIEMENT - SUPABASE + FLUTTERWAVE
// =============================================
import { supabase, supabaseUrl, supabaseAnonKey } from '@/config/supabase'
import { flutterwaveConfig } from '@/config/flutterwave'

export interface PaymentRequest {
  amount: number;
  currency?: string;
  email: string;
  phoneNumber: string;
  name: string;
  orderId: number;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    link: string;
    tx_ref?: string;
  };
}

export interface PaymentVerificationRequest {
  transactionId: string;
  txRef: string;
  orderId: number;
}

export const paymentService = {
  /**
   * Initier un paiement via Flutterwave (Edge Function)
   */
  async initiatePayment(request: PaymentRequest): Promise<FlutterwaveResponse> {
    try {
      console.log('🔄 Initiation du paiement Flutterwave:', request);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'initiation du paiement');
      }

      const data = await response.json();
      console.log('✅ Paiement initié:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur initiation paiement:', error);
      throw error;
    }
  },

  /**
   * Vérifier et confirmer un paiement après succès
   */
  async verifyAndConfirmPayment(verification: PaymentVerificationRequest) {
    try {
      console.log('🔄 Vérification et confirmation du paiement:', verification);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          transaction_id: verification.transactionId,
          tx_ref: verification.txRef,
          order_id: verification.orderId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la vérification');
      }

      const data = await response.json();
      console.log('✅ Paiement vérifié et confirmé:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur vérification paiement:', error);
      throw error;
    }
  },

  /**
   * Vérifier le statut d'un paiement (ancienne méthode pour compatibilité)
   */
  async verifyPayment(transactionId: string) {
    try {
      console.log('🔄 Vérification du paiement:', transactionId);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ transaction_id: transactionId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la vérification');
      }

      const data = await response.json();
      console.log('✅ Paiement vérifié:', data);
      return data;
    } catch (error) {
      console.error('❌ Erreur vérification paiement:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le statut d'une commande après paiement
   */
  async updateOrderPaymentStatus(orderId: number, status: 'PAID' | 'FAILED', transactionRef?: string) {
    try {
      const { error } = await supabase
        .from('ethio_orders')
        .update({
          payment_status: status,
          status: status === 'PAID' ? 'CONFIRMED' : 'PENDING',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      console.log(`✅ Commande ${orderId} mise à jour: ${status}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur mise à jour commande:', error);
      throw error;
    }
  },

  /**
   * Obtenir la clé publique Flutterwave
   */
  getPublicKey() {
    return flutterwaveConfig.publicKey;
  },

  /**
   * Obtenir les méthodes de paiement disponibles
   */
  getPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Carte Bancaire',
        description: 'Visa, Mastercard',
        icon: 'CreditCard',
        enabled: true
      },
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'MTN, Orange, Moov',
        icon: 'Smartphone',
        enabled: true
      }
    ];
  }
};
