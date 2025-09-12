import { chatbotIntelligence, ReponseIntelligente } from './ChatbotIntelligence';
import { ollamaService, OllamaResponse } from './OllamaService';
import { dataService } from './DataService';

export interface HybridResponse {
  message: string;
  type: 'info' | 'alerte' | 'suggestion' | 'analyse';
  suggestions?: string[];
  isLLMGenerated: boolean;
  data?: any;
}

class HybridChatbotService {
  private useLLM: boolean = false;
  private llmAvailable: boolean = false;

  async initialize(): Promise<void> {
    // Vérifier si Ollama est disponible
    this.llmAvailable = await ollamaService.checkAvailability();
    this.useLLM = this.llmAvailable;
    
    console.log(`🧠 LLM disponible: ${this.llmAvailable ? 'Oui' : 'Non'}`);
    
    if (this.llmAvailable) {
      console.log('✅ LLM activé automatiquement !');
    } else {
      console.log('⚠️ LLM non disponible, utilisation du mode données uniquement');
    }
  }

  async processMessage(userMessage: string): Promise<HybridResponse> {
    // D'abord, analyser avec l'intelligence de données
    const dataAnalysis = await chatbotIntelligence.traiterMessage(userMessage);
    
    // Si le LLM est disponible, l'utiliser pour enrichir la réponse
    if (this.useLLM && this.llmAvailable) {
      try {
        const context = this.buildContext(dataAnalysis);
        const projectData = this.getRelevantData(userMessage);
        
        const llmResponse = await ollamaService.generateResponse(
          userMessage, 
          context, 
          projectData
        );

        if (llmResponse.success) {
          return {
            message: llmResponse.message,
            type: dataAnalysis.type,
            suggestions: dataAnalysis.suggestions,
            isLLMGenerated: true,
            data: dataAnalysis.donnees
          };
        }
      } catch (error) {
        console.error('Erreur LLM, utilisation de l\'analyse de données:', error);
      }
    }

    // Fallback vers l'analyse de données
    return {
      message: dataAnalysis.message,
      type: dataAnalysis.type,
      suggestions: dataAnalysis.suggestions,
      isLLMGenerated: false,
      data: dataAnalysis.donnees
    };
  }

  private buildContext(dataAnalysis: ReponseIntelligente): string {
    let context = `Analyse des données actuelles:\n${dataAnalysis.message}\n\n`;
    
    if (dataAnalysis.suggestions && dataAnalysis.suggestions.length > 0) {
      context += `Suggestions identifiées:\n${dataAnalysis.suggestions.join('\n')}\n\n`;
    }

    if (dataAnalysis.donnees) {
      context += `Données pertinentes disponibles pour l'analyse.\n`;
    }

    return context;
  }

  private getRelevantData(userMessage: string): any {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('projet') || messageLower.includes('dossier')) {
      return {
        projets: dataService.getProjets(),
        projetsUrgents: dataService.getProjetsUrgents()
      };
    }
    
    if (messageLower.includes('équipe') || messageLower.includes('membre')) {
      return {
        equipe: dataService.getEquipe()
      };
    }

    return {
      projets: dataService.getProjets(),
      equipe: dataService.getEquipe()
    };
  }

  // Méthodes de configuration
  toggleLLM(): boolean {
    if (this.llmAvailable) {
      this.useLLM = !this.useLLM;
      console.log(`🧠 LLM ${this.useLLM ? 'activé' : 'désactivé'}`);
    }
    return this.useLLM;
  }

  isLLMEnabled(): boolean {
    return this.useLLM && this.llmAvailable;
  }

  isLLMAvailable(): boolean {
    return this.llmAvailable;
  }

  async checkLLMStatus(): Promise<{ available: boolean; enabled: boolean }> {
    this.llmAvailable = await ollamaService.checkAvailability();
    return {
      available: this.llmAvailable,
      enabled: this.useLLM
    };
  }

  // Méthodes pour gérer les modèles Ollama
  async getAvailableModels(): Promise<string[]> {
    if (this.llmAvailable) {
      return await ollamaService.getAvailableModels();
    }
    return [];
  }

  async pullModel(modelName: string): Promise<boolean> {
    if (this.llmAvailable) {
      return await ollamaService.pullModel(modelName);
    }
    return false;
  }

  setModel(modelName: string): void {
    if (this.llmAvailable) {
      ollamaService.setModel(modelName);
    }
  }
}

export const hybridChatbotService = new HybridChatbotService();

