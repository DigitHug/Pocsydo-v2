import { dataService } from './DataService';
import { chatbotIntelligence } from './ChatbotIntelligence';

export interface DataStatus {
  isLoaded: boolean;
  projetsCount: number;
  equipeCount: number;
  lastUpdate: Date;
  errors: string[];
}

class DataInitializationService {
  private status: DataStatus = {
    isLoaded: false,
    projetsCount: 0,
    equipeCount: 0,
    lastUpdate: new Date(),
    errors: []
  };

  async initializeData(): Promise<DataStatus> {
    try {
      console.log('🔄 Initialisation des données pour l\'assistant IA...');
      
      // Charger les données depuis les fichiers CSV
      await dataService.chargerDonnees();
      
      // Initialiser l'intelligence du chatbot
      await chatbotIntelligence.initialiser();
      
      // Mettre à jour le statut
      const projets = dataService.getProjets();
      const equipe = dataService.getEquipe();
      
      this.status = {
        isLoaded: true,
        projetsCount: projets.length,
        equipeCount: equipe.length,
        lastUpdate: new Date(),
        errors: []
      };

      console.log('✅ Données initialisées avec succès:', {
        projets: projets.length,
        equipe: equipe.length
      });

      // Afficher un résumé des données chargées
      this.logDataSummary(projets, equipe);

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des données:', error);
      this.status.errors.push(error instanceof Error ? error.message : 'Erreur inconnue');
    }

    return this.status;
  }

  private logDataSummary(projets: any[], equipe: any[]) {
    console.log('📊 Résumé des données chargées:');
    console.log('📁 Projets:', projets.map(p => `• ${p.nom} (${p.client}) - ${p.statut}`));
    console.log('👥 Équipe:', equipe.map(m => `• ${m.nom} (${m.role}) - ${m.disponibilite}`));
  }

  getStatus(): DataStatus {
    return this.status;
  }

  async refreshData(): Promise<DataStatus> {
    console.log('🔄 Actualisation des données...');
    return this.initializeData();
  }

  // Méthodes pour obtenir des informations spécifiques
  getProjetsInfo(): string {
    const projets = dataService.getProjets();
    if (projets.length === 0) return 'Aucun projet chargé';
    
    const enCours = projets.filter(p => p.statut === 'En cours').length;
    const urgents = dataService.getProjetsUrgents().length;
    
    return `${projets.length} projets au total, ${enCours} en cours, ${urgents} urgents`;
  }

  getEquipeInfo(): string {
    const equipe = dataService.getEquipe();
    if (equipe.length === 0) return 'Aucune donnée d\'équipe chargée';
    
    const disponibles = equipe.filter(m => m.disponibilite === 'Disponible').length;
    const surcharges = equipe.filter(m => m.projets_actifs >= 2).length;
    
    return `${equipe.length} membres, ${disponibles} disponibles, ${surcharges} surchargés`;
  }

  getAlertesInfo(): string {
    const analyse = dataService.analyserProjets();
    const alertes = [];
    
    if (analyse.projetsEnRetard.length > 0) {
      alertes.push(`${analyse.projetsEnRetard.length} projet(s) en retard`);
    }
    
    if (analyse.projetsUrgents.length > 0) {
      alertes.push(`${analyse.projetsUrgents.length} projet(s) urgent(s)`);
    }
    
    if (analyse.membresSurcharges.length > 0) {
      alertes.push(`${analyse.membresSurcharges.length} membre(s) surchargé(s)`);
    }
    
    return alertes.length > 0 ? alertes.join(', ') : 'Aucune alerte';
  }
}

export const dataInitializationService = new DataInitializationService();
