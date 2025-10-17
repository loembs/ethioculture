# 🔄 Migration Frontend vers Supabase

## Changements à faire dans TOUS les fichiers

### Remplacer les imports

**Anciens imports (geezaback):**
```typescript
import { authService } from '@/services/authService'
import { productService } from '@/services/productService'
import { cartService } from '@/services/cartService'
import { orderService } from '@/services/orderService'
import { paymentService } from '@/services/paymentService'
```

**Nouveaux imports (Supabase):**
```typescript
import { authService } from '@/services/auth.service'
import { productsService } from '@/services/products.service'
import { cartService } from '@/services/cart.service'
import { ordersService } from '@/services/orders.service'
import { paymentService } from '@/services/payment.service'
```

## Script de remplacement automatique

```bash
# Dans ethioculture/ethioculture/
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  -e "s|from '@/services/authService'|from '@/services/auth.service'|g" \
  -e "s|from '@/services/productService'|from '@/services/products.service'|g" \
  -e "s|from '@/services/cartService'|from '@/services/cart.service'|g" \
  -e "s|from '@/services/orderService'|from '@/services/orders.service'|g" \
  -e "s|from '@/services/paymentService'|from '@/services/payment.service'|g" \
  {} \;
```

## Fichiers à vérifier manuellement

1. **src/pages/LoginPage.tsx**
2. **src/pages/HomePage.tsx**
3. **src/pages/CartPage.tsx**
4. **src/pages/CheckoutPage.tsx**
5. **src/pages/ProfilePage.tsx**
6. **src/components/Header.tsx**

## Changements d'API

### authService

**Ancien:**
```typescript
await authService.login({ email, password })
await authService.register({ email, password, firstName, lastName })
```

**Nouveau (identique):**
```typescript
await authService.signIn(email, password)
await authService.signUp(email, password, { first_name, last_name })
```

### productService → productsService

**Ancien:**
```typescript
await productService.getAllProducts()
await productService.getProductsByCategory('food')
```

**Nouveau:**
```typescript
await productsService.getProducts()
await productsService.getProducts({ category_id: 1 }) // 1=FOOD, 2=ART
```

### cartService (identique)

**Pas de changement majeur**

### orderService → ordersService

**Ancien:**
```typescript
await orderService.createOrder(orderData)
```

**Nouveau:**
```typescript
await ordersService.createOrder(orderData)
```

### paymentService (identique)

**Nouveau flux avec Flutterwave**



















