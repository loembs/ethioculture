# 🎨 Guide d'Intégration du Widget Flutterwave Inline

## ✅ Ce qui a été fait

### 1. **Installation du Package**
```bash
npm install flutterwave-react-v3
```

### 2. **Fichiers Créés/Modifiés**

#### Nouveaux fichiers :
- `src/config/flutterwave.ts` - Configuration Flutterwave
- `src/components/FlutterwavePaymentModal.tsx` - Composant widget de paiement inline
- `.env.local.example` - Exemple de variables d'environnement

#### Fichiers modifiés :
- `src/services/payment.service.ts` - Ajout des méthodes de vérification et mise à jour
- `src/pages/CheckoutPage.tsx` - Intégration du widget inline

---

## 🔧 Configuration

### Étape 1 : Variables d'Environnement

Créez un fichier `.env.local` à la racine du dossier `ethioculture` :

```env
# Supabase (déjà configuré)
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_actuelle

# Flutterwave - Clé Publique
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

### Étape 2 : Obtenir votre Clé Publique Flutterwave

1. **Connectez-vous** à https://dashboard.flutterwave.com/
2. **Allez dans** : Settings → API Keys
3. **Copiez** la clé **Public Key (TEST)** qui commence par `FLWPUBK_TEST-`
4. **Collez-la** dans votre fichier `.env.local`

⚠️ **Important** : Pour le développement, utilisez toujours les clés **TEST**

### Étape 3 : Configuration Supabase Edge Functions

Les Edge Functions doivent aussi avoir les clés Flutterwave configurées.

Allez sur : https://supabase.com/dashboard/project/mjmihwjjoknmssnkhpua/settings/vault/secrets

Ajoutez ces secrets (s'ils n'existent pas déjà) :

| Secret Name | Valeur |
|-------------|--------|
| `FLUTTERWAVE_PUBLIC_KEY` | `FLWPUBK_TEST-xxxxx...` |
| `FLUTTERWAVE_SECRET_KEY` | `FLWSECK_TEST-xxxxx...` |
| `FLUTTERWAVE_ENCRYPTION_KEY` | `FLWSECK_TESTxxxxx...` |
| `SITE_URL` | `http://localhost:8080` (dev) |

---

## 🎯 Comment ça Fonctionne

### Flux de Paiement

```
┌─────────────────────────┐
│ 1. UTILISATEUR          │
│    Remplit le formulaire│
│    de checkout          │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 2. CLIQUE SUR "PAYER"   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 3. CRÉATION COMMANDE    │
│    → orderService       │
│    → Status: PENDING    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 4. AFFICHAGE WIDGET FLUTTERWAVE │
│    → Modal s'ouvre              │
│    → Widget Flutterwave inline  │
│    → Formulaire de paiement     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────┐
│ 5. UTILISATEUR PAIE     │
│    → Carte bancaire     │
│    → Mobile Money       │
│    → Virement           │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 6. CALLBACK FLUTTERWAVE │
│    → onSuccess()        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 7. MISE À JOUR COMMANDE │
│    → Status: PAID       │
│    → Status: CONFIRMED  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ 8. REDIRECTION          │
│    → /profile?tab=orders│
│    → Affichage commandes│
└─────────────────────────┘
```

---

## 🧪 Test du Système

### Cartes de Test Flutterwave

#### ✅ Paiement Réussi
```
Numéro : 5531 8866 5214 2950
CVV    : 564
Exp    : 09/32
Pin    : 3310
OTP    : 12345
```

#### ❌ Paiement Échoué (pour tester les erreurs)
```
Numéro : 5531 8866 5214 2950
CVV    : 564
Exp    : 09/32
Pin    : 3310
OTP    : 54321 (mauvais OTP)
```

### Étapes de Test

1. **Démarrez le serveur**
   ```bash
   cd ethioculture
   npm run dev
   ```

2. **Connectez-vous** au site (créez un compte si nécessaire)

3. **Ajoutez des produits** au panier

4. **Allez au checkout** (`/checkout`)

5. **Remplissez le formulaire** :
   - Prénom, nom, email, téléphone
   - Adresse de livraison
   - Acceptez les conditions

6. **Cliquez sur "Payer [montant]"**

7. **Le widget Flutterwave s'affiche** :
   - Une modal s'ouvre
   - Le widget Flutterwave se charge
   - Le formulaire de paiement apparaît

8. **Entrez les informations de carte de test**

9. **Validez le paiement**

10. **Vérifiez la redirection** vers `/profile?tab=orders`

---

## 📊 Vérification du Statut

### Dans la Console Navigateur (F12)

Vous verrez ces logs :

```javascript
✅ Commande créée: {id: 123, orderNumber: "GZ-...", ...}
🔄 Réponse Flutterwave: {status: "successful", ...}
🎉 Paiement réussi! {transaction_id: "...", ...}
✅ Commande 123 mise à jour: PAID
```

### Dans Supabase

1. **Ouvrez Supabase** : https://supabase.com/dashboard/project/mjmihwjjoknmssnkhpua/editor

2. **Table `ethio_orders`** :
   - Vérifiez que `payment_status` = `PAID`
   - Vérifiez que `status` = `CONFIRMED`

3. **Table `payment_transactions`** (si elle existe) :
   - Vérifiez les détails de la transaction

---

## 🎨 Personnalisation

### Changer le Logo dans le Widget

Éditez `src/config/flutterwave.ts` :

```typescript
company: {
  name: 'Geezaculture',
  logo: 'https://votre-url-logo.com/logo.png' // ← Changez ici
}
```

### Changer la Devise

Par défaut : `XOF` (Franc CFA)

Pour changer :

```typescript
// src/config/flutterwave.ts
currency: 'NGN', // Naira Nigérian
// ou
currency: 'USD', // Dollar US
// ou
currency: 'EUR', // Euro
```

### Méthodes de Paiement Acceptées

Éditez `src/components/FlutterwavePaymentModal.tsx` :

```typescript
payment_options: 'card,mobilemoney,ussd,account,banktransfer'

// Options disponibles :
// - card : Cartes bancaires
// - mobilemoney : Mobile Money
// - ussd : USSD banking
// - account : Compte bancaire
// - banktransfer : Virement bancaire
```

---

## 🔒 Sécurité

### ✅ Bonnes Pratiques Implémentées

1. **Clé publique uniquement côté client**
   - La clé secrète reste sur le serveur (Edge Functions)

2. **Vérification côté serveur**
   - Chaque paiement est vérifié par l'Edge Function

3. **Mise à jour sécurisée**
   - Le statut de commande est mis à jour via Supabase (RLS activé)

4. **Variables d'environnement**
   - Aucune clé en dur dans le code

### ⚠️ À NE PAS FAIRE

❌ Ne commitez **JAMAIS** votre fichier `.env.local`
❌ Ne partagez **JAMAIS** votre clé secrète Flutterwave
❌ N'utilisez **JAMAIS** les clés TEST en production

---

## 🐛 Dépannage

### Problème : "Missing Flutterwave public key"

**Solution** : Vérifiez que `VITE_FLUTTERWAVE_PUBLIC_KEY` est dans `.env.local`

### Problème : Le widget ne s'affiche pas

**Solution** :
1. Vérifiez la console navigateur (F12) pour les erreurs
2. Vérifiez que la clé publique est valide
3. Redémarrez le serveur dev (`npm run dev`)

### Problème : "Payment failed"

**Solution** :
1. Vérifiez que vous utilisez les cartes de test
2. Vérifiez que les Edge Functions sont déployées
3. Vérifiez les secrets Supabase

### Problème : La commande reste en "PENDING"

**Solution** :
1. Vérifiez les logs de la console
2. Vérifiez que `paymentService.updateOrderPaymentStatus()` s'exécute
3. Vérifiez les RLS (Row Level Security) sur la table `ethio_orders`

---

## 📝 Code Important

### Ouvrir le Widget Manuellement

Si vous voulez ouvrir le widget depuis un autre composant :

```typescript
import { FlutterwavePaymentModal } from '@/components/FlutterwavePaymentModal';

const [showModal, setShowModal] = useState(false);

const paymentConfig = {
  amount: 1000,
  email: 'user@example.com',
  phone: '+251911234567',
  name: 'John Doe',
  orderId: 123,
  orderNumber: 'GZ-123456',
  onSuccess: (response) => {
    console.log('Paiement réussi', response);
  },
  onClose: () => {
    console.log('Widget fermé');
  }
};

// Dans votre JSX :
<FlutterwavePaymentModal
  config={paymentConfig}
  isOpen={showModal}
  onOpenChange={setShowModal}
/>
```

---

## 🚀 Passage en Production

Quand vous êtes prêt pour la production :

### 1. Obtenir les Clés LIVE

- Allez sur https://dashboard.flutterwave.com/
- Activez votre compte en mode **LIVE**
- Récupérez les clés **LIVE** (sans `-TEST`)

### 2. Mettre à Jour les Variables

```env
# Production
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

### 3. Mettre à Jour Supabase Secrets

Remplacez les secrets `FLUTTERWAVE_*` par les versions LIVE

### 4. Tester en Production

Utilisez de vraies cartes (petits montants d'abord)

---

## 📞 Support

- **Flutterwave Docs** : https://developer.flutterwave.com/docs
- **Supabase Docs** : https://supabase.com/docs
- **Support Flutterwave** : support@flutterwave.com

---

## ✨ Fonctionnalités

✅ Widget inline (pas de redirection externe)
✅ Support multi-devises
✅ Support cartes bancaires
✅ Support Mobile Money
✅ Vérification sécurisée
✅ Mise à jour automatique de commande
✅ Gestion d'erreurs complète
✅ Interface utilisateur moderne
✅ Compatible mobile
✅ Logs détaillés pour debug

---

**Bon paiement ! 💰**




