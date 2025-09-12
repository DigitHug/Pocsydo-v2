import { google } from 'googleapis';
import { initializeIfEmpty } from '@/utils/generateGoogleSheetsStructure';

// Types pour les données basés sur le CSV réel
export interface ProjetData {
  id: number;
  nom: string;
  client: string;
  statut: string;
  priorite: string;
  deadline: string;
  responsable: string;
  progression: number;
  description: string;
}

export interface EquipeData {
  nom: string;
  role: string;
  disponibilite: string;
  specialite: string;
  projets_actifs: number;
}

export interface PipelineData {
  id: number;
  nom: string;
  client: string;
  valeur: string;
  probabilite: number;
  dateContact: string;
  actions: string[];
  couleur: string;
  stage: string;
}

export interface KpiData {
  title: string;
  value: string;
  subtitle: string;
  trend: { value: number; isPositive: boolean };
}

class GoogleSheetsService {
  private sheets: any;
  private auth: any;
  private isInitialized = false;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Configuration de l'authentification
      const authConfig: any = {
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      };

      // Essayer d'utiliser les variables d'environnement d'abord
      if (import.meta.env.VITE_GOOGLE_SHEETS_CLIENT_EMAIL && import.meta.env.VITE_GOOGLE_SHEETS_PRIVATE_KEY) {
        authConfig.credentials = {
          client_email: import.meta.env.VITE_GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: import.meta.env.VITE_GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };
      } else if (import.meta.env.VITE_GOOGLE_SHEETS_CREDENTIALS_PATH) {
        // Utiliser un fichier de credentials
        authConfig.keyFile = import.meta.env.VITE_GOOGLE_SHEETS_CREDENTIALS_PATH;
      } else {
        // Mode développement - utiliser l'authentification par défaut
        console.warn('Aucune configuration Google Sheets trouvée. Utilisation du mode développement.');
        // Pour le développement, on peut utiliser l'authentification par défaut
        // ou demander à l'utilisateur de configurer ses credentials
      }

      this.auth = new google.auth.GoogleAuth(authConfig);
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.isInitialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Google Sheets:', error);
      this.isInitialized = false;
    }
  }

  // Méthode générique pour lire des données depuis une feuille
  async readSheetData(spreadsheetId: string, range: string): Promise<any[][]> {
    if (!this.isInitialized) {
      await this.initializeAuth();
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Erreur lors de la lecture des données:', error);
      throw error;
    }
  }

  // Méthode générique pour écrire des données dans une feuille
  async writeSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAuth();
    }

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'écriture des données:', error);
      throw error;
    }
  }

  // Méthode pour ajouter une ligne
  async appendRow(spreadsheetId: string, range: string, values: any[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAuth();
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de ligne:', error);
      throw error;
    }
  }

  // Méthode pour mettre à jour une ligne spécifique
  async updateRow(spreadsheetId: string, range: string, values: any[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAuth();
    }

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de ligne:', error);
      throw error;
    }
  }

  // Méthodes spécifiques pour les projets
  async getProjets(spreadsheetId: string): Promise<ProjetData[]> {
    try {
      const data = await this.readSheetData(spreadsheetId, 'Projets!A2:I');
      return data.map((row, index) => ({
        id: parseInt(row[0]) || index + 1,
        nom: row[1] || '',
        client: row[2] || '',
        statut: row[3] || '',
        priorite: row[4] || '',
        deadline: row[5] || '',
        responsable: row[6] || '',
        progression: parseInt(row[7]) || 0,
        description: row[8] || '',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      return [];
    }
  }

  async saveProjet(spreadsheetId: string, projet: ProjetData): Promise<void> {
    try {
      const values = [
        projet.id,
        projet.nom,
        projet.client,
        projet.statut,
        projet.priorite,
        projet.deadline,
        projet.responsable,
        projet.progression,
        projet.description,
      ];

      // Si c'est un nouveau projet (id = 0), on l'ajoute
      if (projet.id === 0) {
        await this.appendRow(spreadsheetId, 'Projets!A:I', values);
      } else {
        // Sinon, on met à jour la ligne existante
        const range = `Projets!A${projet.id + 1}:I${projet.id + 1}`;
        await this.updateRow(spreadsheetId, range, values);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      throw error;
    }
  }

  // Méthodes spécifiques pour le pipeline
  async getPipelineData(spreadsheetId: string): Promise<Record<string, PipelineData[]>> {
    try {
      const data = await this.readSheetData(spreadsheetId, 'Pipeline!A2:H');
      const pipelineData: Record<string, PipelineData[]> = {
        'Prospection': [],
        'Qualification': [],
        'Proposition': [],
        'Négociation': [],
        'Gagné': [],
      };

      data.forEach((row, index) => {
        const pipelineItem: PipelineData = {
          id: parseInt(row[0]) || index + 1,
          nom: row[1] || '',
          client: row[2] || '',
          valeur: row[3] || '',
          probabilite: parseInt(row[4]) || 0,
          dateContact: row[5] || '',
          actions: row[6] ? row[6].split(',').map((a: string) => a.trim()) : [],
          couleur: row[7] || 'muted',
          stage: row[8] || 'Prospection',
        };

        if (pipelineData[pipelineItem.stage]) {
          pipelineData[pipelineItem.stage].push(pipelineItem);
        }
      });

      return pipelineData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données pipeline:', error);
      return {
        'Prospection': [],
        'Qualification': [],
        'Proposition': [],
        'Négociation': [],
        'Gagné': [],
      };
    }
  }

  async savePipelineItem(spreadsheetId: string, item: PipelineData): Promise<void> {
    try {
      const values = [
        item.id,
        item.nom,
        item.client,
        item.valeur,
        item.probabilite,
        item.dateContact,
        item.actions.join(', '),
        item.couleur,
        item.stage,
      ];

      if (item.id === 0) {
        await this.appendRow(spreadsheetId, 'Pipeline!A:I', values);
      } else {
        const range = `Pipeline!A${item.id + 1}:I${item.id + 1}`;
        await this.updateRow(spreadsheetId, range, values);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'élément pipeline:', error);
      throw error;
    }
  }

  // Méthodes spécifiques pour les KPIs
  async getKpiData(spreadsheetId: string): Promise<KpiData[]> {
    try {
      const data = await this.readSheetData(spreadsheetId, 'KPIs!A2:D');
      return data.map(row => ({
        title: row[0] || '',
        value: row[1] || '',
        subtitle: row[2] || '',
        trend: {
          value: parseInt(row[3]) || 0,
          isPositive: parseInt(row[3]) >= 0,
        },
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des KPIs:', error);
      return [];
    }
  }

  async saveKpiData(spreadsheetId: string, kpis: KpiData[]): Promise<void> {
    try {
      const values = kpis.map(kpi => [
        kpi.title,
        kpi.value,
        kpi.subtitle,
        kpi.trend.value,
      ]);

      await this.writeSheetData(spreadsheetId, 'KPIs!A2:D', values);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des KPIs:', error);
      throw error;
    }
  }

  // Méthodes spécifiques pour l'équipe
  async getEquipe(spreadsheetId: string): Promise<EquipeData[]> {
    try {
      const data = await this.readSheetData(spreadsheetId, 'Equipe!A2:E');
      return data.map(row => ({
        nom: row[0] || '',
        role: row[1] || '',
        disponibilite: row[2] || '',
        specialite: row[3] || '',
        projets_actifs: parseInt(row[4]) || 0,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'équipe:', error);
      return [];
    }
  }

  async saveEquipe(spreadsheetId: string, equipe: EquipeData[]): Promise<void> {
    try {
      const values = equipe.map(membre => [
        membre.nom,
        membre.role,
        membre.disponibilite,
        membre.specialite,
        membre.projets_actifs,
      ]);

      await this.writeSheetData(spreadsheetId, 'Equipe!A2:E', values);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'équipe:', error);
      throw error;
    }
  }

  // Méthode pour créer les en-têtes de feuilles si elles n'existent pas
  async initializeSheetHeaders(spreadsheetId: string): Promise<void> {
    try {
      // En-têtes pour la feuille Projets (basé sur le CSV réel)
      const projetsHeaders = [
        'ID', 'Nom', 'Client', 'Statut', 'Priorité', 'Deadline', 'Responsable', 'Progression', 'Description'
      ];
      await this.writeSheetData(spreadsheetId, 'Projets!A1:I1', [projetsHeaders]);

      // En-têtes pour la feuille Equipe (basé sur le CSV réel)
      const equipeHeaders = [
        'Nom', 'Rôle', 'Disponibilité', 'Spécialité', 'Projets Actifs'
      ];
      await this.writeSheetData(spreadsheetId, 'Equipe!A1:E1', [equipeHeaders]);

      // En-têtes pour la feuille Pipeline
      const pipelineHeaders = [
        'ID', 'Nom', 'Client', 'Valeur', 'Probabilité', 'Date Contact', 'Actions', 'Couleur', 'Stage'
      ];
      await this.writeSheetData(spreadsheetId, 'Pipeline!A1:I1', [pipelineHeaders]);

      // En-têtes pour la feuille KPIs
      const kpiHeaders = [
        'Titre', 'Valeur', 'Sous-titre', 'Tendance'
      ];
      await this.writeSheetData(spreadsheetId, 'KPIs!A1:D1', [kpiHeaders]);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des en-têtes:', error);
      throw error;
    }
  }
}

// Instance singleton
export const googleSheetsService = new GoogleSheetsService();
