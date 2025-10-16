# ⚙️ Configuration finale - Ethioculture + Supabase

## ✅ Ce qui a été fait

1. **Services Supabase créés** (5 fichiers)
   - `auth.service.ts` ✅
   - `products.service.ts` ✅  
   - `cart.service.ts` ✅
   - `orders.service.ts` ✅
   - `payment.service.ts` ✅

2. **Hooks mis à jour** (pas de fallback, uniquement skeletons)
   - `useProducts.ts` ✅
   - `useCart.ts` ✅
   - `useCartSync.ts` ✅
   - `usePreloadData.ts` ✅

3. **Services index.ts** redirige vers Supabase ✅

4. **Pages Cuisine et Art** chargent depuis Supabase ✅

## 🔧 Configuration requise

### Étape 1: Créer `.env.local`

```bash
cd ethioculture
```

Créer le fichier `.env.local` avec:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Étape 2: Obtenir vos clés Supabase

**Option A - Via CLI:**
```bash
cd ../supabase
supabase login
supabase link --project-ref your-project-ref
supabase status
```

Copier:
- `API URL` → `VITE_SUPABASE_URL`
- `anon key` → `VITE_SUPABASE_ANON_KEY`

**Option B - Via Dashboard:**
1. https://app.supabase.com
2. Sélectionner votre projet (ou créer un nouveau)
3. Settings → API
4. Copier:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public → `VITE_SUPABASE_ANON_KEY`

### Étape 3: Déployer le backend Supabase

```bash
cd ../supabase

# Appliquer les migrations
supabase db push

# Déployer les Edge Functions
supabase functions deploy sync-user
supabase functions deploy create-order
supabase functions deploy initiate-payment
supabase functions deploy webhook-flutterwave

# Configurer les secrets
supabase secrets set FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxx
supabase secrets set FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx
supabase secrets set FLUTTERWAVE_WEBHOOK_SECRET=xxx
supabase secrets set SUPABASE_WEBHOOK_SECRET=xxx
supabase secrets set SITE_URL=http://localhost:5173
```

### Étape 4: Tester

```bash
cd ../ethioculture
npm run dev
```

Ouvrir http://localhost:8081 (ou le port affiché)

## 🎯 Comportement attendu

### Pendant le chargement
- ✅ **Skeletons affichés** (pas de fausses données)
- ✅ isLoading = true
- ✅ data = undefined

### Après chargement
- ✅ **Produits réels depuis Supabase**
- ✅ isLoading = false
- ✅ data = produits

### En cas d'erreur
- ✅ **Message d'erreur** (pas de fallback)
- ✅ error = Error
- ✅ Possibilité de retry

## 🔍 Vérification

### Console browser (F12)

**✅ Connexion réussie:**
```
Supabase client initialized
Loading products from Supabase...
Products loaded: 10 items
```

**❌ Erreur de configuration:**
```
Error: Missing Supabase environment variables
→ Vérifier .env.local
```

**❌ Erreur de connexion:**
```
Error: Failed to fetch
→ Vérifier que Supabase est déployé
→ Vérifier VITE_SUPABASE_URL
```

## 📊 Vérifier que Supabase fonctionne

### Test dans la console browser (F12):

```javascript
// Tester la connexion
import { supabase } from './src/config/supabase'

// Récupérer les produits
const { data, error } = await supabase
  .from('ethio_products')
  .select('*')
  .limit(5)

console.log('Produits:', data)
// Devrait afficher les produits depuis Supabase
```

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
→ Créer `.env.local` avec les bonnes valeurs

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Failed to fetch" ou erreurs réseau
→ Vérifier que le backend Supabase est déployé:
```bash
cd ../supabase
supabase db push
```

### Pas de produits affichés
→ Vérifier que les données sont en base:
```bash
supabase db remote ls  # Vérifier les tables
# Puis dans le SQL Editor du dashboard, exécuter:
# SELECT * FROM ethio_products;
```

## 📋 Checklist finale

- [ ] `.env.local` créé avec les bonnes clés
- [ ] `@supabase/supabase-js` installé
- [ ] Backend Supabase déployé (migrations + functions)
- [ ] Données seed importées
- [ ] Application testée sur http://localhost:8081
- [ ] Console browser sans erreur
- [ ] Produits s'affichent
- [ ] Skeletons pendant le chargement

---

**Votre application est maintenant 100% Supabase !** 🎉





