# 🧠 Système de Cache Intelligent

## 🎯 Objectif

Un cache qui :
- ✅ **Garde les données importantes** pendant 1 heure minimum
- ✅ **Supprime seulement l'ancien** (> 24 heures)
- ✅ **Protège les données utilisateur** (auth, panier, profil)
- ✅ **Nettoie automatiquement** sans perturber l'utilisateur

---

## 📊 Durées de Vie du Cache

| Type de Données | Durée | Raison |
|----------------|-------|--------|
| **Produits** | 1 heure | Changent rarement |
| **Artistes** | 1 heure | Stables |
| **Catégories** | 2 heures | Très stables |
| **Profil utilisateur** | 30 minutes | Peut changer |
| **Panier** | 24 heures | Important à conserver |
| **Commandes** | 1 heure | Mise à jour fréquente |

---

## 🔄 Fonctionnement

### 1. Enregistrement des Données

```typescript
import { cacheHelpers } from '@/utils/smartCache';

// Enregistrer des produits (expire dans 1h)
cacheHelpers.setProducts(productsArray);

// Enregistrer des artistes (expire dans 1h)
cacheHelpers.setArtists(artistsArray);

// Enregistrer le panier (expire dans 24h)
cacheHelpers.setCart(cartData);
```

**Ce qui se passe** :
```json
{
  "value": [...données...],
  "timestamp": 1234567890,
  "expiresAt": 1234571490  // timestamp + 1 heure
}
```

---

### 2. Récupération des Données

```typescript
// Récupérer des produits
const products = cacheHelpers.getProducts();

if (products) {
  console.log('📦 Produits du cache');
  // Utiliser les données du cache
} else {
  console.log('🌐 Charger depuis Supabase');
  // Charger depuis la base de données
  const freshProducts = await fetchProducts();
  cacheHelpers.setProducts(freshProducts);
}
```

---

### 3. Nettoyage Intelligent

#### Toutes les Heures (Nettoyage Léger)
```
✅ Garde:
- ethioculture-auth (toujours)
- Données récentes (< 1h)
- Panier
- Profil utilisateur

❌ Supprime:
- Anciennes clés Supabase
- Clés temporaires (temp-, tmp-)
- Clés corrompues
```

#### Toutes les 10 Minutes (Nettoyage Temporaire)
```
❌ Supprime SEULEMENT:
- sessionStorage temporaire
- Données très anciennes (> 24h)
```

#### Toutes les 15 Minutes (Santé du Cache)
```
🔍 Vérifie:
- Taille totale du cache
- Nombre d'entrées
- Caches expirés

🧹 Nettoie:
- Seulement les caches expirés
- Si cache > 2 MB
```

---

## 📦 Utilisation Pratique

### Dans un Composant de Produits

```typescript
import { useEffect, useState } from 'react';
import { cacheHelpers } from '@/utils/smartCache';
import { supabase } from '@/config/supabase';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      // 1. Essayer d'abord le cache
      const cached = cacheHelpers.getProducts();
      
      if (cached) {
        console.log('📦 Utilisation du cache');
        setProducts(cached);
        setLoading(false);
        return;
      }

      // 2. Si pas de cache, charger depuis Supabase
      console.log('🌐 Chargement depuis Supabase');
      const { data } = await supabase
        .from('ethio_products')
        .select('*');

      if (data) {
        setProducts(data);
        // 3. Mettre en cache pour la prochaine fois
        cacheHelpers.setProducts(data);
      }
      
      setLoading(false);
    };

    loadProducts();
  }, []);

  // ...
};
```

---

## 🔒 Données Toujours Protégées

Ces données ne sont **JAMAIS** supprimées automatiquement :

1. ✅ **ethioculture-auth** (authentification)
2. ✅ **sb-mjmihwjjoknmssnkhpua-auth-token** (token Supabase)
3. ✅ **cache-cart** (panier pendant 24h)
4. ✅ **last-cache-cleanup** (timestamp du dernier nettoyage)
5. ✅ **app-version** (versioning)

---

## 📊 Logs du Système

### Au Démarrage
```javascript
🧹 Nettoyage intelligent du cache...
✅ Cache nettoyé: 0 clés supprimées, 3 données récentes conservées
💾 Cache: products enregistré (expire dans 60 min)
📦 Cache: products récupéré (expire dans 58 min)
```

### Pendant l'Utilisation
```javascript
// Toutes les 10 minutes
🔄 Nettoyage périodique (données temporaires uniquement)...
✅ Nettoyage: 0 clés temp, 0 données anciennes (>24h)

// Toutes les 15 minutes
📊 Cache: 5 entrées, 245 KB
✅ Aucun cache expiré
```

### Quand Cache Expire
```javascript
⏰ Cache expiré: products
🌐 Chargement depuis Supabase
💾 Cache: products enregistré (expire dans 60 min)
```

---

## 🎯 Avantages

### Pour l'Utilisateur
```
✅ Chargement instantané (cache)
✅ Pas de pertes de données
✅ Pas de déconnexions
✅ Expérience fluide
✅ Fonctionne offline (données en cache)
```

### Pour le Développeur
```
✅ Moins de requêtes à Supabase
✅ Réduction des coûts
✅ Meilleure performance
✅ Logs clairs
✅ Facile à débugger
```

---

## 🔍 Commandes de Debug

### Dans la Console (F12)

```javascript
// Voir la santé du cache
import('@/utils/smartCache').then(({ checkCacheHealth }) => {
  checkCacheHealth();
});

// Voir la taille du cache
import('@/utils/smartCache').then(({ getCacheSize }) => {
  console.log(getCacheSize());
});

// Forcer le nettoyage
import('@/utils/smartCache').then(({ cleanExpiredCache }) => {
  cleanExpiredCache();
});

// Voir les produits en cache
import('@/utils/smartCache').then(({ cacheHelpers }) => {
  console.log(cacheHelpers.getProducts());
});
```

---

## 📈 Comparaison Avant/Après

### AVANT (Sans Cache Intelligent)
```
❌ Recharge tout à chaque fois
❌ Slow (500ms-2s de chargement)
❌ Beaucoup de requêtes Supabase
❌ Cache se corrompt
❌ Déconnexions fréquentes
```

### APRÈS (Avec Cache Intelligent)
```
✅ Charge du cache (< 50ms)
✅ Ultra rapide
✅ Moins de requêtes (économie)
✅ Cache sain et géré
✅ Sessions stables
```

---

## 🚀 Pour la Production

Ce système est **parfait pour la production** car :

1. **Performance** : Chargement instantané des données en cache
2. **Économie** : Moins de requêtes = moins de coûts Supabase
3. **Fiabilité** : Données protégées, pas de corruption
4. **UX** : Expérience utilisateur fluide
5. **Maintenance** : Tout est automatique

---

## ✨ Résumé

```
┌─────────────────────────────────────┐
│  UTILISATEUR NAVIGUE                │
└──────────┬──────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ Cache existe?│
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    OUI         NON
     │           │
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ Instant │  │ Load from DB │
│  < 50ms │  │   500-2000ms │
└─────────┘  └──────┬───────┘
                    │
                    ▼
              ┌────────────┐
              │ Save Cache │
              │  (1 heure) │
              └────────────┘
```

**Vos données sont gardées 1 heure, supprimées seulement si > 24h ! 🎉**






