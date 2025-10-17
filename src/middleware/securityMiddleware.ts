// =============================================
// MIDDLEWARE DE SÉCURITÉ
// =============================================
// Protections contre les attaques et fraudes

import { sanitizeInput, detectSQLInjection, isSuspiciousRequest, paymentRateLimiter, verifyPaymentIntegrity } from '@/utils/security';

/**
 * Valider et sécuriser les données de commande
 */
export const secureOrderData = (orderData: any): { valid: boolean; sanitized?: any; error?: string } => {
  try {
    // Vérifier si la requête est suspecte
    if (isSuspiciousRequest(orderData)) {
      return { valid: false, error: 'Requête invalide' };
    }

    // Sanitiser les données
    const sanitized = {
      ...orderData,
      shipping_address: {
        first_name: sanitizeInput(orderData.shipping_address?.first_name || ''),
        last_name: sanitizeInput(orderData.shipping_address?.last_name || ''),
        street: sanitizeInput(orderData.shipping_address?.street || ''),
        city: sanitizeInput(orderData.shipping_address?.city || ''),
        country: sanitizeInput(orderData.shipping_address?.country || ''),
        postal_code: sanitizeInput(orderData.shipping_address?.postal_code || ''),
        phone: sanitizeInput(orderData.shipping_address?.phone || '')
      },
      notes: orderData.notes ? sanitizeInput(orderData.notes) : undefined
    };

    // Vérifier les injections SQL dans les champs texte
    const textFields = [
      sanitized.shipping_address.first_name,
      sanitized.shipping_address.last_name,
      sanitized.shipping_address.street,
      sanitized.shipping_address.city,
      sanitized.notes || ''
    ];

    for (const field of textFields) {
      if (detectSQLInjection(field)) {
        return { valid: false, error: 'Données invalides' };
      }
    }

    // Vérifications de sécurité
    if (sanitized.total_amount <= 0 || sanitized.total_amount > 10000000) {
      return { valid: false, error: 'Montant invalide' };
    }

    if (!sanitized.items || sanitized.items.length === 0) {
      return { valid: false, error: 'Panier vide' };
    }

    if (sanitized.items.length > 100) {
      return { valid: false, error: 'Trop d\'articles' };
    }

    return { valid: true, sanitized };
  } catch (error) {
    return { valid: false, error: 'Erreur de validation' };
  }
};

/**
 * Sécuriser les données de paiement
 */
export const securePaymentData = (paymentData: any): { valid: boolean; error?: string } => {
  // Limiter le nombre de tentatives de paiement
  const userKey = `payment-${paymentData.email || 'anonymous'}`;
  
  if (!paymentRateLimiter.canMakeRequest(userKey)) {
    return { valid: false, error: 'Trop de tentatives. Veuillez patienter.' };
  }

  // Vérifier les montants
  if (paymentData.amount <= 0 || paymentData.amount > 10000000) {
    return { valid: false, error: 'Montant invalide' };
  }

  // Vérifier l'email
  if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
    return { valid: false, error: 'Email invalide' };
  }

  // Vérifier le téléphone
  if (!paymentData.phone || paymentData.phone.length < 8) {
    return { valid: false, error: 'Téléphone invalide' };
  }

  return { valid: true };
};

/**
 * Vérifier l'intégrité du callback Flutterwave
 */
export const verifyFlutterwaveCallback = (response: any): boolean => {
  if (!response) return false;

  // Vérifier que c'est bien Flutterwave
  if (!verifyPaymentIntegrity(response)) {
    return false;
  }

  // Vérifier que le statut est valide
  const validStatuses = ['successful', 'completed', 'failed', 'cancelled'];
  if (!validStatuses.includes(response.status)) {
    return false;
  }

  return true;
};

/**
 * Protéger contre les paiements fantômes/doublons
 */
class PaymentGuard {
  private processing: Set<string> = new Set();
  private completed: Map<string, number> = new Map();

  isProcessing(orderId: string): boolean {
    return this.processing.has(orderId);
  }

  startProcessing(orderId: string): boolean {
    if (this.processing.has(orderId)) {
      return false; // Déjà en cours
    }
    
    // Vérifier si déjà complété récemment (< 5 minutes)
    const completedAt = this.completed.get(orderId);
    if (completedAt && Date.now() - completedAt < 5 * 60 * 1000) {
      return false; // Déjà payé récemment
    }

    this.processing.add(orderId);
    return true;
  }

  finishProcessing(orderId: string, success: boolean): void {
    this.processing.delete(orderId);
    
    if (success) {
      this.completed.set(orderId, Date.now());
      
      // Nettoyer les anciennes entrées (> 1 heure)
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      for (const [id, time] of this.completed.entries()) {
        if (time < oneHourAgo) {
          this.completed.delete(id);
        }
      }
    }
  }
}

export const paymentGuard = new PaymentGuard();

/**
 * Logger de manière sécurisée (sans exposer de données sensibles)
 */
export const secureLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(message, data);
  }
  // En production, ne rien logger ou envoyer à un service sécurisé
};

