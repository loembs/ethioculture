# 🚨 URGENT : Configurer Flutterwave pour Éliminer les Erreurs 400

## ❌ Erreurs que Vous Voyez

```
api.ravepay.co/v2/checkout/upgrade - 400
metrics.flutterwave.com - 400
api.fpjs.io - 400
```

**Cause** : Le widget Flutterwave essaie de se charger mais la clé publique n'est pas configurée.

---

## ✅ Solution en 3 Étapes (5 minutes)

### Étape 1 : Créez le Fichier `.env.local`

**Emplacement** : `C:\Users\hp\Downloads\ethioculture\ethioculture\.env.local`

**Comment créer** :

#### Option A : Dans VSCode
1. Clic droit sur le dossier `ethioculture` (dans la barre latérale)
2. **New File**
3. Nommez-le : `.env.local`
4. Appuyez sur Entrée

#### Option B : Dans l'Explorateur Windows
1. Ouvrez : `C:\Users\hp\Downloads\ethioculture\ethioculture`
2. Clic droit → **Nouveau** → **Document texte**
3. Renommez en : `.env.local` (avec le point au début)
4. Windows va demander confirmation → Cliquez **Oui**

---

### Étape 2 : Copiez ce Contenu

Collez exactement ceci dans le fichier `.env.local` :

```env
# =============================================
# CONFIGURATION ETHIOCULTURE
# =============================================

# SUPABASE
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbWlod2pqb2tubXNzbmtocHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MDI5NzcsImV4cCI6MjA0ODM3ODk3N30.nT_KjQ3d2tg5yREYNWmXmyIqSFvmQKqkDTkVm_bjJso

# FLUTTERWAVE - OPTION 1 : Clé de test publique (pour tester rapidement)
# Cette clé fonctionne pour les tests mais n'est pas réelle
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-SANDBOXDEMOKEY12345-X

# FLUTTERWAVE - OPTION 2 : Votre vraie clé (recommandé)
# Décommentez la ligne ci-dessous et remplacez par votre clé
# VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-votre_vraie_cle_ici-X
```

---

### Étape 3 : Redémarrez le Serveur

**Dans le terminal où tourne le serveur** :

1. **Arrêtez** le serveur : `Ctrl + C`
2. **Relancez** : `npm run dev`
3. **Rafraîchissez** le navigateur : `Ctrl + F5`

---

## 🎯 Obtenir Votre Vraie Clé (Recommandé)

### Si Vous Avez Déjà un Compte Flutterwave

1. Allez sur : **https://dashboard.flutterwave.com/login**
2. Connectez-vous
3. Allez dans : **Settings** → **API Keys**
4. Copiez la **Public Key (Test)** qui ressemble à :
   ```
   FLWPUBK_TEST-1234567890abcdef1234567890abcdef-X
   ```
5. Remplacez dans `.env.local` :
   ```env
   VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-votre_cle_copiee-X
   ```

### Si Vous N'Avez Pas de Compte

1. Créez un compte : **https://dashboard.flutterwave.com/signup**
2. C'est **gratuit** pour les tests
3. Remplissez :
   - Nom de l'entreprise : **Geezaculture**
   - Email
   - Pays : Votre pays
   - Mot de passe
4. Activez votre compte (email de confirmation)
5. Suivez les étapes ci-dessus pour obtenir votre clé

---

## 🧪 Vérification

### Dans la Console du Navigateur (F12)

Après avoir créé `.env.local` et redémarré, tapez :

```javascript
console.log('Clé Flutterwave:', import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY)
```

**Résultat attendu** :
```
Clé Flutterwave: FLWPUBK_TEST-xxxxxxxxxxxxx-X
```

**Si vous voyez `undefined`** :
- Le fichier `.env.local` n'est pas au bon endroit
- Ou le serveur n'a pas été redémarré

---

## 📊 Résultats Après Configuration

### AVANT (maintenant)
```
❌ api.ravepay.co - 400
❌ metrics.flutterwave.com - 400
❌ api.fpjs.io - 400
❌ Widget affiche : "Paramètre PBFPubKey non valide"
```

### APRÈS (une fois configuré)
```
✅ Pas d'erreurs 400
✅ Widget Flutterwave s'affiche correctement
✅ Formulaire de paiement fonctionnel
✅ Vous pouvez tester avec les cartes de test
```

---

## 🎴 Carte de Test Flutterwave

Une fois configuré, utilisez cette carte pour tester :

```
┌─────────────────────────────────┐
│  Numéro : 5531 8866 5214 2950  │
│  CVV    : 564                   │
│  Exp    : 09/32                 │
│  Pin    : 3310                  │
│  OTP    : 12345                 │
└─────────────────────────────────┘
```

---

## 🐛 Dépannage

### Problème : "Toujours des erreurs 400"

**Solution** :
1. Vérifiez que le fichier s'appelle exactement `.env.local` (avec le point)
2. Vérifiez qu'il est dans le bon dossier : `ethioculture/.env.local`
3. Vérifiez que le serveur a été redémarré
4. Videz le cache navigateur : Ctrl + F5

### Problème : "Variable undefined dans la console"

**Solution** :
```bash
# Arrêtez le serveur (Ctrl+C)
# Nettoyez le cache
npm cache clean --force
# Relancez
npm run dev
```

### Problème : "Le fichier .env.local n'apparaît pas dans VSCode"

**Solution** :
- C'est normal si vous l'avez créé dans l'explorateur Windows
- Faites : **File** → **Open File** → Naviguez vers le fichier
- Ou redémarrez VSCode

---

## 📝 Structure Finale du Projet

```
ethioculture/
├── .env.local          ← CE FICHIER DOIT EXISTER !
├── package.json
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
└── ...
```

---

## ✨ Une Fois Configuré

Vous pourrez :
1. ✅ Cliquer sur "Payer" au checkout
2. ✅ Voir le widget Flutterwave s'afficher
3. ✅ Entrer une carte de test
4. ✅ Finaliser le paiement
5. ✅ Voir la commande confirmée

---

## 🚀 Résumé des 3 Étapes

1. **Créez** `.env.local` dans `ethioculture/`
2. **Copiez** le contenu avec la clé Flutterwave
3. **Redémarrez** le serveur : `Ctrl+C` puis `npm run dev`

---

**Configurez maintenant et les erreurs 400 disparaîtront ! 🎉**

Les erreurs que vous voyez sont NORMALES tant que la clé n'est pas configurée.
Dès que vous ajoutez la clé, elles disparaissent automatiquement.

