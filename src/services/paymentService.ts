import { apiService } from './api';

// Types pour les requêtes/réponses de paiement
export interface PaymentRequest {
  amount: number;
  currency?: string;
  email: string;
  phoneNumber: string;
  name: string;
  redirectUrl: string;
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    link: string;
    tx_ref?: string;
  };
}

export interface PaymentVerificationResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      phone_number: string;
      name: string;
    };
  };
}

class PaymentService {
  private readonly baseUrl = '/payments';

  /**
   * Initie un paiement via Flutterwave
   */
  async initiatePayment(request: PaymentRequest): Promise<FlutterwaveResponse> {
    try {
      console.log('🔄 Initiation du paiement:', request);
      
      const response = await apiService.post<FlutterwaveResponse>(
        `${this.baseUrl}/initiate`,
        {
          ...request,
          currency: request.currency || 'XOF'
        }
      );

      console.log('✅ Réponse paiement:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur initiation paiement:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async verifyPayment(transactionId: string): Promise<PaymentVerificationResponse> {
    try {
      console.log('🔍 Vérification du paiement:', transactionId);
      
      const response = await apiService.get<PaymentVerificationResponse>(
        `${this.baseUrl}/verify/${transactionId}`
      );

      console.log('✅ Statut paiement:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur vérification paiement:', error);
      throw error;
    }
  }

  /**
   * Redirige vers Flutterwave pour effectuer le paiement
   */
  redirectToPayment(paymentLink: string): void {
    window.location.href = paymentLink;
  }

  /**
   * Construit l'URL de redirection après paiement
   */
  buildRedirectUrl(orderId: string | number): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/payment/callback?orderId=${orderId}`;
  }
}

export const paymentService = new PaymentService();











