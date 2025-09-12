// Service d'intelligence simplifié pour l'assistant IA
export interface SimpleResponse {
  message: string;
  suggestions?: string[];
  type: 'info' | 'alerte' | 'suggestion' | 'analyse';
}

class SimpleChatbotIntelligence {
  private projets: any[] = [];
  private equipe: any[] = [];
  private isLoaded = false;

  async loadData() {
    try {
      console.log('🔄 Chargement des données CSV...');
      
      // Charger les projets
      const projetsResponse = await fetch('/data/projets.csv');
      const projetsText = await projetsResponse.text();
      this.projets = this.parseCSV(projetsText, this.parseProjet);
      
      // Charger l'équipe
      const equipeResponse = await fetch('/data/equipe.csv');
      const equipeText = await equipeResponse.text();
      this.equipe = this.parseCSV(equipeText, this.parseMembreEquipe);
      
      this.isLoaded = true;
      console.log('✅ Données chargées:', { projets: this.projets.length, equipe: this.equipe.length });
      
      return {
        success: true,
        projets: this.projets.length,
        equipe: this.equipe.length
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      return { success: false, error: error.message };
    }
  }

  private parseCSV(csvText: string, parser: (row: string[]) => any): any[] {
    const lines = csvText.trim().split('\n');
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length > 1) {
        data.push(parser(values));
      }
    }

    return data;
  }

  private parseProjet(row: string[]): any {
    return {
      id: row[0],
      nom: row[1],
      client: row[2],
      statut: row[3],
      priorite: row[4],
      deadline: row[5],
      responsable: row[6],
      progression: parseInt(row[7]) || 0,
      description: row[8]
    };
  }

  private parseMembreEquipe(row: string[]): any {
    return {
      nom: row[0],
      role: row[1],
      disponibilite: row[2],
      specialite: row[3],
      projets_actifs: parseInt(row[4]) || 0
    };
  }

  async processMessage(message: string): Promise<SimpleResponse> {
    if (!this.isLoaded) {
      return {
        message: '🔄 Chargement des données en cours... Veuillez patienter.',
        type: 'info'
      };
    }

    const messageLower = message.toLowerCase();

    // Commandes de base
    if (messageLower.includes('projets') || messageLower.includes('projet')) {
      return this.analyzeProjets();
    }

    if (messageLower.includes('équipe') || messageLower.includes('equipe') || messageLower.includes('membre')) {
      return this.analyzeEquipe();
    }

    if (messageLower.includes('deadline') || messageLower.includes('échéance') || messageLower.includes('urgent')) {
      return this.analyzeDeadlines();
    }

    if (messageLower.includes('statut') || messageLower.includes('avancement')) {
      return this.analyzeStatuts();
    }

    if (messageLower.includes('résumé') || messageLower.includes('resume') || messageLower.includes('synthèse')) {
      return this.generateResume();
    }

    if (messageLower.includes('aide') || messageLower.includes('help')) {
      return this.showHelp();
    }

    // Recherche par nom
    const projetTrouve = this.projets.find(p => 
      p.nom.toLowerCase().includes(messageLower) || 
      p.client.toLowerCase().includes(messageLower)
    );

    if (projetTrouve) {
      return this.showProjetDetails(projetTrouve);
    }

    const membreTrouve = this.equipe.find(m => 
      m.nom.toLowerCase().includes(messageLower)
    );

    if (membreTrouve) {
      return this.showMembreDetails(membreTrouve);
    }

    // Réponse générique
    return {
      message: `🤖 Je peux vous aider à analyser vos données ! Voici ce que je peux faire :\n\n` +
              `• Analyser vos ${this.projets.length} projets\n` +
              `• Examiner votre équipe de ${this.equipe.length} membres\n` +
              `• Identifier les échéances critiques\n` +
              `• Proposer des suggestions\n\n` +
              `Tapez "aide" pour voir toutes les commandes disponibles.`,
      suggestions: ['projets', 'équipe', 'deadlines', 'résumé', 'aide'],
      type: 'info'
    };
  }

  private analyzeProjets(): SimpleResponse {
    const enCours = this.projets.filter(p => p.statut === 'En cours');
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `📊 **Analyse des projets :**\n\n`;
    message += `• ${this.projets.length} projet(s) au total\n`;
    message += `• ${enCours.length} projet(s) en cours\n`;
    message += `• ${urgents.length} projet(s) urgent(s)\n`;
    message += `• ${enRetard.length} projet(s) en retard\n\n`;

    if (urgents.length > 0) {
      message += `🚨 **Projets urgents :**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        message += `• ${projet.nom} (${projet.client}) - ${jours} jour(s)\n`;
      });
      message += `\n`;
    }

    if (enRetard.length > 0) {
      message += `⚠️ **Projets en retard :**\n`;
      enRetard.forEach(projet => {
        const jours = this.calculerJoursRetard(projet.deadline);
        message += `• ${projet.nom} - ${jours} jour(s) de retard\n`;
      });
    }

    return {
      message,
      suggestions: ['équipe', 'deadlines', 'résumé'],
      type: 'analyse'
    };
  }

  private analyzeEquipe(): SimpleResponse {
    const disponibles = this.equipe.filter(m => m.disponibilite === 'Disponible');
    const surcharges = this.equipe.filter(m => m.projets_actifs >= 2);

    let message = `👥 **Analyse de l'équipe :**\n\n`;
    message += `• ${this.equipe.length} membre(s) au total\n`;
    message += `• ${disponibles.length} membre(s) disponible(s)\n`;
    message += `• ${surcharges.length} membre(s) surchargé(s)\n\n`;

    if (surcharges.length > 0) {
      message += `⚠️ **Membres surchargés :**\n`;
      surcharges.forEach(membre => {
        message += `• ${membre.nom} (${membre.role}) - ${membre.projets_actifs} projet(s)\n`;
      });
      message += `\n`;
    }

    message += `📋 **Membres disponibles :**\n`;
    disponibles.forEach(membre => {
      message += `• ${membre.nom} - ${membre.specialite}\n`;
    });

    return {
      message,
      suggestions: ['projets', 'deadlines', 'résumé'],
      type: 'info'
    };
  }

  private analyzeDeadlines(): SimpleResponse {
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `⏰ **Échéances critiques :**\n\n`;

    if (enRetard.length > 0) {
      message += `🚨 **Projets en retard :**\n`;
      enRetard.forEach(projet => {
        const jours = this.calculerJoursRetard(projet.deadline);
        message += `• ${projet.nom} - ${jours} jour(s) de retard\n`;
      });
      message += `\n`;
    }

    if (urgents.length > 0) {
      message += `⚠️ **Projets urgents (≤3 jours) :**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        message += `• ${projet.nom} (${projet.client}) - ${jours} jour(s)\n`;
      });
    }

    if (enRetard.length === 0 && urgents.length === 0) {
      message += `✅ Aucune échéance critique détectée !`;
    }

    return {
      message,
      suggestions: ['projets', 'équipe', 'résumé'],
      type: enRetard.length > 0 ? 'alerte' : 'info'
    };
  }

  private analyzeStatuts(): SimpleResponse {
    const statuts: Record<string, number> = {};
    this.projets.forEach(projet => {
      statuts[projet.statut] = (statuts[projet.statut] || 0) + 1;
    });

    let message = `📈 **Répartition par statut :**\n\n`;
    Object.entries(statuts).forEach(([statut, count]) => {
      message += `• ${statut}: ${count} projet(s)\n`;
    });

    const progressionMoyenne = this.calculerProgressionMoyenne();
    message += `\n📊 **Progression moyenne :** ${progressionMoyenne}%`;

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'info'
    };
  }

  private generateResume(): SimpleResponse {
    const enCours = this.projets.filter(p => p.statut === 'En cours');
    const disponibles = this.equipe.filter(m => m.disponibilite === 'Disponible');
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `📋 **Résumé exécutif :**\n\n`;
    message += `📊 **Projets :** ${this.projets.length} total, ${enCours.length} en cours\n`;
    message += `👥 **Équipe :** ${this.equipe.length} membres, ${disponibles.length} disponibles\n`;
    message += `⚠️ **Alertes :** ${enRetard.length} retard(s), ${urgents.length} urgent(s)\n\n`;

    const suggestions = [];
    if (enRetard.length > 0) {
      suggestions.push(`🚨 ${enRetard.length} projet(s) en retard nécessitent une attention immédiate`);
    }
    if (urgents.length > 0) {
      suggestions.push(`⚠️ ${urgents.length} projet(s) avec échéance dans les 3 jours`);
    }
    if (suggestions.length > 0) {
      message += `🎯 **Actions recommandées :**\n`;
      suggestions.forEach(suggestion => {
        message += `• ${suggestion}\n`;
      });
    }

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'analyse'
    };
  }

  private showHelp(): SimpleResponse {
    return {
      message: `🤖 **Commandes disponibles :**\n\n` +
              `📊 **Analyse :**\n` +
              `• "projets" - État des projets\n` +
              `• "équipe" - État de l'équipe\n` +
              `• "deadlines" - Échéances critiques\n` +
              `• "statuts" - Répartition par statut\n` +
              `• "résumé" - Vue d'ensemble\n\n` +
              `🔍 **Recherche :**\n` +
              `• [Nom de projet] - Détails d'un projet\n` +
              `• [Nom de membre] - Infos sur un membre\n\n` +
              `💡 Je peux analyser vos ${this.projets.length} projets et ${this.equipe.length} membres d'équipe !`,
      suggestions: ['projets', 'équipe', 'deadlines', 'résumé'],
      type: 'info'
    };
  }

  private showProjetDetails(projet: any): SimpleResponse {
    const jours = this.calculerJoursRestants(projet.deadline);
    
    let message = `📁 **${projet.nom}**\n\n`;
    message += `👤 Client: ${projet.client}\n`;
    message += `📊 Statut: ${projet.statut}\n`;
    message += `⚡ Priorité: ${projet.priorite}\n`;
    message += `👨‍💼 Responsable: ${projet.responsable}\n`;
    message += `📈 Progression: ${projet.progression}%\n`;
    message += `📅 Échéance: ${projet.deadline} (${jours} jour(s))\n`;
    message += `📝 Description: ${projet.description}`;

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'info'
    };
  }

  private showMembreDetails(membre: any): SimpleResponse {
    const projets = this.projets.filter(p => p.responsable === membre.nom);
    
    let message = `👤 **${membre.nom}**\n\n`;
    message += `🎯 Rôle: ${membre.role}\n`;
    message += `📊 Disponibilité: ${membre.disponibilite}\n`;
    message += `🛠️ Spécialité: ${membre.specialite}\n`;
    message += `📁 Projets actifs: ${membre.projets_actifs}\n\n`;

    if (projets.length > 0) {
      message += `📋 **Projets en charge :**\n`;
      projets.forEach(projet => {
        message += `• ${projet.nom} (${projet.progression}%)\n`;
      });
    }

    return {
      message,
      suggestions: ['équipe', 'projets', 'deadlines'],
      type: 'info'
    };
  }

  // Méthodes utilitaires
  private getProjetsUrgents(): any[] {
    return this.projets.filter(projet => {
      const jours = this.calculerJoursRestants(projet.deadline);
      return jours <= 3 && projet.statut !== 'Terminé';
    });
  }

  private getProjetsEnRetard(): any[] {
    return this.projets.filter(projet => {
      const jours = this.calculerJoursRestants(projet.deadline);
      return jours < 0 && projet.statut !== 'Terminé';
    });
  }

  private calculerJoursRestants(deadline: string): number {
    const aujourdhui = new Date();
    const dateDeadline = new Date(deadline);
    return Math.ceil((dateDeadline.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculerJoursRetard(deadline: string): number {
    const aujourdhui = new Date();
    const dateDeadline = new Date(deadline);
    return Math.ceil((aujourdhui.getTime() - dateDeadline.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculerProgressionMoyenne(): number {
    if (this.projets.length === 0) return 0;
    const total = this.projets.reduce((sum, projet) => sum + projet.progression, 0);
    return Math.round(total / this.projets.length);
  }
}

export const simpleChatbotIntelligence = new SimpleChatbotIntelligence();
