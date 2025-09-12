import { dataService, Projet, MembreEquipe, AnalyseProjet } from './DataService';

export interface ReponseIntelligente {
  message: string;
  suggestions?: string[];
  donnees?: any;
  type: 'info' | 'alerte' | 'suggestion' | 'analyse';
}

class ChatbotIntelligence {
  private analyseCache: AnalyseProjet | null = null;
  private lastUpdate: number = 0;

  async initialiser() {
    await dataService.chargerDonnees();
    this.actualiserAnalyse();
  }

  private actualiserAnalyse() {
    this.analyseCache = dataService.analyserProjets();
    this.lastUpdate = Date.now();
  }

  private getAnalyse(): AnalyseProjet {
    // Actualiser l'analyse toutes les 5 minutes
    if (!this.analyseCache || Date.now() - this.lastUpdate > 300000) {
      this.actualiserAnalyse();
    }
    return this.analyseCache!;
  }

  async traiterMessage(message: string): Promise<ReponseIntelligente> {
    const messageLower = message.toLowerCase();
    const analyse = this.getAnalyse();

    // Détection des intentions
    if (this.contientMots(messageLower, ['projet', 'projets', 'dossier', 'dossiers'])) {
      return this.repondreProjets(messageLower, analyse);
    }

    if (this.contientMots(messageLower, ['équipe', 'membre', 'collaborateur', 'responsable'])) {
      return this.repondreEquipe(messageLower, analyse);
    }

    if (this.contientMots(messageLower, ['deadline', 'échéance', 'urgent', 'retard'])) {
      return this.repondreDeadlines(messageLower, analyse);
    }

    if (this.contientMots(messageLower, ['statut', 'avancement', 'progression', 'état'])) {
      return this.repondreStatuts(messageLower, analyse);
    }

    if (this.contientMots(messageLower, ['aide', 'help', 'suggestion', 'conseil'])) {
      return this.repondreAide(analyse);
    }

    if (this.contientMots(messageLower, ['résumé', 'synthèse', 'vue', 'ensemble'])) {
      return this.repondreResume(analyse);
    }

    // Recherche par nom de projet ou client
    const projetsTrouves = dataService.rechercherProjet(message);
    if (projetsTrouves.length > 0) {
      return this.repondreRechercheProjet(projetsTrouves);
    }

    // Recherche par nom de membre
    const membreTrouve = dataService.getMembreParNom(message);
    if (membreTrouve) {
      return this.repondreMembre(membreTrouve);
    }

    return this.repondreGenerique(analyse);
  }

  private contientMots(message: string, mots: string[]): boolean {
    return mots.some(mot => message.includes(mot));
  }

  private repondreProjets(message: string, analyse: AnalyseProjet): ReponseIntelligente {
    const projets = dataService.getProjets();
    const enCours = projets.filter(p => p.statut === 'En cours');
    const urgents = analyse.projetsUrgents;

    let reponse = `📊 **État des projets :**\n\n`;
    reponse += `• ${enCours.length} projet(s) en cours\n`;
    reponse += `• ${urgents.length} projet(s) urgent(s)\n`;
    reponse += `• ${analyse.projetsEnRetard.length} projet(s) en retard\n\n`;

    if (urgents.length > 0) {
      reponse += `🚨 **Projets urgents :**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        reponse += `• ${projet.nom} (${projet.client}) - ${jours} jour(s) restant(s)\n`;
      });
      reponse += `\n`;
    }

    if (analyse.suggestions.length > 0) {
      reponse += `💡 **Suggestions :**\n`;
      analyse.suggestions.forEach(suggestion => {
        reponse += `• ${suggestion}\n`;
      });
    }

    return {
      message: reponse,
      suggestions: this.genererSuggestionsProjets(analyse),
      donnees: { projets: enCours, urgents },
      type: 'analyse'
    };
  }

  private repondreEquipe(message: string, analyse: AnalyseProjet): ReponseIntelligente {
    const equipe = dataService.getEquipe();
    const disponibles = equipe.filter(m => m.disponibilite === 'Disponible');
    const surcharges = analyse.membresSurcharges;

    let reponse = `👥 **État de l'équipe :**\n\n`;
    reponse += `• ${disponibles.length}/${equipe.length} membre(s) disponible(s)\n`;
    reponse += `• ${surcharges.length} membre(s) surchargé(s)\n\n`;

    if (surcharges.length > 0) {
      reponse += `⚠️ **Membres surchargés :**\n`;
      surcharges.forEach(membre => {
        reponse += `• ${membre.nom} (${membre.role}) - ${membre.projets_actifs} projet(s)\n`;
      });
      reponse += `\n`;
    }

    reponse += `📋 **Membres disponibles :**\n`;
    disponibles.forEach(membre => {
      reponse += `• ${membre.nom} - ${membre.specialite}\n`;
    });

    return {
      message: reponse,
      suggestions: this.genererSuggestionsEquipe(analyse),
      donnees: { equipe, disponibles, surcharges },
      type: 'info'
    };
  }

  private repondreDeadlines(message: string, analyse: AnalyseProjet): ReponseIntelligente {
    const urgents = analyse.projetsUrgents;
    const enRetard = analyse.projetsEnRetard;

    let reponse = `⏰ **Échéances critiques :**\n\n`;

    if (enRetard.length > 0) {
      reponse += `🚨 **Projets en retard :**\n`;
      enRetard.forEach(projet => {
        const jours = this.calculerJoursRetard(projet.deadline);
        reponse += `• ${projet.nom} - ${jours} jour(s) de retard\n`;
      });
      reponse += `\n`;
    }

    if (urgents.length > 0) {
      reponse += `⚠️ **Projets urgents (≤3 jours) :**\n`;
      urgents.forEach(projet => {
        const jours = this.calculerJoursRestants(projet.deadline);
        reponse += `• ${projet.nom} (${projet.client}) - ${jours} jour(s)\n`;
      });
    }

    if (enRetard.length === 0 && urgents.length === 0) {
      reponse += `✅ Aucune échéance critique détectée !`;
    }

    return {
      message: reponse,
      suggestions: this.genererSuggestionsDeadlines(analyse),
      donnees: { urgents, enRetard },
      type: enRetard.length > 0 ? 'alerte' : 'info'
    };
  }

  private repondreStatuts(message: string, analyse: AnalyseProjet): ReponseIntelligente {
    const projets = dataService.getProjets();
    const statuts = this.analyserStatuts(projets);

    let reponse = `📈 **Répartition par statut :**\n\n`;
    Object.entries(statuts).forEach(([statut, count]) => {
      reponse += `• ${statut}: ${count} projet(s)\n`;
    });

    reponse += `\n📊 **Progression moyenne :** ${this.calculerProgressionMoyenne(projets)}%`;

    return {
      message: reponse,
      donnees: { statuts, projets },
      type: 'info'
    };
  }

  private repondreAide(analyse: AnalyseProjet): ReponseIntelligente {
    const message = `🤖 **Commandes disponibles :**\n\n` +
      `• "projets" - État des projets\n` +
      `• "équipe" - État de l'équipe\n` +
      `• "deadlines" - Échéances critiques\n` +
      `• "statuts" - Répartition par statut\n` +
      `• "résumé" - Vue d'ensemble\n` +
      `• [Nom de projet] - Détails d'un projet\n` +
      `• [Nom de membre] - Infos sur un membre\n\n` +
      `💡 Je peux aussi analyser vos données et proposer des suggestions !`;

    return {
      message,
      type: 'info'
    };
  }

  private repondreResume(analyse: AnalyseProjet): ReponseIntelligente {
    const projets = dataService.getProjets();
    const equipe = dataService.getEquipe();

    let reponse = `📋 **Résumé exécutif :**\n\n`;
    reponse += `📊 **Projets :** ${projets.length} total, ${projets.filter(p => p.statut === 'En cours').length} en cours\n`;
    reponse += `👥 **Équipe :** ${equipe.length} membres, ${equipe.filter(m => m.disponibilite === 'Disponible').length} disponibles\n`;
    reponse += `⚠️ **Alertes :** ${analyse.projetsEnRetard.length} retard(s), ${analyse.projetsUrgents.length} urgent(s)\n\n`;

    if (analyse.suggestions.length > 0) {
      reponse += `🎯 **Actions recommandées :**\n`;
      analyse.suggestions.forEach(suggestion => {
        reponse += `• ${suggestion}\n`;
      });
    }

    return {
      message: reponse,
      suggestions: analyse.suggestions,
      donnees: analyse,
      type: 'analyse'
    };
  }

  private repondreRechercheProjet(projets: Projet[]): ReponseIntelligente {
    if (projets.length === 1) {
      const projet = projets[0];
      const jours = this.calculerJoursRestants(projet.deadline);
      
      let reponse = `📁 **${projet.nom}**\n\n`;
      reponse += `👤 Client: ${projet.client}\n`;
      reponse += `📊 Statut: ${projet.statut}\n`;
      reponse += `⚡ Priorité: ${projet.priorite}\n`;
      reponse += `👨‍💼 Responsable: ${projet.responsable}\n`;
      reponse += `📈 Progression: ${projet.progression}%\n`;
      reponse += `📅 Échéance: ${projet.deadline} (${jours} jour(s))\n`;
      reponse += `📝 Description: ${projet.description}`;

      return {
        message: reponse,
        donnees: projet,
        type: 'info'
      };
    } else {
      let reponse = `🔍 **Projets trouvés (${projets.length}) :**\n\n`;
      projets.forEach(projet => {
        reponse += `• ${projet.nom} (${projet.client}) - ${projet.statut}\n`;
      });

      return {
        message: reponse,
        donnees: projets,
        type: 'info'
      };
    }
  }

  private repondreMembre(membre: MembreEquipe): ReponseIntelligente {
    const projets = dataService.getProjetsParResponsable(membre.nom);
    
    let reponse = `👤 **${membre.nom}**\n\n`;
    reponse += `🎯 Rôle: ${membre.role}\n`;
    reponse += `📊 Disponibilité: ${membre.disponibilite}\n`;
    reponse += `🛠️ Spécialité: ${membre.specialite}\n`;
    reponse += `📁 Projets actifs: ${membre.projets_actifs}\n\n`;

    if (projets.length > 0) {
      reponse += `📋 **Projets en charge :**\n`;
      projets.forEach(projet => {
        reponse += `• ${projet.nom} (${projet.progression}%)\n`;
      });
    }

    return {
      message: reponse,
      donnees: { membre, projets },
      type: 'info'
    };
  }

  private repondreGenerique(analyse: AnalyseProjet): ReponseIntelligente {
    const suggestions = analyse.suggestions;
    
    if (suggestions.length > 0) {
      return {
        message: `🤖 Je peux vous aider avec la gestion de vos projets ! Voici quelques points d'attention :\n\n${suggestions.join('\n')}`,
        suggestions: ['Voir les projets', 'État de l\'équipe', 'Échéances'],
        type: 'suggestion'
      };
    }

    return {
      message: `🤖 Bonjour ! Je suis votre assistant IA pour la gestion de projets. Je peux vous aider à suivre vos dossiers, analyser l'état de l'équipe et proposer des suggestions. Que souhaitez-vous savoir ?`,
      suggestions: ['État des projets', 'Équipe', 'Échéances', 'Aide'],
      type: 'info'
    };
  }

  // Méthodes utilitaires
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

  private analyserStatuts(projets: Projet[]): Record<string, number> {
    const statuts: Record<string, number> = {};
    projets.forEach(projet => {
      statuts[projet.statut] = (statuts[projet.statut] || 0) + 1;
    });
    return statuts;
  }

  private calculerProgressionMoyenne(projets: Projet[]): number {
    if (projets.length === 0) return 0;
    const total = projets.reduce((sum, projet) => sum + projet.progression, 0);
    return Math.round(total / projets.length);
  }

  private genererSuggestionsProjets(analyse: AnalyseProjet): string[] {
    const suggestions = [];
    if (analyse.projetsEnRetard.length > 0) {
      suggestions.push('Prioriser les projets en retard');
    }
    if (analyse.projetsUrgents.length > 0) {
      suggestions.push('Planifier les livraisons urgentes');
    }
    return suggestions;
  }

  private genererSuggestionsEquipe(analyse: AnalyseProjet): string[] {
    const suggestions = [];
    if (analyse.membresSurcharges.length > 0) {
      suggestions.push('Redistribuer la charge de travail');
    }
    suggestions.push('Voir les disponibilités');
    return suggestions;
  }

  private genererSuggestionsDeadlines(analyse: AnalyseProjet): string[] {
    const suggestions = [];
    if (analyse.projetsEnRetard.length > 0) {
      suggestions.push('Contacter les clients en retard');
    }
    if (analyse.projetsUrgents.length > 0) {
      suggestions.push('Mobiliser l\'équipe sur les urgences');
    }
    return suggestions;
  }
}

export const chatbotIntelligence = new ChatbotIntelligence();

