# EthioCulture - Cuisine Éthiopienne & Art Authentique

Cette application web présente l'authenticité de la culture éthiopienne à travers une sélection de plats traditionnels et d'œuvres d'art uniques.

## Fonctionnalités

- **Cuisine Éthiopienne** : Plats traditionnels authentiques
- **Art & Culture** : Galerie d'œuvres d'art éthiopiennes
- **E-commerce** : Système de commande et de paiement
- **Authentification** : Gestion des utilisateurs et des sessions
- **Profil** : Gestion des commandes et des informations personnelles

## Technologies

- **Frontend** : React, TypeScript, Vite, Tailwind CSS
- **Backend** : Spring Boot, Java 17
- **Base de données** : PostgreSQL
- **Cache** : Redis

## Démarrage Local

### Prérequis
- Node.js 18+ et npm
- Java 17+
- PostgreSQL
- Redis

### Installation

1. **Backend** : 
   ```bash
   cd geezaback
   mvn clean install
   mvn spring-boot:run
   ```

2. **Frontend** :
   ```bash
   cd ethioculture
   npm install
   npm run dev
   ```

3. **Configuration** :
   - Configurer PostgreSQL
   - Configurer Redis
   - Mettre à jour les fichiers de configuration

## Structure du Projet

```
ethioculture/
├── ethioculture/          # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   └── utils/         # Utilitaires
│   └── public/            # Assets statiques
├── geezaback/             # Backend Spring Boot
│   └── src/main/java/     # Code source Java
└── README.md
```

## Déploiement

### Frontend
L'application frontend peut être déployée sur Vercel, Netlify ou tout hébergeur statique.

### Backend
Le backend peut être déployé sur Render, Heroku ou tout service Java.

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.