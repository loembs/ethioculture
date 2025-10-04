// Service de cache local pour améliorer les performances
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class CacheService {
  private static readonly CACHE_PREFIX = 'ethioculture_cache_';
  private static readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

  // Sauvegarder des données dans le cache
  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      };
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du cache:', error);
    }
  }

  // Récupérer des données du cache
  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Vérifier si le cache a expiré
      if (Date.now() > cacheItem.expiry) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Erreur lors de la récupération du cache:', error);
      return null;
    }
  }

  // Supprimer un élément du cache
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Erreur lors de la suppression du cache:', error);
    }
  }

  // Vider tout le cache
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error);
    }
  }

  // Vérifier si une clé existe dans le cache
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Obtenir la taille du cache
  static getSize(): number {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter(key => key.startsWith(this.CACHE_PREFIX)).length;
    } catch (error) {
      return 0;
    }
  }
}
