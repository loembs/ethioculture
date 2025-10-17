// =============================================
// SYSTÈME DE SÉCURITÉ
// =============================================
// Protection contre les attaques et les fuites de données

/**
 * Nettoyer les logs en production
 */
export const setupProductionLogging = () => {
  if (import.meta.env.PROD) {
    // Désactiver tous les console.log en production
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    
    // Garder seulement les erreurs critiques (mais sans détails sensibles)
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Filtrer les informations sensibles
      const sanitized = args.map(arg => {
        if (typeof arg === 'object') {
          return '[Object]';
        }
        return String(arg).replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[TOKEN]');
      });
      originalError(...sanitized);
    };
  }
};

/**
 * Sanitiser les inputs pour éviter les injections
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Enlever < et >
    .replace(/script/gi, '') // Enlever "script"
    .replace(/javascript:/gi, '') // Enlever javascript:
    .replace(/on\w+=/gi, '') // Enlever les event handlers
    .trim()
    .slice(0, 1000); // Limiter la longueur
};

/**
 * Valider un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 100;
};

/**
 * Valider un numéro de téléphone
 */
export const isValidPhone = (phone: string): boolean => {
  // Accepte formats internationaux
  const phoneRegex = /^\+?[0-9]{8,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Détecter les tentatives d'injection SQL
 */
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)(\s|$)/i,
    /--/,
    /;(\s)*DROP/i,
    /(\s|^)OR(\s)+1(\s)*=(\s)*1/i,
    /(\s|^)AND(\s)+1(\s)*=(\s)*1/i,
    /'(\s)*(OR|AND)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Valider les données de paiement (sans exposer les détails)
 */
export const validatePaymentData = (data: any): { valid: boolean; error?: string } => {
  if (!data.amount || data.amount <= 0) {
    return { valid: false, error: 'Montant invalide' };
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    return { valid: false, error: 'Email invalide' };
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    return { valid: false, error: 'Téléphone invalide' };
  }
  
  if (data.amount > 10000000) { // 10 millions max
    return { valid: false, error: 'Montant trop élevé' };
  }
  
  return { valid: true };
};

/**
 * Masquer les données sensibles dans les logs
 */
export const maskSensitiveData = (data: any): any => {
  if (!data) return data;
  
  if (typeof data === 'string') {
    // Masquer les tokens JWT
    return data.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[TOKEN_MASKED]');
  }
  
  if (typeof data === 'object') {
    const masked = { ...data };
    
    // Champs à masquer
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secretKey',
      'authorization',
      'cardNumber',
      'cvv',
      'pin'
    ];
    
    sensitiveFields.forEach(field => {
      if (masked[field]) {
        masked[field] = '[MASKED]';
      }
    });
    
    return masked;
  }
  
  return data;
};

/**
 * Vérifier l'intégrité d'une transaction de paiement
 */
export const verifyPaymentIntegrity = (transaction: any): boolean => {
  // Vérifier que tous les champs requis sont présents
  const requiredFields = ['transaction_id', 'amount', 'status', 'tx_ref'];
  
  for (const field of requiredFields) {
    if (!transaction[field]) {
      console.warn('⚠️ Champ manquant dans la transaction');
      return false;
    }
  }
  
  // Vérifier que le statut est valide
  const validStatuses = ['successful', 'completed', 'pending', 'failed', 'cancelled'];
  if (!validStatuses.includes(transaction.status)) {
    console.warn('⚠️ Statut de transaction invalide');
    return false;
  }
  
  return true;
};

/**
 * Générer un identifiant unique sécurisé
 */
export const generateSecureId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  
  return `${timestamp}-${random}${random2}`.toUpperCase();
};

/**
 * Limiter le taux de requêtes (rate limiting côté client)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filtrer les requêtes dans la fenêtre de temps
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      console.warn('⚠️ Limite de requêtes atteinte');
      return false;
    }
    
    // Ajouter la nouvelle requête
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }
}

export const paymentRateLimiter = new RateLimiter(5, 60000); // 5 paiements max par minute

/**
 * Vérifier si une requête est suspicieuse
 */
export const isSuspiciousRequest = (data: any): boolean => {
  // Vérifier les patterns d'attaque
  const dataStr = JSON.stringify(data);
  
  // Trop de données
  if (dataStr.length > 50000) {
    console.warn('⚠️ Requête suspecte : taille excessive');
    return true;
  }
  
  // Patterns d'injection
  if (detectSQLInjection(dataStr)) {
    console.warn('⚠️ Requête suspecte : tentative d\'injection SQL');
    return true;
  }
  
  // Scripts malveillants
  if (/<script|javascript:|onerror=/i.test(dataStr)) {
    console.warn('⚠️ Requête suspecte : script malveillant détecté');
    return true;
  }
  
  return false;
};

/**
 * Protection CSRF - Vérifier le token
 */
export const generateCSRFToken = (): string => {
  const token = generateSecureId();
  sessionStorage.setItem('csrf-token', token);
  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf-token');
  return token === storedToken;
};

