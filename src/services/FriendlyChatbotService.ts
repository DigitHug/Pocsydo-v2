// Service d'assistant convivial qui fonctionne sans LLM
export interface FriendlyResponse {
  message: string;
  suggestions?: string[];
  type: 'info' | 'alerte' | 'suggestion' | 'analyse' | 'convivial';
}

class FriendlyChatbotService {
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

  async processMessage(message: string): Promise<FriendlyResponse> {
    if (!this.isLoaded) {
      return {
        message: '🔄 Je charge encore vos données... Un petit moment ! 😊',
        type: 'convivial'
      };
    }

    const messageLower = message.toLowerCase();

    // Salutations conviviales
    if (this.contientMots(messageLower, ['bonjour', 'salut', 'hello', 'coucou', 'hey'])) {
      return {
        message: `👋 Salut ! Je suis votre assistant IA pour SydoFlow ! 😊\n\n` +
                `Je peux vous aider à analyser vos ${this.projets.length} projets et votre équipe de ${this.equipe.length} membres.\n\n` +
                `Que souhaitez-vous savoir ?`,
        suggestions: ['projets', 'équipe', 'deadlines', 'aide'],
        type: 'convivial'
      };
    }

    // Commandes de base avec réponses conviviales
    if (this.contientMots(messageLower, ['projets', 'projet'])) {
      return this.analyzeProjetsConvivial();
    }

    if (this.contientMots(messageLower, ['équipe', 'equipe', 'membre', 'collaborateur'])) {
      return this.analyzeEquipeConvivial();
    }

    if (this.contientMots(messageLower, ['deadline', 'échéance', 'urgent', 'retard'])) {
      return this.analyzeDeadlinesConvivial();
    }

    if (this.contientMots(messageLower, ['statut', 'avancement', 'progression'])) {
      return this.analyzeStatutsConvivial();
    }

    if (this.contientMots(messageLower, ['résumé', 'resume', 'synthèse', 'vue', 'ensemble'])) {
      return this.generateResumeConvivial();
    }

    if (this.contientMots(messageLower, ['aide', 'help', 'commandes'])) {
      return this.showHelpConvivial();
    }

    // Recherche par nom avec réponses personnalisées
    const projetTrouve = this.projets.find(p => 
      p.nom.toLowerCase().includes(messageLower) || 
      p.client.toLowerCase().includes(messageLower)
    );

    if (projetTrouve) {
      return this.showProjetDetailsConvivial(projetTrouve);
    }

    const membreTrouve = this.equipe.find(m => 
      m.nom.toLowerCase().includes(messageLower)
    );

    if (membreTrouve) {
      return this.showMembreDetailsConvivial(membreTrouve);
    }

    // Réponse conviviale par défaut
    return {
      message: `🤖 Hmm, je ne suis pas sûr de comprendre votre question ! 😅\n\n` +
              `Mais je peux vous aider avec :\n` +
              `• Vos ${this.projets.length} projets (tapez "projets")\n` +
              `• Votre équipe de ${this.equipe.length} membres (tapez "équipe")\n` +
              `• Les échéances importantes (tapez "deadlines")\n` +
              `• Un résumé complet (tapez "résumé")\n\n` +
              `Ou tapez "aide" pour voir toutes mes capacités ! 😊`,
      suggestions: ['projets', 'équipe', 'deadlines', 'résumé', 'aide'],
      type: 'convivial'
    };
  }

  private contientMots(message: string, mots: string[]): boolean {
    return mots.some(mot => message.includes(mot));
  }

  private analyzeProjetsConvivial(): FriendlyResponse {
    const enCours = this.projets.filter(p => p.statut === 'En cours');
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `📊 **Voici l'état de vos projets !** 😊\n\n`;
    message += `🎯 **Résumé rapide :**\n`;
    message += `• ${this.projets.length} projet(s) au total\n`;
    message += `• ${enCours.length} projet(s) en cours\n`;
    message += `• ${urgents.length} projet(s) urgent(s) ⚡\n`;
    message += `• ${enRetard.length} projet(s) en retard 🚨\n\n`;

    if (urgents.length > 0) {
      message += `🚨 **Attention, projets urgents !**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        message += `• **${projet.nom}** (${projet.client}) - ${jours} jour(s) restant(s)\n`;
      });
      message += `\n`;
    }

    if (enRetard.length > 0) {
      message += `⚠️ **Projets en retard :**\n`;
      enRetard.forEach(projet => {
        const jours = this.calculerJoursRetard(projet.deadline);
        message += `• **${projet.nom}** - ${jours} jour(s) de retard 😰\n`;
      });
    }

    if (urgents.length === 0 && enRetard.length === 0) {
      message += `✅ **Super !** Aucun projet en urgence pour le moment ! 🎉`;
    }

    return {
      message,
      suggestions: ['équipe', 'deadlines', 'résumé'],
      type: 'analyse'
    };
  }

  private analyzeEquipeConvivial(): FriendlyResponse {
    const disponibles = this.equipe.filter(m => m.disponibilite === 'Disponible');
    const surcharges = this.equipe.filter(m => m.projets_actifs >= 2);

    let message = `👥 **Voici votre équipe !** 😊\n\n`;
    message += `📊 **Statut général :**\n`;
    message += `• ${this.equipe.length} membre(s) au total\n`;
    message += `• ${disponibles.length} membre(s) disponible(s) ✅\n`;
    message += `• ${surcharges.length} membre(s) surchargé(s) ⚠️\n\n`;

    if (surcharges.length > 0) {
      message += `⚠️ **Membres surchargés :**\n`;
      surcharges.forEach(membre => {
        message += `• **${membre.nom}** (${membre.role}) - ${membre.projets_actifs} projet(s) 😰\n`;
      });
      message += `\n`;
    }

    message += `✅ **Membres disponibles :**\n`;
    disponibles.forEach(membre => {
      message += `• **${membre.nom}** - ${membre.specialite} 😊\n`;
    });

    return {
      message,
      suggestions: ['projets', 'deadlines', 'résumé'],
      type: 'info'
    };
  }

  private analyzeDeadlinesConvivial(): FriendlyResponse {
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `⏰ **Échéances à surveiller !** 👀\n\n`;

    if (enRetard.length > 0) {
      message += `🚨 **URGENT - Projets en retard :**\n`;
      enRetard.forEach(projet => {
        const jours = this.calculerJoursRetard(projet.deadline);
        message += `• **${projet.nom}** - ${jours} jour(s) de retard 😱\n`;
      });
      message += `\n`;
    }

    if (urgents.length > 0) {
      message += `⚠️ **Projets urgents (≤3 jours) :**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        message += `• **${projet.nom}** (${projet.client}) - ${jours} jour(s) ⏰\n`;
      });
    }

    if (enRetard.length === 0 && urgents.length === 0) {
      message += `🎉 **Parfait !** Aucune échéance critique pour le moment !\n\n` +
                `Vous pouvez respirer tranquillement ! 😌`;
    }

    return {
      message,
      suggestions: ['projets', 'équipe', 'résumé'],
      type: enRetard.length > 0 ? 'alerte' : 'info'
    };
  }

  private analyzeStatutsConvivial(): FriendlyResponse {
    const statuts: Record<string, number> = {};
    this.projets.forEach(projet => {
      statuts[projet.statut] = (statuts[projet.statut] || 0) + 1;
    });

    let message = `📈 **Répartition de vos projets :** 📊\n\n`;
    Object.entries(statuts).forEach(([statut, count]) => {
      const emoji = statut === 'En cours' ? '🔄' : statut === 'Review' ? '👀' : statut === 'Planifié' ? '📅' : '📋';
      message += `${emoji} **${statut}** : ${count} projet(s)\n`;
    });

    const progressionMoyenne = this.calculerProgressionMoyenne();
    message += `\n📊 **Progression moyenne :** ${progressionMoyenne}% `;
    
    if (progressionMoyenne >= 80) {
      message += `🎉 Excellent !`;
    } else if (progressionMoyenne >= 60) {
      message += `👍 Bien avancé !`;
    } else {
      message += `💪 On y travaille !`;
    }

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'info'
    };
  }

  private generateResumeConvivial(): FriendlyResponse {
    const enCours = this.projets.filter(p => p.statut === 'En cours');
    const disponibles = this.equipe.filter(m => m.disponibilite === 'Disponible');
    const urgents = this.getProjetsUrgents();
    const enRetard = this.getProjetsEnRetard();

    let message = `📋 **Résumé de votre situation !** 😊\n\n`;
    message += `🎯 **En un coup d'œil :**\n`;
    message += `• ${this.projets.length} projet(s) total, ${enCours.length} en cours\n`;
    message += `• ${this.equipe.length} membres d'équipe, ${disponibles.length} disponibles\n`;
    message += `• ${enRetard.length} retard(s), ${urgents.length} urgent(s)\n\n`;

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
    } else {
      message += `🎉 **Tout va bien !** Aucune urgence particulière ! 😌`;
    }

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'analyse'
    };
  }

  private showHelpConvivial(): FriendlyResponse {
    return {
      message: `🤖 **Salut ! Je suis votre assistant SydoFlow !** 😊\n\n` +
              `📊 **Je peux analyser :**\n` +
              `• "projets" - État de vos projets\n` +
              `• "équipe" - Votre équipe et disponibilités\n` +
              `• "deadlines" - Échéances importantes\n` +
              `• "statuts" - Répartition par statut\n` +
              `• "résumé" - Vue d'ensemble\n\n` +
              `🔍 **Je peux chercher :**\n` +
              `• [Nom de projet] - Détails d'un projet\n` +
              `• [Nom de membre] - Infos sur un membre\n\n` +
              `💡 **Exemples :**\n` +
              `• "Refonte Site Web Luxe"\n` +
              `• "Sarah Martin"\n` +
              `• "TechStart"\n\n` +
              `Je connais vos ${this.projets.length} projets et ${this.equipe.length} membres ! 😊`,
      suggestions: ['projets', 'équipe', 'deadlines', 'résumé'],
      type: 'convivial'
    };
  }

  private showProjetDetailsConvivial(projet: any): FriendlyResponse {
    const jours = this.calculerJoursRestants(projet.deadline);
    const emoji = jours < 0 ? '😱' : jours <= 3 ? '⚠️' : '😊';
    
    let message = `📁 **${projet.nom}** ${emoji}\n\n`;
    message += `👤 **Client :** ${projet.client}\n`;
    message += `📊 **Statut :** ${projet.statut}\n`;
    message += `⚡ **Priorité :** ${projet.priorite}\n`;
    message += `👨‍💼 **Responsable :** ${projet.responsable}\n`;
    message += `📈 **Progression :** ${projet.progression}% `;
    
    if (projet.progression >= 80) {
      message += `🎉`;
    } else if (projet.progression >= 60) {
      message += `👍`;
    } else {
      message += `💪`;
    }
    
    message += `\n📅 **Échéance :** ${projet.deadline} (${jours} jour(s))\n`;
    message += `📝 **Description :** ${projet.description}`;

    return {
      message,
      suggestions: ['projets', 'équipe', 'deadlines'],
      type: 'info'
    };
  }

  private showMembreDetailsConvivial(membre: any): FriendlyResponse {
    const projets = this.projets.filter(p => p.responsable === membre.nom);
    const emoji = membre.disponibilite === 'Disponible' ? '😊' : '😰';
    
    let message = `👤 **${membre.nom}** ${emoji}\n\n`;
    message += `🎯 **Rôle :** ${membre.role}\n`;
    message += `📊 **Disponibilité :** ${membre.disponibilite}\n`;
    message += `🛠️ **Spécialité :** ${membre.specialite}\n`;
    message += `📁 **Projets actifs :** ${membre.projets_actifs}\n\n`;

    if (projets.length > 0) {
      message += `📋 **Projets en charge :**\n`;
      projets.forEach(projet => {
        message += `• **${projet.nom}** (${projet.progression}%)\n`;
      });
    } else {
      message += `📋 Aucun projet en charge actuellement.`;
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

export const friendlyChatbotService = new FriendlyChatbotService();
