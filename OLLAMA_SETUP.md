# 🤖 Configuration Ollama pour l'Assistant IA

## 📋 Prérequis

Pour que l'assistant IA fonctionne avec le LLM (Large Language Model), vous devez installer et configurer Ollama.

## 🚀 Installation d'Ollama

### Sur macOS
```bash
# Installation via Homebrew (recommandé)
brew install ollama

# Ou télécharger depuis le site officiel
# https://ollama.ai/download
```

### Sur Linux
```bash
# Installation automatique
curl -fsSL https://ollama.ai/install.sh | sh
```

### Sur Windows
1. Téléchargez l'installateur depuis https://ollama.ai/download
2. Exécutez l'installateur
3. Redémarrez votre terminal

## 🎯 Configuration

### 1. Démarrer Ollama
```bash
# Démarrer le service Ollama
ollama serve
```

### 2. Télécharger un modèle
```bash
# Modèle recommandé pour le français (léger et efficace)
ollama pull llama3.2:3b

# Ou pour plus de puissance (nécessite plus de RAM)
ollama pull llama3.2:8b

# Modèle spécialisé en français
ollama pull mistral:7b
```

### 3. Vérifier l'installation
```bash
# Lister les modèles installés
ollama list

# Tester un modèle
ollama run llama3.2:3b
```

## 🔧 Configuration dans SydoFlow

### Variables d'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# Configuration Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### Vérification du statut
L'assistant IA affichera automatiquement le statut du LLM :
- 🟢 **Vert** : LLM disponible et actif
- 🟡 **Jaune** : LLM disponible mais non activé
- 🔴 **Rouge** : LLM non disponible

## 🎮 Utilisation

### Commandes disponibles
- `"llm"` - Vérifier le statut du LLM
- `"aide"` - Liste des commandes
- `"projets"` - Analyse des projets (avec enrichissement IA)
- `"équipe"` - Analyse de l'équipe (avec enrichissement IA)

### Fonctionnement hybride
L'assistant fonctionne en mode hybride :
1. **Analyse des données CSV** (toujours disponible)
2. **Enrichissement LLM** (si Ollama est actif)

## 🐛 Dépannage

### Problème : "LLM non disponible"
```bash
# Vérifier que Ollama est démarré
ps aux | grep ollama

# Redémarrer Ollama
ollama serve
```

### Problème : "Modèle non trouvé"
```bash
# Vérifier les modèles installés
ollama list

# Installer un modèle
ollama pull llama3.2:3b
```

### Problème : "Connexion refusée"
```bash
# Vérifier que le port 11434 est libre
lsof -i :11434

# Redémarrer Ollama
ollama serve
```

## 📊 Modèles recommandés

| Modèle | Taille | RAM requise | Performance | Usage |
|--------|--------|-------------|-------------|-------|
| `llama3.2:3b` | 2GB | 4GB | ⭐⭐⭐ | Développement |
| `llama3.2:8b` | 4.7GB | 8GB | ⭐⭐⭐⭐ | Production |
| `mistral:7b` | 4.1GB | 8GB | ⭐⭐⭐⭐ | Français |

## 🚀 Démarrage rapide

```bash
# 1. Installer Ollama
brew install ollama

# 2. Démarrer le service
ollama serve

# 3. Installer un modèle (dans un autre terminal)
ollama pull llama3.2:3b

# 4. Démarrer SydoFlow
npm run dev
```

## 💡 Conseils

- **Développement** : Utilisez `llama3.2:3b` (léger et rapide)
- **Production** : Utilisez `llama3.2:8b` ou `mistral:7b` (plus performant)
- **Mémoire** : Assurez-vous d'avoir assez de RAM (4GB minimum pour 3b, 8GB pour 7b+)
- **Performance** : Le premier appel peut être lent (chargement du modèle)

## 🔄 Mise à jour

```bash
# Mettre à jour Ollama
brew upgrade ollama

# Mettre à jour un modèle
ollama pull llama3.2:3b
```

---

**Note** : L'assistant fonctionne parfaitement sans LLM, mais l'enrichissement IA améliore considérablement la qualité des réponses ! 🚀