# Guide de Résolution des Problèmes de Réseau

## Problème : ERR_HTTP2_PING_FAILED / Failed to fetch

### Causes Possibles

1. **Serveur Render en veille** : Les services gratuits de Render se mettent en veille après 15 minutes d'inactivité
2. **Problème de connectivité internet**
3. **Serveur temporairement indisponible**
4. **Limite de taux de requêtes atteinte**

### Solutions

#### 1. Attendre le Réveil du Serveur
- Le serveur Render peut prendre 30 secondes à 2 minutes pour se réveiller
- Réessayez votre requête après quelques instants

#### 2. Vérifier l'État du Serveur
```bash
# Tester la connectivité
curl -I https://geezabackone.onrender.com/api/auth/test

# Vérifier la réponse
# Si 200 OK : serveur actif
# Si timeout : serveur en veille
```

#### 3. Utiliser le Mode Développement Local
Pour éviter les problèmes de réseau, vous pouvez :
1. Démarrer le backend localement
2. Modifier l'URL dans `config/api.ts`

#### 4. Implémenter un Système de Retry
Le frontend peut automatiquement réessayer les requêtes échouées.

### Messages d'Erreur Courants

- **"Failed to fetch"** : Impossible de se connecter au serveur
- **"ERR_HTTP2_PING_FAILED"** : Connexion HTTP2 échouée
- **"ERR_NETWORK"** : Problème de réseau
- **"ERR_INTERNET_DISCONNECTED"** : Pas de connexion internet

### Solutions Frontend

#### 1. Affichage d'Erreurs Utilisateur
```typescript
// Afficher un message d'erreur amical
if (error.message.includes('Failed to fetch')) {
  toast({
    title: "Serveur indisponible",
    description: "Le serveur est temporairement en veille. Veuillez réessayer dans quelques instants.",
    variant: "destructive"
  });
}
```

#### 2. Retry Automatique
```typescript
// Réessayer automatiquement les requêtes échouées
const retryRequest = async (fn: () => Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

#### 3. Mode Hors Ligne
```typescript
// Détecter la connectivité
const isOnline = navigator.onLine;

// Utiliser des données en cache si hors ligne
if (!isOnline) {
  // Afficher les données mises en cache
}
```

### Recommandations

1. **Pour le développement** : Utilisez le backend local
2. **Pour la production** : Considérez un service payant plus stable
3. **Pour les utilisateurs** : Implémentez des messages d'erreur clairs
4. **Pour la résilience** : Ajoutez un système de retry et de cache

### URLs de Test

- **Backend Render** : https://geezabackone.onrender.com
- **Test de santé** : https://geezabackone.onrender.com/api/auth/test
- **Frontend local** : http://localhost:8081
- **Backend local** : http://localhost:8080

















