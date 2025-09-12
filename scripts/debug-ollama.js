#!/usr/bin/env node

// Script de debug pour Ollama
console.log('🔍 Debug Ollama...\n');

const testOllama = async () => {
  try {
    console.log('Test 1: API tags...');
    const response1 = await fetch('http://localhost:11434/api/tags');
    const data1 = await response1.text();
    console.log('Raw response:', data1);
    
    console.log('\nTest 2: API generate...');
    const response2 = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: 'Bonjour',
        stream: false
      })
    });
    
    const data2 = await response2.text();
    console.log('Raw response:', data2);
    
    // Essayer de parser
    try {
      const parsed = JSON.parse(data2);
      console.log('Parsed successfully:', parsed.response);
    } catch (parseError) {
      console.log('Parse error:', parseError.message);
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  }
};

testOllama();
