# 😂 LaughHub

Le réseau social où on vient **juste pour rire**.

## 🌟 Présentation

LaughHub est une plateforme fun où les utilisateurs partagent des blagues, memes, histoires drôles et interagissent principalement avec le bouton **😂 Laugh**.

## ✨ Fonctionnalités

- Authentification avec Clerk
- Publication de blagues (texte + images)
- Feed en temps réel
- Bouton Laugh avec animation
- Upload d'images
- Design moderne dark mode

## 🛠️ Technologies

- **Frontend** : Astro 5 + React
- **Backend** : Convex
- **Auth** : Clerk
- **Styling** : Tailwind CSS
- **Déploiement** : Vercel + Convex Cloud

## 🚀 Installation et Lancement

### 1. Clone le projet
```bash
git clone <ton-repo>
cd laughhub
```

### 2. Installe les dépendances
```bash
npm install
```

### 3. Variables d'environnement

Crée un fichier `.env` à la racine :

```env
PUBLIC_CONVEX_URL=your_convex_url
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 4. Lancement en développement

```bash
# Terminal 1
npx convex dev

# Terminal 2
npm run dev
```

## Structure du projet

```
laughhub/
├── convex/             # Backend (schema, functions)
├── src/
│   ├── components/     # Composants React
│   ├── layouts/
│   ├── pages/
│   └── lib/
├── .env
└── astro.config.mjs
```

## Commandes utiles

- `npm run dev` → Lancer le projet complet
- `npx convex dev` → Lancer seulement le backend
- `npm run build` → Build pour la production

## Prochaines évolutions

- Système de commentaires
- Page de profil
- Leaderboard des utilisateurs les plus drôles
- Meme generator intégré
- Dark/Light mode
made with convex astro 
