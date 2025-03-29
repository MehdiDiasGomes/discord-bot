# 🎸 Soolking - Bot Discord 🤖

![Status](https://img.shields.io/badge/status-actif-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blueviolet)

## 📖 À propos

Shanks est un bot Discord puissant et facile à utiliser qui permet de jouer de la musique dans vos salons vocaux. Avec des commandes intuitives et une qualité audio exceptionnelle, Shanks est le compagnon idéal pour animer vos serveurs Discord !

## ✨ Fonctionnalités

- 🎧 Jouer de la musique depuis YouTube
- ⏭️ Passer à la chanson suivante
- 📋 Gérer une file d'attente de lecture
- 🔊 Contrôle du volume
- 🔄 Structure de code modulaire et extensible
- ⚡ Performance optimisée avec Bun

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) (v16.9.0 ou supérieur)
- [Bun](https://bun.sh/) (recommandé pour des performances optimales)
- [FFmpeg](https://ffmpeg.org/) (pour le traitement audio)

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-username/shanks-bot.git
cd shanks-bot
```

2. **Installer les dépendances**
```bash
bun install
```
ou
```bash
npm install
```

3. **Configurer le .env**
Créez un fichier `.env` à la racine du projet et ajoutez votre token Discord :
```
BOT_TOKEN=votre_token_discord
PREFIX=!
```

4. **Démarrer le bot**
```bash
bun start
```
ou
```bash
npm start
```

## 🎮 Commandes

| Commande | Description | Utilisation |
|----------|-------------|-------------|
| `!play` | Joue une chanson ou l'ajoute à la file d'attente | `!play nom_de_la_chanson` ou `!play URL` |
| `!next` | Passe à la chanson suivante | `!next` |
| `!disconnect` | Déconnecte le bot du salon vocal | `!disconnect` |

## 🏗️ Structure du Projet

```
shanks-bot/
├── .env                # Variables d'environnement
├── index.js            # Point d'entrée principal
├── commands/           # Commandes du bot
│   └── music/          # Commandes musicales
├── events/             # Gestionnaires d'événements Discord
├── services/           # Services comme le lecteur de musique
└── utils/              # Fonctions utilitaires
```

## 🛠️ Développement

Shanks est construit avec une architecture modulaire qui facilite l'ajout de nouvelles fonctionnalités. Chaque commande est séparée dans son propre fichier pour une meilleure maintenabilité.

### Ajouter une nouvelle commande

1. Créez un nouveau fichier dans le dossier `commands/music/`
2. Suivez le modèle des commandes existantes
3. Le système de chargement automatique détectera votre nouvelle commande

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commitez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 💖 Remerciements

- [Discord.js](https://discord.js.org/) pour leur incroyable framework
- [discord-player](https://discord-player.js.org/) pour les fonctionnalités de lecture audio
- Tous les contributeurs qui ont participé à ce projet

---

Développé avec ❤️ par @MehdiDiasGomes

🌟 N'oubliez pas de mettre une étoile si ce projet vous a été utile ! 🌟