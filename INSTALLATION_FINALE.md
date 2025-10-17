# 🚀 Installation Finale - 3 étapes simples

## Étape 1: Configuration Frontend (.env.local)

```bash
cd ethioculture
```

Créer `.env.local`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Étape 2: Déployer Backend Supabase

```bash
cd ../supabase

# Connexion
supabase login

# Lier le projet
supabase link --project-ref your-ref

# Déployer
supabase db push
supabase functions deploy
```

## Étape 3: Tester

```bash
cd ../ethioculture
npm run dev
```

Ouvrir http://localhost:8081

---

## ✅ Résultat attendu

- **Pendant le chargement:** Skeletons animés
- **Après chargement:** Produits réels depuis Supabase
- **En cas d'erreur:** Message d'erreur (pas de données fictives)

---

**C'est tout ! 3 étapes et votre app est connectée à Supabase.** 🎉

















