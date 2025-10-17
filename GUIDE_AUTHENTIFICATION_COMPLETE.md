# 🔐 Guide d'Authentification Complet - Geezaculture

## Fonctionnalités Implémentées

✅ **Connexion par email/mot de passe**  
✅ **Connexion avec Google OAuth**  
✅ **Inscription avec validation**  
✅ **Récupération de mot de passe**  
✅ **Code OTP par email**  
✅ **Protection des routes**  
✅ **Gestion des rôles (CLIENT/ADMIN)**

---

## 🚀 Configuration Google OAuth dans Supabase

### Étape 1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez **Google+ API**

### Étape 2: Configurer l'écran de consentement OAuth

1. Dans le menu, allez à **APIs & Services** → **OAuth consent screen**
2. Sélectionnez **External** et cliquez sur **Create**
3. Remplissez les informations requises :
   - **App name**: Geezaculture
   - **User support email**: Votre email
   - **Developer contact information**: Votre email
4. Cliquez sur **Save and Continue**
5. Dans **Scopes**, ajoutez :
   - `userinfo.email`
   - `userinfo.profile`
6. Cliquez sur **Save and Continue**

### Étape 3: Créer les identifiants OAuth

1. Allez à **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **OAuth 2.0 Client ID**
3. Sélectionnez **Web application**
4. Configurez :
   - **Name**: Geezaculture Web Client
   - **Authorized JavaScript origins**:
     ```
     https://mjmihwjjoknmssnkhpua.supabase.co
     http://localhost:5173
     https://votre-domaine-vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     https://mjmihwjjoknmssnkhpua.supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback
     https://votre-domaine-vercel.app/auth/callback
     ```
5. Cliquez sur **Create**
6. **Notez le Client ID et Client Secret** affichés

### Étape 4: Configurer Google OAuth dans Supabase

1. Allez dans votre [Dashboard Supabase](https://supabase.com/dashboard/project/mjmihwjjoknmssnkhpua)
2. Allez dans **Authentication** → **Providers**
3. Trouvez **Google** dans la liste
4. Activez **Google enabled**
5. Collez vos identifiants :
   - **Client ID**: `votre-client-id.apps.googleusercontent.com`
   - **Client Secret**: `votre-client-secret`
6. Cliquez sur **Save**

### Étape 5: Tester la connexion

1. Ouvrez votre application
2. Cliquez sur **Continuer avec Google**
3. Sélectionnez votre compte Google
4. Autorisez l'accès
5. Vous devriez être redirigé vers votre application, connecté !

---

## 📧 Configuration de la Récupération de Mot de Passe

### Configuration SMTP (Optionnel - Utilise Supabase par défaut)

1. Dans Supabase Dashboard → **Project Settings** → **Auth**
2. Scroll jusqu'à **Email Auth**
3. Personnalisez le template d'email si nécessaire
4. **Template Variables disponibles**:
   ```
   {{ .ConfirmationURL }} - Lien de réinitialisation
   {{ .Token }} - Token de réinitialisation
   {{ .Email }} - Email de l'utilisateur
   {{ .SiteURL }} - URL de votre site
   ```

### Test de récupération de mot de passe

1. Sur la page de connexion, cliquez sur **"Mot de passe oublié ?"**
2. Entrez votre email
3. Cliquez sur **"Envoyer le lien de réinitialisation"**
4. Vérifiez votre boîte email
5. Cliquez sur le lien reçu
6. Entrez votre nouveau mot de passe
7. Validez ✅

---

## 🛡️ Protection des Routes

Les routes suivantes sont automatiquement protégées :

- `/cart` - Panier
- `/checkout` - Paiement
- `/payment/*` - Confirmation de paiement
- `/profile` - Profil utilisateur
- `/user-profile` - Profil détaillé
- `/admin/*` - Dashboard admin (**Nécessite rôle ADMIN**)

Si un utilisateur non authentifié tente d'accéder à ces routes, il sera redirigé vers `/login?redirect=<route-demandée>`.

---

## 🔑 Gestion des Rôles

### Rôles disponibles

- **CLIENT** - Utilisateur normal (par défaut)
- **ADMIN** - Administrateur avec accès au dashboard
- **SELLER** - Vendeur (futur)

### Changer le rôle d'un utilisateur

#### Via SQL dans Supabase :

```sql
-- Promouvoir un utilisateur en ADMIN
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@ethioculture.com';
```

#### Via l'interface (si implémentée) :

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin/users`
3. Modifiez le rôle de l'utilisateur souhaité

---

## 📱 Flux d'Authentification

### 1. Connexion Email/Mot de passe

```
Utilisateur entre email + mot de passe
    ↓
Supabase Auth vérifie les credentials
    ↓
Si valide: Session créée + JWT token
    ↓
Profil utilisateur chargé depuis la table users
    ↓
Redirection vers la page demandée
```

### 2. Connexion Google OAuth

```
Utilisateur clique sur "Continuer avec Google"
    ↓
Redirection vers Google OAuth
    ↓
Utilisateur autorise l'accès
    ↓
Google redirige vers Supabase callback
    ↓
Supabase crée/met à jour l'utilisateur
    ↓
Redirection vers l'application
    ↓
Si premier login: Création du profil automatique
```

### 3. Récupération de mot de passe

```
Utilisateur clique sur "Mot de passe oublié"
    ↓
Entre son email
    ↓
Supabase envoie un email avec lien magique
    ↓
Utilisateur clique sur le lien
    ↓
Redirection vers /reset-password
    ↓
Utilisateur entre nouveau mot de passe
    ↓
Mot de passe mis à jour
    ↓
Redirection vers /profile
```

---

## 🧪 Tests

### Tester la connexion

```typescript
// Test manuel
1. Ouvrir http://localhost:5173/login
2. Entrer: admin@ethioculture.com / votre-mot-de-passe
3. Vérifier la redirection vers /profile
```

### Tester Google OAuth

```typescript
1. Cliquer sur "Continuer avec Google"
2. Sélectionner un compte Google de test
3. Vérifier la création automatique du profil
4. Vérifier la redirection
```

### Tester la protection des routes

```typescript
1. Déconnectez-vous
2. Essayez d'accéder à /cart
3. Vérifiez la redirection vers /login?redirect=/cart
4. Après connexion, vérifiez le retour vers /cart
```

---

## 🔧 Dépannage

### Erreur "Invalid redirect URL"

**Solution**: Vérifiez que l'URL de callback est bien ajoutée dans :
- Google Cloud Console → Authorized redirect URIs
- Supabase Dashboard → Authentication → URL Configuration

### Google OAuth ne fonctionne pas

**Vérifications**:
1. ✅ Google+ API activée dans Google Cloud
2. ✅ Client ID et Secret corrects dans Supabase
3. ✅ Authorized origins configurées
4. ✅ Redirect URIs configurées

### Email de réinitialisation non reçu

**Solutions**:
1. Vérifier les spams
2. Vérifier la configuration SMTP dans Supabase
3. Vérifier les logs dans Supabase Dashboard → Logs → Auth Logs

### Route protégée accessible sans connexion

**Solution**: Vérifier que `<ProtectedRoute>` entoure bien le composant dans `App.tsx`

```tsx
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

---

## 📚 API du Service d'Authentification

### Méthodes disponibles

```typescript
// Connexion
authService.signIn(email, password)
authService.signInWithGoogle()

// Inscription
authService.signUp(email, password, userData)

// Déconnexion
authService.signOut()

// Récupération de mot de passe
authService.sendPasswordResetEmail(email)
authService.updatePassword(newPassword)

// Session
authService.getCurrentUser()
authService.getUserProfile()
authService.isAuthenticated()

// Rôles
authService.isAdmin()
authService.hasRole('ADMIN')

// OTP
authService.sendOTP(email)
authService.verifyOTP(email, code)
```

---

## 🎯 Prochaines Étapes

- [ ] Ajouter la connexion avec Facebook
- [ ] Ajouter la connexion avec Apple
- [ ] Implémenter l'authentification à deux facteurs (2FA)
- [ ] Ajouter la gestion des sessions multiples
- [ ] Implémenter le "Se souvenir de moi" fonctionnel
- [ ] Ajouter des logs d'audit pour les connexions

---

## 📞 Support

En cas de problème:
1. Vérifiez les logs Supabase
2. Consultez la documentation: https://supabase.com/docs/guides/auth
3. Vérifiez la console du navigateur pour les erreurs JavaScript

---

**Développé avec ❤️ pour Geezaculture**

