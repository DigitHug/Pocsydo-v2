#!/usr/bin/env node

// Script de test pour vérifier la connectivité Ollama avec fetch
console.log('🧪 Test de connectivité Ollama avec fetch...\n');

// Test 1: Vérifier la connectivité
console.log('1️⃣ Test de connectivité...');
const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Ollama accessible via fetch');
      console.log(`📦 Modèles disponibles: ${data.models?.map(m => m.name).join(', ') || 'Aucun'}`);
      return true;
    } else {
      console.log('❌ Ollama non accessible (status:', response.status, ')');
      return false;
    }
  } catch (error) {
    console.log('❌ Ollama non accessible:', error.message);
    return false;
  }
};

// Test 2: Test de génération de réponse
console.log('\n2️⃣ Test de génération de réponse...');
const testGeneration = async () => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: 'Tu es un assistant IA spécialisé dans la gestion de projets. Réponds en français de manière concise et professionnelle.\n\nUtilisateur: Bonjour, comment ça va ?\n\nAssistant:',
        options: {
          temperature: 0.7,
          num_predict: 100
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Génération de réponse réussie');
      console.log(`🤖 Réponse: "${data.response || 'Pas de contenu'}"`);
      return true;
    } else {
      console.log('❌ Erreur de génération (status:', response.status, ')');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur de génération:', error.message);
    return false;
  }
};

// Exécuter les tests
async function runTests() {
  try {
    const test1 = await testConnection();
    const test2 = await testGeneration();
    
    if (test1 && test2) {
      console.log('\n🎉 Tous les tests sont passés !');
      console.log('\n📋 Résumé:');
      console.log('• ✅ Ollama est accessible via fetch');
      console.log('• ✅ La génération de réponse fonctionne');
      console.log('\n🚀 Le service OllamaService devrait maintenant fonctionner dans l\'application !');
      console.log('\n💡 Vérifiez maintenant dans le chatbot Discord - le LLM devrait être détecté !');
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
