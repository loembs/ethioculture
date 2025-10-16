# Guide d'intégration du système de paiement Flutterwave

## Vue d'ensemble

Le système de paiement est intégré avec **Flutterwave** pour gérer les paiements sécurisés. Voici comment il fonctionne :

## Architecture

### Backend (Java Spring Boot)

#### Services
- **FlutterwaveService** : Service principal pour communiquer avec l'API Flutterwave
- **PaymentController** : Contrôleur REST pour gérer les paiements

#### Endpoints

1. **POST /api/payments/initiate**
   - Initialise un paiement
   - Corps de la requête :
   ```json
   {
     "amount": 10000,
     "currency": "XOF",
     "email": "user@example.com",
     "phoneNumber": "+221XXXXXXXXX",
     "name": "John Doe",
     "redirectUrl": "https://votresite.com/payment/callback"
   }
   ```
   - Réponse :
   ```json
   {
     "status": "success",
     "message": "Payment link generated",
     "data": {
       "link": "https://checkout.flutterwave.com/...",
       "tx_ref": "TX-1234567890"
     }
   }
   ```

2. **POST /api/payments/webhook/flutterwave**
   - Webhook pour recevoir les notifications de Flutterwave
   - Vérifie la signature `verif-hash`
   - Met à jour le statut de la commande

3. **GET /api/payments/verify/{transactionId}**
   - Vérifie le statut d'un paiement

### Frontend (React + TypeScript)

#### Services
- **paymentService** : Service pour gérer les paiements côté client

#### Composants
- **CheckoutPage** : Page de paiement avec formulaire
- **PaymentPage** : Gestion du paiement et callback Flutterwave

## Flux de paiement

```
1. Utilisateur remplit le formulaire de commande
   ↓
2. CheckoutPage crée la commande via orderService
   ↓
3. Redirection vers /payment/:orderId?amount=...&method=...
   ↓
4. PaymentPage initie le paiement via paymentService
   ↓
5. Flutterwave génère un lien de paiement
   ↓
6. Redirection vers Flutterwave
   ↓
7. Utilisateur effectue le paiement
   ↓
8. Flutterwave redirige vers /payment/callback?status=...&tx_ref=...
   ↓
9. PaymentPage vérifie le paiement
   ↓
10. Affichage du résultat (succès/échec)
```

## Configuration

### Variables d'environnement Backend

Fichier `application.yml` ou `application.properties` :
```yaml
flutterwave:
  secret-key: FLWSECK-xxxxxxxxxxxxxxxx
  public-key: FLWPUBK-xxxxxxxxxxxxxxxx
  base-url: https://api.flutterwave.com/v3
  secret-hash: votre_secret_hash_webhook

# Ou dans application.properties :
# flutterwave.secret-key=FLWSECK-xxxxxxxxxxxxxxxx
# flutterwave.public-key=FLWPUBK-xxxxxxxxxxxxxxxx
# flutterwave.base-url=https://api.flutterwave.com/v3
# flutterwave.secret-hash=votre_secret_hash_webhook
```

### Variables d'environnement Frontend

Fichier `.env` :
```
VITE_API_URL=https://votre-api.com/api
```

## Test du système

### Mode Test Flutterwave

1. Utiliser les clés de test Flutterwave
2. Utiliser les cartes de test :
   - **Carte test succès** : 
     - Numéro : 5531886652142950
     - CVV : 564
     - Expiration : 09/32
     - Pin : 3310
     - OTP : 12345

### Flux de test

1. Ajoutez des produits au panier
2. Allez à la page de paiement (`/checkout`)
3. Remplissez le formulaire
4. Sélectionnez une méthode de paiement
5. Cliquez sur "Payer"
6. Vous serez redirigé vers la page de paiement Flutterwave
7. Utilisez une carte de test
8. Après le paiement, vous serez redirigé vers la page de confirmation

## Gestion des webhooks

### Configuration Flutterwave

1. Allez sur votre dashboard Flutterwave
2. Accédez à Settings > Webhooks
3. Configurez l'URL : `https://votre-api.com/api/payments/webhook/flutterwave`
4. Copiez le **Secret Hash** et configurez-le dans vos variables d'environnement

### Vérification de la signature

Le webhook vérifie automatiquement la signature via le header `verif-hash` pour s'assurer que la requête provient bien de Flutterwave.

## Gestion des erreurs

### Erreurs courantes

1. **"Invalid signature"** : Le secret hash du webhook ne correspond pas
2. **"Payment link generation failed"** : Problème avec les clés API Flutterwave
3. **"User not authenticated"** : L'utilisateur doit être connecté pour effectuer un paiement
4. **"Order creation failed"** : Problème lors de la création de la commande

## Sécurité

- ✅ Toutes les communications avec Flutterwave utilisent HTTPS
- ✅ Les webhooks sont vérifiés via signature
- ✅ Les clés API sont stockées dans les variables d'environnement
- ✅ L'authentification est requise pour effectuer un paiement
- ✅ Les données sensibles ne sont jamais stockées côté frontend

## Prochaines étapes

1. Configurer les webhooks en production
2. Tester avec différentes méthodes de paiement (Mobile Money, cartes, etc.)
3. Implémenter les remboursements
4. Ajouter un système de logs pour le suivi des transactions
5. Configurer les notifications par email après paiement

## Support

Pour toute question ou problème :
- Documentation Flutterwave : https://developer.flutterwave.com/docs
- Support Flutterwave : support@flutterwave.com











