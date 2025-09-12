# 🚀 SydoFlow - Dashboard de Gestion de Projets avec IA

Un dashboard moderne de gestion de projets et d'équipes, intégrant un assistant IA intelligent avec support LLM local via Ollama.

## ✨ Fonctionnalités

### 🎯 **Dashboard Principal**
- **Vue d'ensemble** des projets et équipe
- **KPIs** en temps réel
- **Graphiques** interactifs avec Recharts
- **Interface moderne** avec Shadcn/ui

### 🤖 **Assistant IA Intelligent**
- **Chat Discord-like** intégré
- **Analyse intelligente** des données de projets
- **Suggestions** basées sur l'IA
- **Support LLM local** via Ollama (llama3.2:3b)
- **Mode hybride** : données CSV + enrichissement IA

### 📊 **Gestion des Données**
- **Import CSV** pour projets et équipe
- **Analyse automatique** des échéances
- **Détection d'alertes** et priorités
- **Export** vers Google Sheets (préparé)

### 👥 **Gestion d'Équipe**
- **Profils** avec avatars
- **Statuts** de disponibilité
- **Spécialités** et compétences
- **Charge de travail** par membre

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Shadcn/ui + Tailwind CSS
- **Routing** : React Router DOM
- **État** : TanStack Query
- **IA** : Ollama (LLM local)
- **Données** : CSV + Google Sheets API

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Ollama (pour l'IA)

### 1. Cloner le projet
```bash
git clone https://github.com/VOTRE-USERNAME/sydoflow.git
cd sydoflow
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Installer et configurer Ollama (optionnel)
```bash
# Installation automatique
npm run setup-ollama

# Ou installation manuelle
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
ollama pull llama3.2:3b
```

### 4. Démarrer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── dashboard/      # Composants du dashboard
│   ├── layout/         # Layout et navigation
│   └── ui/            # Composants UI (Shadcn)
├── pages/             # Pages principales
├── services/          # Services métier
│   ├── OllamaService.ts      # Communication LLM
│   ├── HybridChatbotService.ts # Intelligence hybride
│   ├── FriendlyChatbotService.ts # Réponses conviviales
│   └── DataService.ts        # Gestion des données
├── config/            # Configuration
└── assets/            # Images et ressources
```

## 🤖 Assistant IA

### Commandes disponibles
- `"aide"` - Liste des commandes
- `"projets"` - État des projets
- `"équipe"` - État de l'équipe
- `"deadlines"` - Échéances critiques
- `"actualiser"` - Recharger les données
- `"llm"` - Statut de l'IA

### Fonctionnalités IA
- **Analyse contextuelle** des projets
- **Suggestions intelligentes** d'actions
- **Détection d'alertes** automatique
- **Réponses enrichies** par LLM local

## 📊 Données d'Exemple

Le projet inclut des données d'exemple dans `public/data/` :
- `projets.csv` - 6 projets avec statuts et échéances
- `equipe.csv` - 10 membres d'équipe avec spécialités

## 🔧 Scripts Disponibles

```bash
npm run dev              # Démarrage développement
npm run build            # Build production
npm run preview          # Aperçu build
npm run setup-ollama     # Installation Ollama
npm run start-ollama     # Démarrage Ollama
npm run test-ollama      # Test LLM
```

## 📚 Documentation

- [Guide d'installation Ollama](OLLAMA_SETUP.md)
- [Configuration Google Sheets](GOOGLE_SHEETS_SETUP.md)
- [Configuration environnement](ENV_CONFIG.md)

## 🎯 Fonctionnalités Futures

- [ ] Intégration Google Sheets complète
- [ ] Notifications en temps réel
- [ ] Export PDF des rapports
- [ ] API REST pour intégrations
- [ ] Mode sombre/clair
- [ ] Multi-langues

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Hugues Perrin** - [@DigitHug](https://github.com/DigitHug)

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**