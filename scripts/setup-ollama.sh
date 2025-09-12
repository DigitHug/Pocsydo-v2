#!/bin/bash

# Script d'installation automatique d'Ollama pour SydoFlow
# Usage: ./scripts/setup-ollama.sh

echo "🤖 Installation d'Ollama pour SydoFlow"
echo "======================================"

# Vérifier si Ollama est déjà installé
if command -v ollama &> /dev/null; then
    echo "✅ Ollama est déjà installé"
    ollama --version
else
    echo "📦 Installation d'Ollama..."
    
    # Détecter le système d'exploitation
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            echo "🍺 Installation via Homebrew..."
            brew install ollama
        else
            echo "❌ Homebrew non trouvé. Veuillez installer Homebrew ou télécharger Ollama depuis https://ollama.ai/download"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "🐧 Installation sur Linux..."
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "❌ Système d'exploitation non supporté. Veuillez installer Ollama manuellement depuis https://ollama.ai/download"
        exit 1
    fi
fi

echo ""
echo "🚀 Démarrage d'Ollama..."

# Démarrer Ollama en arrière-plan
ollama serve &
OLLAMA_PID=$!

# Attendre que Ollama soit prêt
echo "⏳ Attente du démarrage d'Ollama..."
sleep 5

# Vérifier que Ollama est en cours d'exécution
if ps -p $OLLAMA_PID > /dev/null; then
    echo "✅ Ollama démarré avec succès (PID: $OLLAMA_PID)"
else
    echo "❌ Erreur lors du démarrage d'Ollama"
    exit 1
fi

echo ""
echo "📥 Téléchargement du modèle recommandé..."

# Télécharger le modèle recommandé
ollama pull llama3.2:3b

echo ""
echo "🔍 Vérification de l'installation..."

# Vérifier que le modèle est installé
if ollama list | grep -q "llama3.2:3b"; then
    echo "✅ Modèle llama3.2:3b installé avec succès"
else
    echo "❌ Erreur lors de l'installation du modèle"
    exit 1
fi

echo ""
echo "🧪 Test du modèle..."

# Test rapide du modèle
echo "Test: 'Bonjour, comment ça va ?'" | ollama run llama3.2:3b --verbose=false | head -3

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📋 Résumé :"
echo "• Ollama installé et démarré"
echo "• Modèle llama3.2:3b installé"
echo "• Service disponible sur http://localhost:11434"
echo ""
echo "🚀 Vous pouvez maintenant démarrer SydoFlow :"
echo "   npm run dev"
echo ""
echo "💡 L'assistant IA utilisera maintenant le LLM pour enrichir ses réponses !"
echo ""
echo "🛑 Pour arrêter Ollama :"
echo "   kill $OLLAMA_PID"
echo ""
echo "📖 Pour plus d'informations, consultez OLLAMA_SETUP.md"
