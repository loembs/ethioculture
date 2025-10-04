// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: import.meta.env.VITE_API_URL || 'https://geezabackone.onrender.com/api',
  
  // Timeouts
  TIMEOUT: 15000, // 15 secondes
  
  // Configuration des retry
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 seconde
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    PRODUCTS: '/products',
    CART: '/cart',
    ORDERS: '/orders',
    AUTH: '/auth',
    ADMIN: '/admin',
  }
};

// Fonction pour construire l'URL complète
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour obtenir les headers avec authentification
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default API_CONFIG;
