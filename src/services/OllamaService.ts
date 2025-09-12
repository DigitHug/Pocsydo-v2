// Service Ollama utilisant fetch pour éviter les problèmes CORS

export interface OllamaResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface OllamaConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

class OllamaService {
  private config: OllamaConfig;
  private isAvailable: boolean = false;

  constructor() {
    this.config = {
      model: 'llama3.2:3b', // Modèle léger et rapide
      temperature: 0.7,
      maxTokens: 1000
    };
  }

  async checkAvailability(): Promise<boolean> {
    try {
      // Test simple avec fetch pour éviter les problèmes CORS
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isAvailable = true;
        console.log('✅ Ollama est disponible via fetch');
        console.log(`📦 Modèles disponibles: ${data.models?.map(m => m.name).join(', ') || 'Aucun'}`);
        return true;
      } else {
        this.isAvailable = false;
        console.log('❌ Ollama n\'est pas disponible (status:', response.status, ')');
        return false;
      }
    } catch (error) {
      this.isAvailable = false;
      console.log('❌ Ollama n\'est pas disponible:', error);
      return false;
    }
  }

  async generateResponse(
    userMessage: string, 
    context: string = '', 
    projectData?: any
  ): Promise<OllamaResponse> {
    if (!this.isAvailable) {
      return {
        success: false,
        message: 'Ollama n\'est pas disponible. Veuillez installer et démarrer Ollama.',
        error: 'OLLAMA_NOT_AVAILABLE'
      };
    }

    try {
      // Construire le prompt contextuel
      const systemPrompt = this.buildSystemPrompt(context, projectData);
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt: `${systemPrompt}\n\nUtilisateur: ${userMessage}\n\nAssistant:`,
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: data.response || 'Réponse générée avec succès'
      };

    } catch (error) {
      console.error('Erreur Ollama:', error);
      return {
        success: false,
        message: 'Erreur lors de la génération de la réponse',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  private buildSystemPrompt(context: string, projectData?: any): string {
    let prompt = `Tu es un assistant IA spécialisé dans la gestion de projets et d'équipes. 
Tu es intégré dans un dashboard de gestion de projets appelé "SydoFlow".

RÔLE:
- Assistant intelligent pour la gestion de projets
- Expert en analyse de données de projets et d'équipes
- Conseiller en organisation et planification

CONTEXTE:
${context}

DONNÉES DISPONIBLES:
${projectData ? JSON.stringify(projectData, null, 2) : 'Aucune donnée spécifique'}

RÈGLES:
1. Réponds toujours en français
2. Sois concis mais informatif
3. Utilise des emojis appropriés
4. Propose des actions concrètes
5. Base tes réponses sur les données fournies
6. Si tu n'as pas assez d'informations, demande des précisions
7. Reste professionnel mais accessible

FORMAT DE RÉPONSE:
- Utilise des listes à puces pour les points importants
- Mets en évidence les éléments critiques avec des emojis
- Propose des actions spécifiques quand c'est pertinent

Exemples de réponses:
- "📊 Voici l'analyse de vos projets..."
- "⚠️ Attention: 3 projets sont en retard"
- "💡 Je recommande de..."

Réponds maintenant à la question de l'utilisateur en gardant ces consignes à l'esprit.`;

    return prompt;
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.models?.map((model: any) => model.name) || [];
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
      return [];
    }
  }

  async pullModel(modelName: string): Promise<boolean> {
    try {
      console.log(`Téléchargement du modèle ${modelName}...`);
      
      const response = await fetch('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName
        })
      });
      
      if (response.ok) {
        console.log(`✅ Modèle ${modelName} téléchargé avec succès`);
        return true;
      } else {
        console.error(`❌ Erreur lors du téléchargement du modèle ${modelName}:`, response.status);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erreur lors du téléchargement du modèle ${modelName}:`, error);
      return false;
    }
  }

  setModel(modelName: string): void {
    this.config.model = modelName;
  }

  setTemperature(temperature: number): void {
    this.config.temperature = Math.max(0, Math.min(2, temperature));
  }

  getConfig(): OllamaConfig {
    return { ...this.config };
  }

  isOllamaAvailable(): boolean {
    return this.isAvailable;
  }
}

export const ollamaService = new OllamaService();

