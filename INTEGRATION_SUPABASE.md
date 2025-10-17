# 🔗 Intégration Supabase Frontend - Ethioculture

## 1️⃣ Configuration (à faire UNE FOIS)

### Récupérer vos clés Supabase

**Option A: Via le dashboard web**
1. Aller sur https://app.supabase.com
2. Sélectionner votre projet
3. Settings → API
4. Copier:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public → `VITE_SUPABASE_ANON_KEY`

**Option B: Via CLI**
```bash
supabase status
```

### Créer le fichier .env.local

```bash
# Dans le dossier ethioculture/
cp .env.local.example .env.local
```

**Éditer `.env.local`:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

### Installer le client Supabase

```bash
cd ethioculture
npm install @supabase/supabase-js
```

## 2️⃣ Services disponibles

Tous les services sont dans `src/services/`:

### ✅ authService (Authentification)
```typescript
import { authService } from '@/services/auth.service'

// Inscription
await authService.signUp(email, password, {
  first_name: 'John',
  last_name: 'Doe',
  phone: '+221771234567'
})

// Connexion
await authService.signIn(email, password)

// Déconnexion
await authService.signOut()

// Utilisateur actuel
const user = await authService.getCurrentUser()

// Profil complet
const profile = await authService.getUserProfile()
```

### ✅ productsService (Produits)
```typescript
import { productsService } from '@/services/products.service'

// Tous les produits
const products = await productsService.getProducts()

// Filtrer
const filtered = await productsService.getProducts({
  category_id: 1,
  available: true,
  search: 'beyaynetu'
})

// Un produit
const product = await productsService.getProductById(1)

// Produits en vedette
const featured = await productsService.getFeaturedProducts()

// Catégories
const categories = await productsService.getCategories()
```

### ✅ cartService (Panier)
```typescript
import { cartService } from '@/services/cart.service'

// Voir le panier
const items = await cartService.getCart()

// Ajouter
await cartService.addToCart(productId, quantity)

// Modifier quantité
await cartService.updateQuantity(itemId, newQuantity)

// Supprimer
await cartService.removeFromCart(itemId)

// Vider
await cartService.clearCart()
```

### ✅ ordersService (Commandes)
```typescript
import { ordersService } from '@/services/orders.service'

// Créer une commande
const order = await ordersService.createOrder({
  items: [
    { product_id: 1, quantity: 2, unit_price: 4000 }
  ],
  total_amount: 8000,
  payment_method: 'CARD',
  shipping_address: {
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    city: 'Dakar',
    postal_code: '12345',
    country: 'Sénégal',
    phone: '+221771234567'
  },
  clear_cart: true
})

// Mes commandes
const orders = await ordersService.getMyOrders()

// Une commande
const order = await ordersService.getOrderByNumber('ORD-20240115-1234')
```

### ✅ paymentService (Paiement Flutterwave)
```typescript
import { paymentService } from '@/services/payment.service'

// Initier paiement
const payment = await paymentService.initiatePayment({
  order_number: order.order_number,
  amount: order.total_amount,
  customer_email: user.email,
  customer_name: `${user.first_name} ${user.last_name}`,
  customer_phone: user.phone
})

// Rediriger vers Flutterwave
paymentService.redirectToPayment(payment.payment_url)

// Vérifier statut
const status = await paymentService.checkPaymentStatus(orderNumber)
```

## 3️⃣ Exemple: Page Produits

```typescript
// pages/Products.tsx
import { useEffect, useState } from 'react'
import { productsService } from '@/services/products.service'
import { cartService } from '@/services/cart.service'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const data = await productsService.getProducts({ available: true })
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToCart(productId: number) {
    try {
      await cartService.addToCart(productId, 1)
      alert('Ajouté au panier!')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4">
          <img src={product.image_url} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price} XOF</p>
          <button onClick={() => handleAddToCart(product.id)}>
            Ajouter au panier
          </button>
        </div>
      ))}
    </div>
  )
}
```

## 4️⃣ Exemple: Processus de commande complet

```typescript
// pages/Checkout.tsx
import { ordersService } from '@/services/orders.service'
import { paymentService } from '@/services/payment.service'
import { authService } from '@/services/auth.service'

async function handleCheckout(cartItems, shippingAddress) {
  try {
    // 1. Créer la commande
    const orderData = {
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      total_amount: calculateTotal(cartItems),
      payment_method: 'CARD',
      shipping_address: shippingAddress,
      clear_cart: true
    }

    const { order } = await ordersService.createOrder(orderData)

    // 2. Initier le paiement
    const user = await authService.getUserProfile()
    
    const payment = await paymentService.initiatePayment({
      order_number: order.order_number,
      amount: order.total_amount,
      customer_email: user.email,
      customer_name: `${user.first_name} ${user.last_name}`,
      customer_phone: user.phone
    })

    // 3. Rediriger vers Flutterwave
    paymentService.redirectToPayment(payment.payment_url)
    
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Erreur lors de la commande')
  }
}
```

## 5️⃣ Gestion de l'authentification globale

```typescript
// App.tsx ou main.tsx
import { useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'utilisateur au chargement
    checkUser()

    // Écouter les changements
    const { data: { subscription } } = authService.onAuthStateChange(setUser)

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div>
      {user ? (
        <div>Connecté: {user.email}</div>
      ) : (
        <div>Non connecté</div>
      )}
    </div>
  )
}
```

## 6️⃣ Checklist d'intégration

- [ ] Fichier `.env.local` créé avec les bonnes clés
- [ ] `@supabase/supabase-js` installé
- [ ] Fichier `src/config/supabase.ts` créé
- [ ] Services importés dans les pages
- [ ] Authentification gérée globalement
- [ ] Gestion d'erreurs implémentée
- [ ] Loading states ajoutés

## 7️⃣ Sécurité

**✅ Ce qui est SAFE dans le frontend:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**❌ NE JAMAIS mettre dans le frontend:**
- `SERVICE_ROLE_KEY`
- Secrets webhook
- Clés API Flutterwave

Ces clés sont **automatiquement protégées** par Row Level Security (RLS). Un utilisateur ne peut accéder qu'à ses propres données.

## 🆘 Dépannage

### Erreur: "Missing Supabase environment variables"
→ Vérifier que `.env.local` existe et contient les bonnes valeurs

### Erreur: "Not authenticated"
→ L'utilisateur doit être connecté pour accéder à certaines fonctionnalités

### Erreur: "Row level security policy violation"
→ L'utilisateur essaie d'accéder à des données qui ne lui appartiennent pas

## 📚 Documentation

- Configuration: `src/config/supabase.ts`
- Services: `src/services/`
- Variables: `.env.local`

---

**Résumé:** Copier `.env.local.example` → `.env.local`, remplir les clés, importer les services, c'est tout ! ✅



















