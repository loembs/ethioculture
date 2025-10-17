// =============================================
// NETTOYAGE FORCÉ DU CACHE
// =============================================
// Solution radicale pour éliminer TOUS les problèmes de cache

/**
 * Marque les données avec un timestamp
 */
const setCacheWithTimestamp = (key: string, value: any) => {
  const data = {
    value,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Récupère les données du cache si pas trop anciennes
 */
const getCacheWithTimestamp = (key: string, maxAge: number = 60 * 60 * 1000) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const data = JSON.parse(item);
    const now = Date.now();
    
    // Si les données sont trop anciennes, les supprimer
    if (now - data.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data.value;
  } catch (error) {
    // Si erreur de parsing, supprimer
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Nettoie intelligemment le cache (garde les données récentes)
 */
export const forceCleanupOnStart = () => {
  const lastCleanup = localStorage.getItem('last-cache-cleanup');
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  // Nettoyer toutes les heures
  if (!lastCleanup || (now - parseInt(lastCleanup)) > ONE_HOUR) {
    console.log('🧹 Nettoyage intelligent du cache...');
    
    // Clés importantes à TOUJOURS garder
    const protectedKeys = [
      'geeza-auth',
      'sb-mjmihwjjoknmssnkhpua-auth-token',
      'last-cache-cleanup',
      'app-version'
    ];
    
    // Clés de données à garder si récentes (< 1 heure)
    const dataCacheKeys = [
      'products-cache',
      'artists-cache',
      'categories-cache',
      'user-profile'
    ];
    
    const keysToRemove: string[] = [];
    let keptRecent = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Garder les clés protégées
      if (protectedKeys.some(pk => key.includes(pk))) {
        continue;
      }
      
      // Pour les clés de données, vérifier l'âge
      if (dataCacheKeys.some(dk => key.includes(dk))) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            // Si a un timestamp et est récent (< 1h), garder
            if (data.timestamp && (now - data.timestamp) < ONE_HOUR) {
              keptRecent++;
              continue;
            }
          }
        } catch (e) {
          // Si erreur de parsing, marquer pour suppression
        }
      }
      
      // Supprimer les autres clés ou les anciennes
      if (
        key.startsWith('sb-') && !key.includes('ethioculture-auth') ||
        key.includes('temp') ||
        key.includes('old-') ||
        key.startsWith('REACT_QUERY') // Anciennes clés React Query
      ) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Erreur suppression ${key}:`, e);
      }
    });
    
    // Marquer le nettoyage
    localStorage.setItem('last-cache-cleanup', now.toString());
    console.log(`✅ Cache nettoyé: ${keysToRemove.length} clés supprimées, ${keptRecent} données récentes conservées`);
  }
};

// Exporter les fonctions utilitaires
export { setCacheWithTimestamp, getCacheWithTimestamp };

/**
 * Désactive complètement le cache du navigateur pour cette app
 */
export const disableBrowserCache = () => {
  // Ajouter des meta tags pour désactiver le cache
  if (typeof document !== 'undefined') {
    const metaTags = [
      { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' }
    ];

    metaTags.forEach(({ httpEquiv, content }) => {
      let meta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('http-equiv', httpEquiv);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    
    console.log('🚫 Cache navigateur désactivé');
  }
};

/**
 * Nettoie seulement les données temporaires (toutes les 10 minutes)
 */
export const startPeriodicCleanup = () => {
  setInterval(() => {
    console.log('🔄 Nettoyage périodique (données temporaires uniquement)...');
    
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;
    
    // Nettoyer le sessionStorage (cache très temporaire)
    const sessionKeys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      // Ne supprimer que les clés vraiment temporaires
      if (key && (key.includes('temp-') || key.includes('tmp-'))) {
        sessionKeys.push(key);
      }
    }
    
    sessionKeys.forEach(key => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.error(`Erreur suppression ${key}:`, e);
      }
    });
    
    // Nettoyer les très vieilles données du localStorage (> 24h)
    const ONE_DAY = 24 * 60 * 60 * 1000;
    let oldDataCleaned = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key === 'geeza-auth' || key === 'last-cache-cleanup') continue;
      
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          // Si a un timestamp et est très vieux (> 24h), supprimer
          if (data.timestamp && (now - data.timestamp) > ONE_DAY) {
            localStorage.removeItem(key);
            oldDataCleaned++;
          }
        }
      } catch (e) {
        // Ignorer les erreurs de parsing
      }
    }
    
    if (sessionKeys.length > 0 || oldDataCleaned > 0) {
      console.log(`✅ Nettoyage: ${sessionKeys.length} clés temp, ${oldDataCleaned} données anciennes (>24h)`);
    }
  }, 10 * 60 * 1000); // Toutes les 10 minutes
};

/**
 * Force le rechargement sans cache
 */
export const forceReloadWithoutCache = () => {
  // Vider tout
  sessionStorage.clear();
  
  // Garder seulement l'auth
  const auth = localStorage.getItem('geeza-auth');
  localStorage.clear();
  if (auth) {
    localStorage.setItem('geeza-auth', auth);
  }
  
  // Recharger sans cache
  window.location.reload();
};

/**
 * Vérifier et réparer le localStorage corrompu
 */
export const checkAndRepairLocalStorage = () => {
  try {
    // Test d'écriture
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // Vérifier que l'auth n'est pas corrompu
    const auth = localStorage.getItem('geeza-auth');
    if (auth) {
      try {
        JSON.parse(auth);
      } catch (e) {
        console.error('❌ Auth corrompu, suppression...');
        localStorage.removeItem('geeza-auth');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ localStorage corrompu:', error);
    // Tenter de nettoyer
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('❌ Impossible de réparer le localStorage');
      return false;
    }
  }
};

