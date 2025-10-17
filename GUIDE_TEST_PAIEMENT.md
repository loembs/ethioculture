# Guide de Test du Système de Paiement

## 🚀 Démarrage Rapide

### Prérequis

1. **Backend** : Le service backend doit être démarré et accessible
2. **Clés Flutterwave** : Configurez vos clés de test dans `application.yml` ou `application.properties`
3. **Utilisateur** : Vous devez être connecté avec un compte utilisateur

### Configuration Backend (Obligatoire)

Dans `geezaback/src/main/resources/application.yml` :

```yaml
flutterwave:
  secret-key: FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx
  public-key: FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx
  base-url: https://api.flutterwave.com/v3
  secret-hash: votre_secret_hash_test
```

Ou dans `application.properties` :

```properties
flutterwave.secret-key=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx
flutterwave.public-key=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx
flutterwave.base-url=https://api.flutterwave.com/v3
flutterwave.secret-hash=votre_secret_hash_test
```

> 📝 **Important** : Utilisez les clés de TEST pour éviter les vrais paiements !

### Obtenir vos clés Flutterwave

1. Créez un compte sur https://flutterwave.com
2. Allez dans **Settings** > **API Keys**
3. Copiez vos clés de **TEST** (pas les clés de production !)
4. Pour le secret hash : **Settings** > **Webhooks** > Créez un webhook et copiez le hash

## 📋 Méthodes de Test

### Méthode 1 : Via le flux complet (Recommandé)

1. **Connectez-vous** à l'application
2. **Ajoutez des produits** au panier (page `/cuisine` ou `/art`)
3. **Accédez au panier** (`/cart`)
4. **Cliquez sur "Passer commande"**
5. **Remplissez le formulaire** de checkout
6. **Sélectionnez une méthode de paiement**
7. **Cliquez sur "Payer"**
8. Vous serez redirigé vers **Flutterwave**
9. Utilisez les **cartes de test** (voir ci-dessous)
10. Après le paiement, vous serez **redirigé** vers la page de confirmation

### Méthode 2 : Via le composant de test

Pour un test rapide sans passer par tout le flux :

1. Ajoutez le composant `PaymentTestButton` à une page (par exemple HomePage)

```tsx
import PaymentTestButton from '@/components/PaymentTestButton';

// Dans votre composant
<PaymentTestButton />
```

2. Cliquez sur le bouton de test
3. Entrez un montant
4. Testez directement le paiement

### Méthode 3 : Via l'API directement

Utilisez Postman ou curl :

```bash
curl -X POST http://localhost:8080/api/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "email": "test@example.com",
    "phoneNumber": "+221771234567",
    "name": "Test User",
    "redirectUrl": "http://localhost:5173/payment/callback"
  }'
```

## 💳 Cartes de Test Flutterwave

### Carte Visa (Succès)
```
Numéro : 5531 8866 5214 2950
CVV : 564
Expiration : 09/32
Pin : 3310
OTP : 12345
```

### Carte Mastercard (Succès)
```
Numéro : 5438 8980 1456 0229
CVV : 564
Expiration : 09/32
Pin : 3310
OTP : 12345
```

### Carte Verve (Succès)
```
Numéro : 5061 0205 5999 9972
CVV : 564
Expiration : 09/32
Pin : 3310
OTP : 12345
```

### Carte pour tester l'échec
```
Numéro : 5143 0106 3742 0047
CVV : 828
Expiration : 09/32
Pin : 3310
OTP : 12345
```

## 🔍 Vérification du Paiement

### Logs Backend

Surveillez les logs de votre application Java :

```
✅ Webhook Flutterwave reçu : {...}
✅ Paiement validé pour la transaction TX-xxxxx
```

### Logs Frontend

Ouvrez la console du navigateur (F12) pour voir :

```
🔄 Initiation du paiement: {...}
✅ Réponse paiement: {...}
📥 Callback Flutterwave reçu: {...}
```

### Dashboard Flutterwave

1. Connectez-vous à votre dashboard Flutterwave
2. Allez dans **Transactions**
3. Vérifiez que votre transaction de test apparaît
4. Statut devrait être "Successful"

## 🐛 Résolution de Problèmes

### Erreur : "Invalid API key"
- ✅ Vérifiez que vous avez bien configuré les clés dans `application.yml`
- ✅ Assurez-vous d'utiliser les clés de TEST
- ✅ Redémarrez le backend après modification

### Erreur : "User not authenticated"
- ✅ Connectez-vous d'abord à l'application
- ✅ Vérifiez que le token JWT est présent dans localStorage

### Erreur : "Payment link generation failed"
- ✅ Vérifiez que le backend est démarré
- ✅ Vérifiez l'URL de l'API dans `.env` (frontend)
- ✅ Consultez les logs backend pour plus de détails

### Le webhook ne fonctionne pas
- ⚠️ En local, les webhooks ne fonctionneront PAS (Flutterwave ne peut pas atteindre localhost)
- ✅ Pour tester les webhooks, utilisez **ngrok** ou déployez sur un serveur
- ✅ Ou testez manuellement la vérification du paiement via l'endpoint `/verify`

### Redirection après paiement ne fonctionne pas
- ✅ Vérifiez que la route `/payment/callback` existe dans `App.tsx`
- ✅ Vérifiez que l'URL de redirection est correcte
- ✅ Consultez les paramètres de l'URL après redirection

## 📊 Flux de Test Recommandé

```
1. ✅ Connexion utilisateur
2. ✅ Ajout produits au panier
3. ✅ Accès au checkout
4. ✅ Remplissage formulaire
5. ✅ Initiation paiement
6. ✅ Redirection Flutterwave
7. ✅ Paiement avec carte test
8. ✅ Redirection callback
9. ✅ Vérification statut
10. ✅ Affichage confirmation
```

## 🎯 Checklist de Test

- [ ] Backend démarré et accessible
- [ ] Clés Flutterwave configurées (TEST)
- [ ] Utilisateur connecté
- [ ] Produits ajoutés au panier
- [ ] Formulaire checkout rempli
- [ ] Paiement initié sans erreur
- [ ] Redirection Flutterwave réussie
- [ ] Paiement effectué avec carte test
- [ ] Callback reçu correctement
- [ ] Statut affiché (succès/échec)
- [ ] Commande créée dans la base
- [ ] Transaction visible dans dashboard Flutterwave

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les logs backend et frontend
2. Vérifiez la documentation Flutterwave : https://developer.flutterwave.com
3. Vérifiez que toutes les dépendances sont installées
4. Assurez-vous que le backend et frontend communiquent correctement

## 🎉 Prochaines Étapes

Une fois les tests réussis :

1. [ ] Configurez les webhooks Flutterwave pour la production
2. [ ] Remplacez les clés TEST par les clés de PRODUCTION
3. [ ] Testez avec de vrais petits montants
4. [ ] Configurez les notifications email
5. [ ] Ajoutez la gestion des remboursements
6. [ ] Mettez en place le monitoring des transactions

Bon test ! 🚀


















