# Intégration Frontend-Backend EthioCulture

## 🚀 Test de la Connexion

### 1. Démarrer le Backend (Geezaback)

```bash
cd Geezaback
./mvnw spring-boot:run
```

Le backend sera accessible sur : `http://localhost:8080`

### 2. Démarrer le Frontend (ethioculture)

```bash
cd ethioculture
npm install
npm run dev
```

Le frontend sera accessible sur : `http://localhost:5173`

### 3. Tester la Connexion

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Faites défiler vers le bas jusqu'à la section "Test de Connexion Backend"
3. Cliquez sur "Tester la connexion API"
4. Vérifiez que tous les tests passent (statut vert)

## 📊 Endpoints Testés

- **GET /api/products** - Liste des produits
- **GET /api/products/featured** - Produits en vedette  
- **GET /api/admin/statistics** - Statistiques admin

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` dans le dossier `ethioculture` :

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development
VITE_APP_NAME=EthioCulture
VITE_APP_VERSION=1.0.0
```

### Configuration API

Le fichier `src/config/api.ts` contient la configuration de l'API :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  // ...
};
```

## 🎯 Fonctionnalités Testées

### Frontend
- ✅ Chargement des produits depuis l'API
- ✅ Filtres et recherche
- ✅ Gestion du panier
- ✅ Gestion des erreurs
- ✅ États de chargement

### Backend
- ✅ API REST complète
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des commandes
- ✅ Statistiques admin
- ✅ Validation des données

## 🐛 Dépannage

### Erreur de Connexion

Si les tests échouent :

1. **Vérifiez que le backend est démarré** :
   ```bash
   curl http://localhost:8080/api/products
   ```

2. **Vérifiez les logs du backend** pour les erreurs

3. **Vérifiez la configuration CORS** dans le backend

4. **Vérifiez les variables d'environnement** du frontend

### Erreur CORS

Si vous avez des erreurs CORS, vérifiez la configuration dans `Geezaback/src/main/java/ism/atelier/atelier/config/WebConfig.java` :

```java
@CrossOrigin(origins = "*")
```

## 📱 Pages Mises à Jour

### CuisinePage
- ✅ Utilise `useProducts()` pour charger les données
- ✅ Filtres par catégorie et sous-catégorie
- ✅ Gestion des états de chargement
- ✅ Gestion des erreurs

### ArtPage
- ✅ Intégration avec l'API pour les œuvres d'art
- ✅ Filtres avancés
- ✅ Composants réutilisables

### AdminDashboard
- ✅ Statistiques en temps réel
- ✅ Gestion des produits
- ✅ Suivi des commandes

### UserProfile
- ✅ Historique des commandes
- ✅ Gestion du profil utilisateur

## 🔄 Flux de Données

```
Frontend (React) 
    ↓ (API calls)
Services (useProducts, useCart, etc.)
    ↓ (HTTP requests)
Backend (Spring Boot)
    ↓ (Database queries)
PostgreSQL Database
```

## 📈 Prochaines Étapes

1. **Authentification** : Implémenter JWT
2. **Paiement** : Intégrer Stripe/PayPal
3. **Images** : Upload avec Cloudinary
4. **Notifications** : WebSocket pour les mises à jour
5. **Tests** : Tests unitaires et d'intégration

## 🎉 Résultat

Le frontend charge maintenant **réellement** les données du backend au lieu d'utiliser des données fictives. Tous les composants sont connectés à l'API et gèrent correctement les états de chargement et les erreurs.
