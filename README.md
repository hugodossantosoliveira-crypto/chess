# Gambit ♞

App d'échecs pour débuter : ouvertures, tactiques et principes. PWA installable (iPhone, iPad, Apple TV, desktop).

## Stack
- React 18 + Vite
- `chess.js` pour la logique d'échecs (validation des coups, détection de mat)
- Aucune autre dépendance (pas de Tailwind, Framer ni styled-components)

## Lancer en local
```bash
npm install
npm run dev
```

## Build de production
```bash
npm run build      # genere /dist
npm run preview    # previsualise le build
```

## Déploiement Vercel
1. Pousser ce dépôt sur GitHub.
2. Sur Vercel : New Project → importer le dépôt.
3. Framework détecté automatiquement : **Vite**. Aucune config à toucher.
   - Build command : `npm run build`
   - Output directory : `dist`
4. Deploy. Auto-déploiement à chaque push ensuite.

## Contenu
- **Ouvertures** : Italienne, Londres (Blancs), Scandinave, Caro-Kann, Gambit Dame Refusé (Noirs). Mode *Apprendre* (déroulé commenté) et *S'entraîner* (de mémoire).
- **Tactiques** : mats en 1, pièces en prise, fourchettes.
- **Principes** : les 7 règles d'ouverture + le réflexe anti-gaffe.
- **Progrès** : série de jours, ouvertures vues, tactiques résolues, précision. Stocké en local (localStorage).
