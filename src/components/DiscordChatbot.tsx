import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Settings, Paperclip, Smile, Gift, Sticker, Hash, AtSign, X, Brain, AlertTriangle, Upload, FileText, Cpu } from 'lucide-react';
import { hybridChatbotService, HybridResponse } from '@/services/HybridChatbotService';
import { csvUploadService, CSVUploadResult } from '@/services/CSVUploadService';
import { friendlyChatbotService } from '@/services/FriendlyChatbotService';

interface Message {
  id: number;
  type: string;
  content: string;
  timestamp: string;
  isBot?: boolean;
  botName?: string;
  botAvatar?: string;
  author?: string;
  avatar?: string;
  isCurrentUser?: boolean;
  responseType?: string;
  suggestions?: string[];
  isLLMGenerated?: boolean;
}

const DiscordChatbot = ({ onClose }: { onClose?: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'system',
      content: '🤖 Assistant IA connecté - Je peux analyser vos projets et proposer des suggestions !',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isBot: true,
      botName: 'Assistant IA',
      botAvatar: '🧠'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(3);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [csvType, setCsvType] = useState<'projets' | 'equipe'>('projets');
  const [llmStatus, setLlmStatus] = useState<{ available: boolean; enabled: boolean }>({ available: false, enabled: false });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialiser l'intelligence du chatbot et charger les données
  useEffect(() => {
    const initialiser = async () => {
      try {
        // Initialiser le service hybride
        await hybridChatbotService.initialize();
        const status = await hybridChatbotService.checkLLMStatus();
        setLlmStatus(status);
        
        // Charger les données CSV avec le service convivial
        console.log('🔄 Chargement des données CSV...');
        const dataResult = await friendlyChatbotService.loadData();
        
        if (dataResult.success) {
          // Ajouter un message de confirmation avec les données chargées
          const llmStatusText = status.available && status.enabled 
            ? `🤖 **LLM activé** (${status.available ? 'Ollama disponible' : 'Non disponible'})\n` 
            : `⚠️ **LLM non disponible** (mode données uniquement)\n`;
          
          const dataMessage = {
            id: messages.length + 1,
            type: 'system',
            content: `📊 **Assistant IA initialisé !**\n\n` +
                    `• ${dataResult.projets} projet(s) analysé(s)\n` +
                    `• ${dataResult.equipe} membre(s) d'équipe\n` +
                    llmStatusText +
                    `\n💡 Je peux maintenant répondre intelligemment à vos questions !\n` +
                    `Tapez "aide" pour voir les commandes disponibles.`,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            isBot: true,
            botName: 'Assistant IA',
            botAvatar: status.available && status.enabled ? '🤖' : '📊'
          };
          setMessages(prev => [...prev, dataMessage]);
        } else {
          console.error('❌ Erreur lors du chargement des données:', dataResult.error);
        }
        
        setIsInitialized(true);
        console.log('✅ Assistant IA initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
      }
    };
    initialiser();
  }, []);

  // Générer une réponse hybride (LLM + analyse de données)
  const generateHybridResponse = async (userMessage: string): Promise<HybridResponse> => {
    if (!isInitialized) {
      return {
        message: '🔄 Initialisation en cours... Veuillez patienter quelques secondes.',
        type: 'info',
        isLLMGenerated: false
      };
    }

    // Détecter les commandes CSV
    if (userMessage.toLowerCase().includes('csv') || userMessage.toLowerCase().includes('charger')) {
      return {
        message: '📁 **Chargement de données CSV**\n\n' +
                'Vous pouvez charger vos données de deux façons :\n\n' +
                '1️⃣ **Remplacer les fichiers** dans `public/data/`\n' +
                '2️⃣ **Coller directement** vos données CSV ici\n\n' +
                'Tapez "template projets" ou "template équipe" pour voir le format attendu.',
        suggestions: ['template projets', 'template équipe', 'charger csv'],
        type: 'info',
        isLLMGenerated: false
      };
    }

    // Commande d'aide
    if (userMessage.toLowerCase().includes('aide') || userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('commandes')) {
      return {
        message: '🤖 **Commandes disponibles :**\n\n' +
                '📊 **Analyse des données :**\n' +
                '• "projets" - État des projets\n' +
                '• "équipe" - État de l\'équipe\n' +
                '• "deadlines" - Échéances critiques\n' +
                '• "statuts" - Répartition par statut\n' +
                '• "résumé" - Vue d\'ensemble\n\n' +
                '🔍 **Recherche :**\n' +
                '• [Nom de projet] - Détails d\'un projet\n' +
                '• [Nom de membre] - Infos sur un membre\n\n' +
                '⚙️ **Commandes système :**\n' +
                '• "actualiser" - Recharger les données\n' +
                '• "llm" - Statut de l\'IA\n' +
                '• "aide" - Cette aide\n\n' +
                '💡 Je peux analyser vos données et proposer des suggestions !',
        suggestions: ['projets', 'équipe', 'deadlines', 'résumé'],
        type: 'info',
        isLLMGenerated: false
      };
    }

    if (userMessage.toLowerCase().includes('template')) {
      const type = userMessage.toLowerCase().includes('équipe') || userMessage.toLowerCase().includes('equipe') ? 'equipe' : 'projets';
      
      if (userMessage.toLowerCase().includes('excel') || userMessage.toLowerCase().includes('xlsx') || userMessage.toLowerCase().includes('xls')) {
        const template = csvUploadService.generateExcelTemplate(type);
        return {
          message: template,
          type: 'info',
          isLLMGenerated: false
        };
      } else {
        const template = csvUploadService.generateCSVTemplate(type);
        return {
          message: `📋 **Template CSV ${type === 'projets' ? 'Projets' : 'Équipe'} :**\n\n\`\`\`csv\n${template}\n\`\`\`\n\nCopiez ce template, remplacez les données d'exemple par vos vraies données, puis collez le tout dans le chat.`,
          type: 'info',
          isLLMGenerated: false
        };
      }
    }

    // Commandes spéciales pour le LLM
    if (userMessage.toLowerCase().includes('llm') || userMessage.toLowerCase().includes('ia')) {
      const status = await hybridChatbotService.checkLLMStatus();
      setLlmStatus(status);
      
      return {
        message: `🧠 **Statut du LLM :**\n\n` +
                `• Disponible: ${status.available ? '✅ Oui' : '❌ Non'}\n` +
                `• Activé: ${status.enabled ? '✅ Oui' : '❌ Non'}\n\n` +
                `${status.available ? 
                  'Le LLM est prêt à enrichir vos réponses avec de l\'intelligence artificielle !' : 
                  'Pour activer le LLM, installez et démarrez Ollama sur votre machine.'}`,
        type: 'info',
        isLLMGenerated: false
      };
    }

    // Commande pour actualiser les données
    if (userMessage.toLowerCase().includes('actualiser') || userMessage.toLowerCase().includes('refresh') || userMessage.toLowerCase().includes('recharger')) {
      try {
        const dataResult = await friendlyChatbotService.loadData();
        return {
          message: `🔄 **Données actualisées !** 😊\n\n` +
                  `• ${dataResult.projets} projet(s) chargé(s)\n` +
                  `• ${dataResult.equipe} membre(s) d'équipe\n\n` +
                  `✅ Les données sont maintenant à jour !`,
          type: 'info',
          isLLMGenerated: false
        };
      } catch (error) {
        return {
          message: `❌ Erreur lors de l'actualisation des données: ${error}`,
          type: 'alerte',
          isLLMGenerated: false
        };
      }
    }

    try {
      // D'abord essayer le service convivial avec les données CSV
      const reponseConviviale = await friendlyChatbotService.processMessage(userMessage);
      
      if (reponseConviviale) {
        // Si le LLM est disponible, enrichir la réponse
        if (llmStatus.available && llmStatus.enabled) {
          try {
            const reponseLLM = await hybridChatbotService.processMessage(userMessage);
            if (reponseLLM && reponseLLM.isLLMGenerated) {
              return {
                message: `${reponseConviviale.message}\n\n🤖 **Enrichissement IA :**\n${reponseLLM.message}`,
                suggestions: reponseConviviale.suggestions,
                type: reponseConviviale.type === 'alerte' ? 'alerte' : 'info',
                isLLMGenerated: true
              };
            }
          } catch (llmError) {
            console.log('LLM non disponible, utilisation de la réponse conviviale uniquement');
          }
        }
        
        return {
          message: reponseConviviale.message,
          suggestions: reponseConviviale.suggestions,
          type: reponseConviviale.type === 'alerte' ? 'alerte' : 'info',
          isLLMGenerated: false
        };
      }
      
      // Fallback vers le service hybride si pas de réponse conviviale
      return await hybridChatbotService.processMessage(userMessage);
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse:', error);
      return {
        message: '❌ Désolé, une erreur est survenue. Veuillez réessayer.',
        type: 'info',
        isLLMGenerated: false
      };
    }
  };

  // Traiter un CSV collé
  const processCSVData = (csvText: string, type: 'projets' | 'equipe') => {
    const result = csvUploadService.parseCSVFromText(csvText, type);
    
    if (result.success) {
      // Ici vous pourriez sauvegarder les données ou les envoyer au service
      console.log('CSV chargé avec succès:', result.data);
      return {
        message: `✅ ${result.message}\n\nLes données ont été chargées et sont maintenant disponibles pour l'analyse.`,
        type: 'info' as const
      };
    } else {
      return {
        message: `❌ ${result.message}`,
        type: 'info' as const
      };
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        author: 'Vous',
        avatar: '👤',
        isCurrentUser: true
      };

      setMessages(prev => [...prev, newMessage]);
      const messageToProcess = inputMessage;
      setInputMessage('');
      
      // Indicateur de frappe
      setIsTyping(true);

      try {
        // Générer une réponse hybride
        const response = await generateHybridResponse(messageToProcess);
        
        setIsTyping(false);
        
        const botResponse = {
          id: messages.length + 2,
          type: 'system',
          content: response.message,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
          botName: response.isLLMGenerated ? 'Assistant IA (LLM)' : 'Assistant IA',
          botAvatar: response.type === 'alerte' ? '⚠️' : (response.isLLMGenerated ? '🤖' : '🧠'),
          responseType: response.type,
          suggestions: response.suggestions,
          isLLMGenerated: response.isLLMGenerated
        };
        
        setMessages(prev => [...prev, botResponse]);

        // Ajouter des suggestions si disponibles
        if (response.suggestions && response.suggestions.length > 0) {
          setTimeout(() => {
            const suggestionsMessage = {
              id: messages.length + 3,
              type: 'system',
              content: `💡 **Suggestions d'actions :**\n${response.suggestions.map(s => `• ${s}`).join('\n')}`,
              timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              isBot: true,
              botName: 'Assistant IA',
              botAvatar: '💡'
            };
            setMessages(prev => [...prev, suggestionsMessage]);
          }, 1000);
        }
      } catch (error) {
        setIsTyping(false);
        const errorResponse = {
          id: messages.length + 2,
          type: 'system',
          content: '❌ Désolé, une erreur est survenue. Veuillez réessayer.',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
          botName: 'Assistant IA',
          botAvatar: '❌'
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-gray-800 relative rounded-lg overflow-hidden border border-gray-700">
      {/* Bouton de fermeture - seulement si onClose est fourni */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 flex flex-col">
        <div className="px-3 py-3 border-b border-gray-800">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Hash className="w-4 h-4" />
            TeamChat & Assit
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-gray-400">
              {isInitialized ? 'IA Connectée' : 'Connexion...'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Cpu className={`w-3 h-3 ${llmStatus.available ? 'text-green-400' : 'text-gray-500'}`} />
            <span className="text-xs text-gray-400">
              LLM: {llmStatus.available ? (llmStatus.enabled ? 'Actif' : 'Disponible') : 'Non disponible'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-3">
            <div className="text-gray-400 text-xs font-semibold uppercase px-2 mb-2">Channels</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer bg-gray-800">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">général</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">design</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">développement</span>
              </div>
            </div>
          </div>
          
          <div className="px-2 py-3">
            <div className="text-gray-400 text-xs font-semibold uppercase px-2 mb-2">Messages Directs</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer">
                <div className="relative">
                  <span className="text-base">👩</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                </div>
                <span className="text-gray-300 text-sm">Sarah Martin</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer">
                <div className="relative">
                  <span className="text-base">👨</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                </div>
                <span className="text-gray-300 text-sm">Tom Chen</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer">
                <div className="relative">
                  <span className="text-base">🤖</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                </div>
                <span className="text-gray-300 text-sm">ProjectBot</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-750 px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-gray-400" />
            <span className="text-white font-semibold">TeamChat & Assit</span>
            <span className="bg-green-500 text-xs text-white px-1.5 py-0.5 rounded-full ml-2">
              {onlineUsers} en ligne
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Video className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                  {message.avatar || message.botAvatar}
                </div>
              </div>
              <div className={`flex-1 ${message.isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`font-semibold text-sm ${message.isBot ? 'text-blue-400' : 'text-gray-300'}`}>
                    {message.botName || message.author}
                  </span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <div className={`${message.isCurrentUser ? 'bg-blue-600' : message.type === 'system' ? 'bg-gray-700' : 'bg-gray-700'} 
                  rounded-lg px-3 py-2 ${message.isCurrentUser ? 'max-w-md' : 'max-w-2xl'}`}>
                  <p className="text-gray-100 text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="bg-gray-700 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4">
          <div className="bg-gray-700 rounded-lg flex items-center gap-3 px-3 py-2">
            <Paperclip className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Envoyer un message à #TeamChat & Assit"
              className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCSVUpload(!showCSVUpload)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                title="Charger des données CSV"
              >
                <Upload className="w-5 h-5" />
              </button>
              <Gift className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Sticker className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Smile className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded p-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordChatbot;