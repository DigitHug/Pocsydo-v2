// Configuration Ollama pour SydoFlow
export const ollamaConfig = {
  // URL de base d'Ollama
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  
  // Modèle par défaut (utilise le modèle installé)
  defaultModel: process.env.OLLAMA_MODEL || 'llama3.2:3b',
  
  // Modèles disponibles
  models: {
    'llama3.2:3b': {
      name: 'llama3.2:3b',
      size: '2GB',
      ram: '4GB',
      description: 'Modèle léger et rapide, parfait pour le développement',
      installed: true
    },
    'llama3.2:8b': {
      name: 'llama3.2:8b',
      size: '4.7GB',
      ram: '8GB',
      description: 'Modèle plus puissant, idéal pour la production',
      installed: false
    },
    'mistral:7b': {
      name: 'mistral:7b',
      size: '4.1GB',
      ram: '8GB',
      description: 'Modèle spécialisé en français',
      installed: false
    }
  },
  
  // Configuration des requêtes
  requestConfig: {
    timeout: 30000, // 30 secondes
    maxRetries: 3,
    temperature: 0.7,
    maxTokens: 1000
  },
  
  // Configuration automatique
  autoEnable: true, // Activer automatiquement le LLM si disponible
  fallbackToDataOnly: true // Utiliser les données CSV si LLM indisponible
};

// Fonction pour obtenir la configuration complète
export const getOllamaConfig = () => {
  return {
    ...ollamaConfig,
    // Ajouter des configurations dynamiques si nécessaire
    isConfigured: !!ollamaConfig.baseUrl && !!ollamaConfig.defaultModel,
    isAutoEnabled: ollamaConfig.autoEnable
  };
};