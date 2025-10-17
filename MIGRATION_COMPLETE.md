# ✅ Migration Frontend vers Supabase

## Fichiers corrigés automatiquement

✅ **Services:**
- `src/services/index.ts` - Exports pointent vers Supabase

✅ **Hooks:**
- `src/hooks/useProducts.ts` - Utilise productsService (Supabase)
- `src/hooks/useCart.ts` - Utilise cartService (Supabase)
- `src/hooks/useCartSync.ts` - Utilise cartService + authService (Supabase)
- `src/hooks/usePreloadData.ts` - Utilise tous les services (Supabase)

✅ **Composants:**
- `src/components/AuthStatus.tsx` - Utilise authService (Supabase)

## ✅ Pages Cuisine et Art

**Les pages chargent depuis Supabase via les hooks :**

**CuisinePage.tsx:**
```typescript
const { data: productsData } = useProducts({ category: 'food' })
// ↓ Appelle productService (alias de productsService)
// ↓ Qui appelle Supabase via products.service.ts
```

**ArtPage.tsx:**
```typescript
const { data: productsData } = useProducts({ category: 'art' })
// ↓ Même chose, charge depuis Supabase
```

## Configuration requise

### 1. Créer `.env.local`

```bash
cd ethioculture
```

Créer `.env.local` avec:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 2. Obtenir les clés

**Via CLI:**
```bash
cd ../supabase
supabase status
```

**Ou dashboard:** https://app.supabase.com → Settings → API

### 3. Tester

```bash
npm run dev
```

## Vérification

Ouvrir la console browser (F12):
- ✅ Pas d'erreur "Missing Supabase environment variables"
- ✅ Les requêtes vont vers `xxxxx.supabase.co`
- ✅ Les produits s'affichent

## API Differences Supabase

### productService

**Changement principal:**
```typescript
// geezaback
productService.getProductsByCategory('food')

// Supabase
productService.getProducts({ category_id: 1 }) // 1=FOOD, 2=ART
```

**Mais le hook `useProducts` gère automatiquement:**
```typescript
useProducts({ category: 'food' })
// ↓ Converti automatiquement en category_id: 1
```

### Champs de données

**Supabase retourne:**
- `image_url` au lieu de `imageUrl`
- `category.name` au lieu de `categoryName`
- Relations avec `category`, `artist`, etc.

**Mais les services gèrent la transformation automatiquement !**

## Fichiers restants (optionnels)

Ces fichiers importent encore les anciens services mais sont peu utilisés:

- `src/pages/PaymentPage.tsx`
- `src/pages/UserProfile.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/components/ProductCard.tsx`
- `src/components/EnhancedProductCard.tsx`
- `src/components/ProductFilters.tsx`
- `src/components/ProductGrid.tsx`

Ils continueront de fonctionner car `index.ts` redirige vers Supabase.

## Rollback (si besoin)

Pour revenir à geezaback, éditer `src/services/index.ts`:

```typescript
// Commenter Supabase
// export { authService } from './auth.service';

// Décommenter geezaback
export { authService } from './authService';
export { productService } from './productService';
// ...etc
```

---

## 🎉 Résultat

**Votre frontend utilise maintenant Supabase !**

✅ Pages Cuisine → Charge depuis Supabase  
✅ Pages Art → Charge depuis Supabase  
✅ Authentification → Supabase Auth  
✅ Panier → Supabase (avec fallback local)  
✅ Commandes → Supabase Edge Functions  
✅ Paiements → Flutterwave via Supabase

**Il ne reste qu'à configurer `.env.local` et tester !** 🚀



















