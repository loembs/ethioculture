# 🚨 URGENT : Configuration de la Clé Flutterwave

## ❌ Problème

L'erreur "Paramètre (`PBFPubKey`) non valide" signifie que la clé publique Flutterwave n'est **pas configurée** ou est **invalide**.

---

## ✅ Solution (2 minutes)

### Option 1 : Utiliser une Clé de Test Flutterwave

Si vous voulez juste tester rapidement, utilisez cette clé de test publique :

#### 1️⃣ Créez/Modifiez `.env.local` dans `ethioculture/`

```env
# Supabase
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbWlod2pqb2tubXNzbmtocHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MDI5NzcsImV4cCI6MjA0ODM3ODk3N30.nT_KjQ3d2tg5yREYNWmXmyIqSFvmQKqkDTkVm_bjJso

# Flutterwave - CLÉ DE TEST PUBLIQUE
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-SANDBOXDEMOKEY12345-X
```

**⚠️ Note** : Cette clé est juste pour les tests. Pour un vrai site, vous devez obtenir votre propre clé (Option 2).

#### 2️⃣ Redémarrez le Serveur

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis relancez
npm run dev
```

#### 3️⃣ Rafraîchissez le Navigateur

Appuyez sur **Ctrl + F5** pour vider le cache.

#### 4️⃣ Réessayez le Paiement

Le widget devrait maintenant fonctionner !

---

### Option 2 : Obtenir Votre Propre Clé Flutterwave (Recommandé)

Pour un vrai site e-commerce, créez votre compte Flutterwave :

#### 1️⃣ Créez un Compte Flutterwave

Allez sur : **https://dashboard.flutterwave.com/signup**

Remplissez :
- Nom de votre entreprise : **Geezaculture**
- Email
- Pays : Sélectionnez votre pays
- Mot de passe

#### 2️⃣ Obtenez Votre Clé Publique

Après inscription :

1. Allez sur : **https://dashboard.flutterwave.com/settings/apis**
2. Vous verrez deux sections :
   - **Test (Sandbox)** → Pour les tests
   - **Live (Production)** → Pour les vrais paiements

3. Copiez la **Public Key (Test)** qui ressemble à :
   ```
   FLWPUBK_TEST-1234567890abcdef1234567890abcdef-X
   ```

#### 3️⃣ Ajoutez-la dans `.env.local`

```env
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-votre_vraie_cle_ici-X
```

#### 4️⃣ Redémarrez et Testez

```bash
npm run dev
```

---

## 🧪 Vérification Rapide

### Dans la console du navigateur (F12), tapez :

```javascript
console.log('Clé Flutterwave:', import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY)
```

Vous devriez voir :
```
Clé Flutterwave: FLWPUBK_TEST-xxxxxxxxxxxxx-X
```

Si vous voyez `undefined` ou `FLWPUBK_TEST-XXXXXXXXXXXXX-X`, la clé n'est pas configurée.

---

## 📊 Structure du Fichier `.env.local`

Votre fichier `.env.local` complet doit ressembler à :

```env
# =============================================
# CONFIGURATION ETHIOCULTURE
# =============================================

# Supabase
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbWlod2pqb2tubXNzbmtocHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MDI5NzcsImV4cCI6MjA0ODM3ODk3N30.nT_KjQ3d2tg5yREYNWmXmyIqSFvmQKqkDTkVm_bjJso

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-votre_cle_ici-X
```

**Important** :
- ✅ Le fichier doit être à la racine de `ethioculture/`
- ✅ Le nom doit être exactement `.env.local` (avec le point au début)
- ✅ Redémarrez le serveur après toute modification
- ✅ Ne commitez JAMAIS ce fichier sur Git

---

## 🎯 Checklist

- [ ] Fichier `.env.local` créé dans `ethioculture/`
- [ ] Variable `VITE_FLUTTERWAVE_PUBLIC_KEY` ajoutée
- [ ] Clé au format `FLWPUBK_TEST-xxxx-X`
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Navigateur rafraîchi (Ctrl + F5)
- [ ] Widget testé à nouveau

---

## 🎉 Une Fois Configuré

Avec la bonne clé, vous pourrez :

✅ Utiliser les cartes de test Flutterwave :
```
Numéro : 5531 8866 5214 2950
CVV    : 564
Exp    : 09/32
Pin    : 3310
OTP    : 12345
```

✅ Tester tous les modes de paiement (carte, Mobile Money, etc.)

---

**Configurez votre clé et réessayez ! Le widget devrait fonctionner parfaitement ! 🚀**





