# 🔧 Configuration Variables d'Environnement

## 📝 Fichier `.env.local` à Créer

Créez ce fichier dans le dossier `ethioculture/` (à la racine, à côté de `package.json`)

```env
# ============================================
# SUPABASE (déjà configuré normalement)
# ============================================
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# FLUTTERWAVE (À CONFIGURER)
# ============================================
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

---

## 🔑 Comment Obtenir les Clés

### Supabase (déjà fait normalement)

1. Allez sur : https://supabase.com/dashboard/project/mjmihwjjoknmssnkhpua/settings/api
2. Copiez **Project URL** → `VITE_SUPABASE_URL`
3. Copiez **anon public** → `VITE_SUPABASE_ANON_KEY`

### Flutterwave (À FAIRE)

1. **Créez un compte** (si pas déjà fait) : https://dashboard.flutterwave.com/signup
2. **Connectez-vous** : https://dashboard.flutterwave.com/login
3. **Allez dans Settings** → **API Keys**
4. **Mode TEST** (pour le développement) :
   - Copiez **Public Key** (commence par `FLWPUBK_TEST-`)
   - Collez dans `.env.local`

---

## 📋 Checklist de Configuration

- [ ] Fichier `.env.local` créé
- [ ] `VITE_SUPABASE_URL` configuré
- [ ] `VITE_SUPABASE_ANON_KEY` configuré
- [ ] `VITE_FLUTTERWAVE_PUBLIC_KEY` configuré
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Test effectué avec carte de test

---

## 🧪 Test de Vérification

### Vérifier que tout fonctionne :

```bash
cd ethioculture
npm run dev
```

Puis dans votre navigateur :

1. Ouvrez la console (F12)
2. Allez sur le site
3. Si vous voyez des erreurs de type "Missing environment variable", c'est que le `.env.local` n'est pas configuré

---

## 🔒 Sécurité

### ✅ À FAIRE

- Utilisez les clés **TEST** pour le développement
- Ne commitez **JAMAIS** le fichier `.env.local`
- Ajoutez `.env.local` dans `.gitignore`

### ❌ À NE PAS FAIRE

- Ne partagez jamais vos clés
- N'utilisez pas les clés TEST en production
- Ne commitez pas les clés dans Git

---

## 🚀 Passage en Production

Quand vous déployez sur Vercel/Netlify/autre :

1. Allez dans les **paramètres d'environnement** de votre plateforme
2. Ajoutez les mêmes variables (sans le fichier `.env.local`)
3. Pour Flutterwave, utilisez les clés **LIVE** (sans `-TEST`)

### Exemple Vercel :

```
Settings → Environment Variables → Add

Name: VITE_FLUTTERWAVE_PUBLIC_KEY
Value: FLWPUBK-xxxxxxxxxxxxxxx (sans -TEST)
```

---

## 📚 Documentation Officielle

- **Supabase** : https://supabase.com/docs/guides/getting-started
- **Flutterwave** : https://developer.flutterwave.com/docs/getting-started
- **Vite Env Variables** : https://vitejs.dev/guide/env-and-mode.html

---

**Configuration terminée ! ✅**






