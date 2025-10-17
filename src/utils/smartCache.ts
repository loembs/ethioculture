// =============================================
// SYSTÈME DE CACHE INTELLIGENT
// =============================================
// Cache qui garde les données importantes et supprime seulement l'ancien

const CACHE_DURATIONS = {
  products: 60 * 60 * 1000,      // 1 heure
  artists: 60 * 60 * 1000,       // 1 heure
  categories: 2 * 60 * 60 * 1000, // 2 heures
  userProfile: 30 * 60 * 1000,   // 30 minutes
  cart: 24 * 60 * 60 * 1000,     // 24 heures
  orders: 60 * 60 * 1000,        // 1 heure
};

interface CachedData<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Enregistre des données dans le cache avec durée de vie
 */
export const setCache = <T>(key: string, value: T, duration?: number): boolean => {
  try {
    const now = Date.now();
    const cacheDuration = duration || CACHE_DURATIONS.products;
    
    const cachedData: CachedData<T> = {
      value,
      timestamp: now,
      expiresAt: now + cacheDuration
    };
    
    localStorage.setItem(`cache-${key}`, JSON.stringify(cachedData));
    console.log(`💾 Cache: ${key} enregistré (expire dans ${Math.floor(cacheDuration / 60000)} min)`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur mise en cache ${key}:`, error);
    
    // Si localStorage plein, nettoyer et réessayer
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      cleanExpiredCache();
      try {
        const now = Date.now();
        const cacheDuration = duration || CACHE_DURATIONS.products;
        const cachedData: CachedData<T> = {
          value,
          timestamp: now,
          expiresAt: now + cacheDuration
        };
        localStorage.setItem(`cache-${key}`, JSON.stringify(cachedData));
        return true;
      } catch (e) {
        return false;
      }
    }
    
    return false;
  }
};

/**
 * Récupère des données du cache si encore valides
 */
export const getCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`cache-${key}`);
    if (!item) return null;
    
    const cachedData: CachedData<T> = JSON.parse(item);
    const now = Date.now();
    
    // Vérifier si expiré
    if (now > cachedData.expiresAt) {
      console.log(`⏰ Cache expiré: ${key}`);
      localStorage.removeItem(`cache-${key}`);
      return null;
    }
    
    const minutesLeft = Math.floor((cachedData.expiresAt - now) / 60000);
    console.log(`📦 Cache: ${key} récupéré (expire dans ${minutesLeft} min)`);
    return cachedData.value;
  } catch (error) {
    console.error(`❌ Erreur lecture cache ${key}:`, error);
    // Supprimer le cache corrompu
    try {
      localStorage.removeItem(`cache-${key}`);
    } catch (e) {
      // Ignorer
    }
    return null;
  }
};

/**
 * Supprime une entrée du cache
 */
export const removeCache = (key: string): void => {
  try {
    localStorage.removeItem(`cache-${key}`);
    console.log(`🗑️ Cache: ${key} supprimé`);
  } catch (error) {
    console.error(`❌ Erreur suppression cache ${key}:`, error);
  }
};

/**
 * Nettoie tous les caches expirés
 */
export const cleanExpiredCache = (): void => {
  console.log('🧹 Nettoyage des caches expirés...');
  
  const now = Date.now();
  let cleaned = 0;
  const keysToRemove: string[] = [];
  
  // Parcourir toutes les clés
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('cache-')) continue;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) continue;
      
      const cachedData: CachedData<any> = JSON.parse(item);
      
      // Si expiré, marquer pour suppression
      if (now > cachedData.expiresAt) {
        keysToRemove.push(key);
        cleaned++;
      }
    } catch (error) {
      // Si erreur de parsing, supprimer aussi
      keysToRemove.push(key);
      cleaned++;
    }
  }
  
  // Supprimer les clés expirées
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignorer
    }
  });
  
  if (cleaned > 0) {
    console.log(`✅ ${cleaned} caches expirés nettoyés`);
  } else {
    console.log(`✅ Aucun cache expiré`);
  }
};

/**
 * Obtient la taille totale du cache
 */
export const getCacheSize = (): { count: number; sizeKB: number } => {
  let count = 0;
  let totalSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('cache-')) {
      count++;
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length * 2; // 2 bytes par caractère
      }
    }
  }
  
  return {
    count,
    sizeKB: Math.round(totalSize / 1024)
  };
};

/**
 * Vérifie la santé du cache
 */
export const checkCacheHealth = (): void => {
  const { count, sizeKB } = getCacheSize();
  const MAX_SIZE_KB = 2048; // 2 MB
  
  console.log(`📊 Cache: ${count} entrées, ${sizeKB} KB`);
  
  if (sizeKB > MAX_SIZE_KB) {
    console.warn(`⚠️ Cache trop volumineux (${sizeKB} KB), nettoyage recommandé`);
    cleanExpiredCache();
  }
};

/**
 * Raccourcis pour les types de données communs
 */
export const cacheHelpers = {
  // Produits
  setProducts: (products: any[]) => setCache('products', products, CACHE_DURATIONS.products),
  getProducts: () => getCache<any[]>('products'),
  
  // Artistes
  setArtists: (artists: any[]) => setCache('artists', artists, CACHE_DURATIONS.artists),
  getArtists: () => getCache<any[]>('artists'),
  
  // Catégories
  setCategories: (categories: any[]) => setCache('categories', categories, CACHE_DURATIONS.categories),
  getCategories: () => getCache<any[]>('categories'),
  
  // Profil utilisateur
  setUserProfile: (profile: any) => setCache('user-profile', profile, CACHE_DURATIONS.userProfile),
  getUserProfile: () => getCache<any>('user-profile'),
  
  // Panier
  setCart: (cart: any) => setCache('cart', cart, CACHE_DURATIONS.cart),
  getCart: () => getCache<any>('cart'),
  
  // Commandes
  setOrders: (orders: any[]) => setCache('orders', orders, CACHE_DURATIONS.orders),
  getOrders: () => getCache<any[]>('orders'),
};

// Démarrer le nettoyage automatique toutes les 15 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    checkCacheHealth();
    cleanExpiredCache();
  }, 15 * 60 * 1000);
}

