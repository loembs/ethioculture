# 🚀 Configuration Google OAuth - Production Vercel

## 📍 URLs du Projet

- **Production** : https://ethioculture.vercel.app
- **Backend Supabase** : https://mjmihwjjoknmssnkhpua.supabase.co
- **Développement** : http://localhost:5173

---

## ✅ Configuration Google Cloud Console

### 1. Origines JavaScript autorisées

Ces URLs peuvent UTILISER le bouton Google :

```
http://localhost:5173
https://mjmihwjjoknmssnkhpua.supabase.co
https://ethioculture.vercel.app
```

### 2. URI de redirection autorisés

Après connexion Google, redirection vers ces URLs :

```
https://mjmihwjjoknmssnkhpua.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
https://ethioculture.vercel.app/auth/callback
```

---

## 🔄 Flux de Connexion en Production

```
Utilisateur sur https://ethioculture.vercel.app/login
        ↓
Clique "Continuer avec Google"
        ↓
Google vérifie : "ethioculture.vercel.app est-il autorisé ?" ✅
        ↓
Popup Google avec choix de compte
        ↓
Utilisateur se connecte
        ↓
Google redirige vers : 
  https://mjmihwjjoknmssnkhpua.supabase.co/auth/v1/callback
        ↓
Supabase crée la session
        ↓
Redirection finale vers :
  https://ethioculture.vercel.app/
        ↓
Utilisateur connecté sur le site ✅
```

---

## 🧪 Comment Tester en Production

### 1. Ouvrir votre site
👉 https://ethioculture.vercel.app/login

### 2. Cliquer sur "Continuer avec Google"

### 3. Résultats attendus

**✅ Si bien configuré :**
- Popup Google s'ouvre
- Après connexion → Retour sur ethioculture.vercel.app
- Vous êtes connecté avec votre compte Google

**❌ Si mal configuré :**
- Erreur "redirect_uri_mismatch"
- Message : "L'URI de redirection n'est pas autorisée"

---

## 📊 Configuration Actuelle

### Google Cloud Console
- [x] Client ID créé
- [x] Client Secret créé
- [x] Origines JavaScript : localhost + Supabase + **Vercel** ✅
- [x] URI de redirection : Supabase + localhost + **Vercel** ✅

### Supabase
- [x] Google Provider activé
- [x] Client ID configuré
- [x] Client Secret configuré

### Vercel
- [x] Site déployé : https://ethioculture.vercel.app
- [x] Variables d'environnement configurées
- [x] Build réussi

---

## 🔍 Vérification Post-Configuration

Après avoir ajouté votre domaine Vercel :

1. **Attendez 1-2 minutes** (propagation Google)
2. **Testez** sur https://ethioculture.vercel.app/login
3. **Cliquez** "Continuer avec Google"
4. **Vérifiez** la connexion réussie

---

## 📝 Variables d'Environnement Vercel

Assurez-vous que ces variables sont configurées dans Vercel :

```env
VITE_SUPABASE_URL=https://mjmihwjjoknmssnkhpua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_FLUTTERWAVE_PUBLIC_KEY=bfb6d34a-10ff-48ba-85cd-e7a468069750
```

Pour vérifier/modifier :
1. Allez sur : https://vercel.com/loembs/ethioculture/settings/environment-variables
2. Vérifiez que toutes les variables sont présentes

---

## 🎯 Checklist Finale Production

- [ ] Domaine Vercel ajouté dans Google OAuth (Origines)
- [ ] Domaine Vercel ajouté dans Google OAuth (Redirections)
- [ ] Cliqué sur "Enregistrer" dans Google Console
- [ ] Attendu 1-2 minutes
- [ ] Testé sur https://ethioculture.vercel.app/login
- [ ] Connexion Google fonctionne ✅

---

## 🆘 Dépannage Production

### Erreur : "redirect_uri_mismatch"
**Cause** : Le callback URL n'est pas autorisé
**Solution** : Ajoutez `https://ethioculture.vercel.app/auth/callback` dans Google Console

### Erreur : "origin_mismatch"
**Cause** : Le domaine n'est pas autorisé
**Solution** : Ajoutez `https://ethioculture.vercel.app` dans Google Console

### La popup ne s'ouvre pas
**Cause** : Problème de configuration Supabase ou Google
**Solution** : Vérifiez que les clés dans Supabase sont correctes

### Connexion fonctionne mais pas de redirection
**Cause** : Problème dans le code de callback
**Solution** : Vérifiez les logs Vercel : https://vercel.com/loembs/ethioculture/logs

---

## ✨ Prochaines Étapes

Une fois que Google OAuth fonctionne en production :

1. ✅ Les utilisateurs peuvent se connecter avec Google
2. ✅ Leurs profils sont créés automatiquement
3. ✅ Ils peuvent commander et payer
4. ✅ Accès à leur espace personnel

---

**Configuration mise à jour le** : 17 octobre 2024

**Domaine de production** : https://ethioculture.vercel.app

**Status** : ✅ Prêt pour la production


