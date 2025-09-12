#!/usr/bin/env node

// Script de test pour vérifier l'intégration LLM
import http from 'http';

console.log('🧪 Test de l\'intégration LLM...\n');

// Test 1: Vérifier qu'Ollama est accessible
console.log('1️⃣ Test de connectivité Ollama...');
const testOllama = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:11434/api/tags', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const models = JSON.parse(data);
          console.log('✅ Ollama accessible');
          console.log(`📦 Modèles disponibles: ${models.models.map(m => m.name).join(', ')}`);
          resolve(models);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Ollama non accessible:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Timeout - Ollama non accessible');
      reject(new Error('Timeout'));
    });
  });
};

// Test 2: Test de génération de réponse
console.log('\n2️⃣ Test de génération de réponse...');
const testGeneration = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'llama3.2:3b',
      prompt: 'Bonjour, comment ça va ?',
      stream: false
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Génération de réponse réussie');
          console.log(`🤖 Réponse: "${response.response}"`);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Erreur de génération:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.log('❌ Timeout - Génération trop lente');
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
};

// Test 3: Test de l'application SydoFlow
console.log('\n3️⃣ Test de l\'application SydoFlow...');
const testApp = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:8080', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Application SydoFlow accessible');
        resolve(true);
      } else {
        console.log(`❌ Application non accessible (status: ${res.statusCode})`);
        reject(new Error(`Status: ${res.statusCode}`));
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Application non accessible:', error.message);
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Timeout - Application non accessible');
      reject(new Error('Timeout'));
    });
  });
};

// Exécuter tous les tests
async function runTests() {
  try {
    await testOllama();
    await testGeneration();
    await testApp();
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📋 Résumé:');
    console.log('• ✅ Ollama est accessible et fonctionnel');
    console.log('• ✅ Le modèle llama3.2:3b répond correctement');
    console.log('• ✅ L\'application SydoFlow est accessible');
    console.log('\n🚀 Votre assistant IA avec LLM est prêt !');
    console.log('\n💡 Testez maintenant dans le chat Discord :');
    console.log('   - "bonjour"');
    console.log('   - "projets"');
    console.log('   - "équipe"');
    console.log('   - "aide"');
    
  } catch (error) {
    console.log('\n❌ Certains tests ont échoué');
    console.log('\n🔧 Solutions possibles:');
    console.log('• Vérifiez qu\'Ollama est démarré: ollama serve');
    console.log('• Vérifiez que le modèle est installé: ollama list');
    console.log('• Vérifiez que l\'app est démarrée: npm run dev');
    console.log('\n📖 Consultez OLLAMA_SETUP.md pour plus d\'aide');
  }
}

runTests();
