# 🧪 Test de la Connexion Google

## Configuration Complétée ✅

### Dans Google Cloud Console :
- ✅ Origines JavaScript autorisées configurées
- ✅ URI de redirection configurés
- ✅ Client ID récupéré
- ✅ Client Secret récupéré

### Dans Supabase :
- ✅ Google Provider activé
- ✅ Client ID configuré
- ✅ Client Secret configuré

---

## 🧪 Comment Tester

### 1. Lancer l'application en local

```bash
cd ethioculture
npm run dev
```

### 2. Accéder à la page de connexion

Ouvrez votre navigateur : **http://localhost:5173/login**

### 3. Tester la connexion Google

1. Cliquez sur le bouton **"Continuer avec Google"**
2. Une popup Google devrait s'ouvrir
3. Sélectionnez votre compte Google
4. Autorisez l'accès à Geezaculture
5. Vous devriez être redirigé et connecté ✅

---

## ❓ En cas de problème

### Erreur : "redirect_uri_mismatch"
**Solution** : Vérifiez que dans Google Cloud Console, vous avez bien ajouté :
```
https://mjmihwjjoknmssnkhpua.supabase.co/auth/v1/callback
```

### Erreur : "Origin not allowed"
**Solution** : Vérifiez que dans Google Cloud Console, vous avez bien ajouté :
```
http://localhost:5173
https://mjmihwjjoknmssnkhpua.supabase.co
```

### La popup Google ne s'ouvre pas
**Solution** : Vérifiez que :
- Les clés sont bien configurées dans Supabase
- Le toggle "Enable Sign in with Google" est activé
- Vous avez bien cliqué sur "Save" dans Supabase

### Connexion réussie mais pas de redirection
**Solution** : Vérifiez la console du navigateur (F12) pour voir les erreurs

---

## 🔍 Logs de Débogage

Pour voir les logs d'authentification dans Supabase :
1. Allez sur : https://supabase.com/dashboard/project/mjmihwjjoknmssnkhpua/logs/explorer
2. Sélectionnez "Auth Logs"
3. Vous verrez tous les événements de connexion

---

## ✨ Configuration Réussie !

Si vous voyez votre nom et êtes connecté, félicitations ! 🎉

La connexion Google fonctionne maintenant sur :
- ✅ Développement local (localhost)
- ✅ Production (une fois déployé sur Vercel)

---

## 🚀 Prochaine Étape : Déploiement

Quand vous déployez sur Vercel, n'oubliez pas d'ajouter votre domaine dans :

**Google Cloud Console** :
- Origines JavaScript : `https://votre-site.vercel.app`
- URI de redirection : `https://votre-site.vercel.app/auth/callback`



