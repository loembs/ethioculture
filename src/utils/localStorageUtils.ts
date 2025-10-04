// Utilitaires pour gérer le localStorage de manière sécurisée

export class LocalStorageUtils {
  
  // Nettoyer toutes les données d'authentification corrompues
  static clearCorruptedAuthData(): void {
    try {
      // Supprimer toutes les clés d'authentification
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Supprimer aussi les variantes possibles
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userData');
      
      console.log('Données d\'authentification corrompues nettoyées');
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error);
    }
  }
  
  // Vérifier et nettoyer les données d'authentification au démarrage
  static validateAuthData(): void {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // Vérifier si les données sont corrompues
      if (token === 'undefined' || token === 'null' || user === 'undefined' || user === 'null') {
        console.warn('Données d\'authentification corrompues détectées');
        this.clearCorruptedAuthData();
        return;
      }
      
      // Vérifier si les données JSON sont valides
      if (user && user !== 'null' && user !== 'undefined') {
        try {
          JSON.parse(user);
        } catch (e) {
          console.warn('Données utilisateur JSON corrompues détectées');
          this.clearCorruptedAuthData();
        }
      }
      
    } catch (error) {
      console.error('Erreur lors de la validation des données d\'authentification:', error);
      this.clearCorruptedAuthData();
    }
  }
  
  // Obtenir une valeur du localStorage de manière sécurisée
  static getItem(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      
      // Vérifier si la valeur est corrompue
      if (value === 'undefined' || value === 'null') {
        localStorage.removeItem(key);
        return null;
      }
      
      return value;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }
  
  // Obtenir et parser un objet JSON du localStorage de manière sécurisée
  static getJSONItem<T>(key: string): T | null {
    try {
      const value = this.getItem(key);
      
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Erreur lors du parsing JSON de ${key}:`, error);
      localStorage.removeItem(key);
      return null;
    }
  }
  
  // Définir une valeur dans le localStorage de manière sécurisée
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  }
  
  // Définir un objet JSON dans le localStorage de manière sécurisée
  static setJSONItem(key: string, value: any): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde JSON de ${key}:`, error);
    }
  }
}
