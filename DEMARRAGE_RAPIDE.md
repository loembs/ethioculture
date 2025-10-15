# 🚀 Démarrage Rapide - Test du Paiement

## ⏱️ 5 Minutes pour Tester

### Étape 1 : Configuration Backend (2 min)

1. Ouvrez `geezaback/src/main/resources/application.yml`

2. Ajoutez vos clés Flutterwave de TEST :

```yaml
flutterwave:
  secret-key: FLWSECK_TEST-votre-cle-secrete
  public-key: FLWPUBK_TEST-votre-cle-publique
  base-url: https://api.flutterwave.com/v3
  secret-hash: votre-hash-secret
```

> 🔑 **Où trouver ces clés ?**
> - Allez sur https://dashboard.flutterwave.com
> - Settings → API Keys
> - Copiez les clés **TEST** (pas production !)

### Étape 2 : Démarrer les Serveurs (1 min)

```bash
# Terminal 1 - Backend
cd geezaback
./mvnw spring-boot:run

# Terminal 2 - Frontend  
cd ethioculture
npm run dev
```

### Étape 3 : Tester le Paiement (2 min)

1. **Ouvrez** http://localhost:5173

2. **Connectez-vous** (ou créez un compte)

3. **Ajoutez des produits** au panier

4. **Allez au checkout** → Remplissez le formulaire

5. **Cliquez sur "Payer"**

6. **Sur la page Flutterwave**, utilisez cette carte :
   ```
   Numéro : 5531 8866 5214 2950
   CVV    : 564
   Date   : 09/32
   Pin    : 3310
   OTP    : 12345
   ```

7. **Validez** et observez la confirmation ! ✅

## 🎯 C'est Tout !

Si tout fonctionne, vous verrez :
- ✅ Une page de confirmation avec "Paiement réussi !"
- ✅ La transaction dans votre dashboard Flutterwave
- ✅ Des logs dans la console backend

## 🐛 Ça ne marche pas ?

### Problème : "Invalid API key"
→ Vérifiez vos clés dans `application.yml` et redémarrez le backend

### Problème : "User not authenticated"  
→ Assurez-vous d'être connecté avant de payer

### Problème : "Cannot connect to backend"
→ Vérifiez que le backend tourne sur http://localhost:8080

## 📚 Plus de Détails ?

- **Guide complet** → `GUIDE_TEST_PAIEMENT.md`
- **Architecture** → `PAYMENT_INTEGRATION.md`
- **Résumé visuel** → `PAIEMENT_PRET.md`

---

**Besoin d'aide ?** Consultez les fichiers de documentation ci-dessus !





