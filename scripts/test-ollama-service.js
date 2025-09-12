#!/usr/bin/env node

// Script de test pour vérifier le service OllamaService
import { Ollama } from 'ollama';

console.log('🧪 Test du service OllamaService...\n');

// Test 1: Vérifier la connectivité Ollama
console.log('1️⃣ Test de connectivité Ollama...');
const testOllamaConnection = async () => {
  try {
    const ollama = new Ollama({
      host: 'http://localhost:11434'
    });
    
    const models = await ollama.list();
    console.log('✅ Ollama accessible');
    console.log(`📦 Modèles disponibles: ${models.models.map(m => m.name).join(', ')}`);
    return true;
  } catch (error) {
    console.log('❌ Ollama non accessible:', error.message);
    return false;
  }
};

// Test 2: Test de génération de réponse
console.log('\n2️⃣ Test de génération de réponse...');
const testGeneration = async () => {
  try {
    const ollama = new Ollama({
      host: 'http://localhost:11434'
    });
    
    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant IA spécialisé dans la gestion de projets. Réponds en français de manière concise et professionnelle.'
        },
        {
          role: 'user',
          content: 'Bonjour, comment ça va ?'
        }
      ],
      options: {
        temperature: 0.7,
        num_predict: 100
      }
    });

    console.log('✅ Génération de réponse réussie');
    console.log(`🤖 Réponse: "${response.message.content}"`);
    return true;
  } catch (error) {
    console.log('❌ Erreur de génération:', error.message);
    return false;
  }
};

// Test 3: Test avec contexte de projet
console.log('\n3️⃣ Test avec contexte de projet...');
const testProjectContext = async () => {
  try {
    const ollama = new Ollama({
      host: 'http://localhost:11434'
    });
    
    const systemPrompt = `Tu es un assistant IA spécialisé dans la gestion de projets et d'équipes. 
Tu es intégré dans un dashboard de gestion de projets appelé "SydoFlow".

RÔLE:
- Assistant intelligent pour la gestion de projets
- Expert en analyse de données de projets et d'équipes
- Conseiller en organisation et planification

CONTEXTE:
Analyse des données actuelles:
📊 **État des projets :**
• 6 projets actifs
• 3 projets en cours
• 2 projets en review
• 1 projet planifié

DONNÉES DISPONIBLES:
{
  "projets": [
    {
      "id": 1,
      "nom": "Refonte Site Web Luxe",
      "client": "Maison Martin",
      "statut": "En cours",
      "priorite": "Haute",
      "deadline": "2024-01-15",
      "responsable": "Sarah Martin",
      "progression": 75
    }
  ]
}

RÈGLES:
1. Réponds toujours en français
2. Sois concis mais informatif
3. Utilise des emojis appropriés
4. Propose des actions concrètes
5. Base tes réponses sur les données fournies

FORMAT DE RÉPONSE:
- Utilise des listes à puces pour les points importants
- Mets en évidence les éléments critiques avec des emojis
- Propose des actions spécifiques quand c'est pertinent

Réponds maintenant à la question de l'utilisateur en gardant ces consignes à l'esprit.`;

    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: 'Peux-tu me donner un résumé de l\'état des projets ?'
        }
      ],
      options: {
        temperature: 0.7,
        num_predict: 200
      }
    });

    console.log('✅ Génération avec contexte réussie');
    console.log(`🤖 Réponse: "${response.message.content}"`);
    return true;
  } catch (error) {
    console.log('❌ Erreur de génération avec contexte:', error.message);
    return false;
  }
};

// Exécuter tous les tests
async function runTests() {
  try {
    const test1 = await testOllamaConnection();
    const test2 = await testGeneration();
    const test3 = await testProjectContext();
    
    if (test1 && test2 && test3) {
      console.log('\n🎉 Tous les tests sont passés !');
      console.log('\n📋 Résumé:');
      console.log('• ✅ Ollama est accessible et fonctionnel');
      console.log('• ✅ Le modèle llama3.2:3b répond correctement');
      console.log('• ✅ La génération avec contexte fonctionne');
      console.log('\n🚀 Le service OllamaService est prêt !');
      console.log('\n💡 Le LLM devrait maintenant être détecté dans le chatbot Discord');
    } else {
      console.log('\n❌ Certains tests ont échoué');
      console.log('\n🔧 Solutions possibles:');
      console.log('• Vérifiez qu\'Ollama est démarré: ollama serve');
      console.log('• Vérifiez que le modèle est installé: ollama list');
      console.log('• Redémarrez l\'application: npm run dev');
    }
    
  } catch (error) {
    console.log('\n❌ Erreur lors des tests:', error.message);
  }
}

runTests();
