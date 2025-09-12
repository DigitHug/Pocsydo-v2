export interface Projet {
  id: string;
  nom: string;
  client: string;
  statut: string;
  priorite: string;
  deadline: string;
  responsable: string;
  progression: number;
  description: string;
}

export interface MembreEquipe {
  nom: string;
  role: string;
  disponibilite: string;
  specialite: string;
  projets_actifs: number;
}

export interface AnalyseProjet {
  projetsEnRetard: Projet[];
  projetsUrgents: Projet[];
  membresSurcharges: MembreEquipe[];
  suggestions: string[];
}

export interface FichierDonnees {
  nom: string;
  type: 'csv' | 'xlsx' | 'xls';
  chemin: string;
  taille: number;
  dateModification: Date;
}

class DataService {
  private projets: Projet[] = [];
  private equipe: MembreEquipe[] = [];

  async chargerDonnees() {
    try {
      // Détecter automatiquement les fichiers disponibles
      const fichiersDisponibles = await this.detecterFichiersDisponibles();
      console.log('Fichiers détectés:', fichiersDisponibles);

      // Charger les projets (priorité : Excel > CSV)
      const fichierProjets = fichiersDisponibles.find(f => 
        f.nom.toLowerCase().includes('projet') && (f.type === 'xlsx' || f.type === 'xls')
      ) || fichiersDisponibles.find(f => 
        f.nom.toLowerCase().includes('projet') && f.type === 'csv'
      );

      if (fichierProjets) {
        if (fichierProjets.type === 'csv') {
          const projetsResponse = await fetch(fichierProjets.chemin);
          const projetsText = await projetsResponse.text();
          this.projets = this.parseCSV(projetsText, this.parseProjet);
        } else {
          // Pour Excel, on utilisera le service d'upload
          console.log('Fichier Excel détecté pour les projets:', fichierProjets.nom);
        }
      }

      // Charger l'équipe (priorité : Excel > CSV)
      const fichierEquipe = fichiersDisponibles.find(f => 
        f.nom.toLowerCase().includes('equipe') && (f.type === 'xlsx' || f.type === 'xls')
      ) || fichiersDisponibles.find(f => 
        f.nom.toLowerCase().includes('equipe') && f.type === 'csv'
      );

      if (fichierEquipe) {
        if (fichierEquipe.type === 'csv') {
          const equipeResponse = await fetch(fichierEquipe.chemin);
          const equipeText = await equipeResponse.text();
          this.equipe = this.parseCSV(equipeText, this.parseMembreEquipe);
        } else {
          console.log('Fichier Excel détecté pour l\'équipe:', fichierEquipe.nom);
        }
      }

      console.log('Données chargées:', { projets: this.projets.length, equipe: this.equipe.length });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  private async detecterFichiersDisponibles(): Promise<FichierDonnees[]> {
    // Liste des fichiers potentiels à vérifier
    const fichiersPotentiels = [
      'projets.csv', 'projets.xlsx', 'projets.xls',
      'equipe.csv', 'equipe.xlsx', 'equipe.xls',
      'team.csv', 'team.xlsx', 'team.xls',
      'projects.csv', 'projects.xlsx', 'projects.xls'
    ];

    const fichiersDisponibles: FichierDonnees[] = [];

    for (const fichier of fichiersPotentiels) {
      try {
        const response = await fetch(`/data/${fichier}`, { method: 'HEAD' });
        if (response.ok) {
          const extension = fichier.split('.').pop()?.toLowerCase();
          fichiersDisponibles.push({
            nom: fichier,
            type: extension as 'csv' | 'xlsx' | 'xls',
            chemin: `/data/${fichier}`,
            taille: parseInt(response.headers.get('content-length') || '0'),
            dateModification: new Date(response.headers.get('last-modified') || Date.now())
          });
        }
      } catch (error) {
        // Fichier non trouvé, continuer
      }
    }

    return fichiersDisponibles;
  }

  private parseCSV<T>(csvText: string, parser: (row: string[]) => T): T[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        data.push(parser(values));
      }
    }

    return data;
  }

  private parseProjet(row: string[]): Projet {
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

  private parseMembreEquipe(row: string[]): MembreEquipe {
    return {
      nom: row[0],
      role: row[1],
      disponibilite: row[2],
      specialite: row[3],
      projets_actifs: parseInt(row[4]) || 0
    };
  }

  // Méthodes d'analyse
  analyserProjets(): AnalyseProjet {
    const aujourdhui = new Date();
    
    const projetsEnRetard = this.projets.filter(projet => {
      const deadline = new Date(projet.deadline);
      return deadline < aujourdhui && projet.statut !== 'Terminé';
    });

    const projetsUrgents = this.projets.filter(projet => {
      const deadline = new Date(projet.deadline);
      const joursRestants = Math.ceil((deadline.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));
      return joursRestants <= 3 && projet.statut !== 'Terminé';
    });

    const membresSurcharges = this.equipe.filter(membre => membre.projets_actifs >= 2);

    const suggestions = this.genererSuggestions(projetsEnRetard, projetsUrgents, membresSurcharges);

    return {
      projetsEnRetard,
      projetsUrgents,
      membresSurcharges,
      suggestions
    };
  }

  private genererSuggestions(retard: Projet[], urgents: Projet[], surcharges: MembreEquipe[]): string[] {
    const suggestions: string[] = [];

    if (retard.length > 0) {
      suggestions.push(`⚠️ ${retard.length} projet(s) en retard nécessitent une attention immédiate`);
    }

    if (urgents.length > 0) {
      suggestions.push(`🚨 ${urgents.length} projet(s) avec échéance dans les 3 jours`);
    }

    if (surcharges.length > 0) {
      suggestions.push(`👥 ${surcharges.length} membre(s) de l'équipe surchargé(s) - considérer une redistribution`);
    }

    // Suggestions par statut
    const enCours = this.projets.filter(p => p.statut === 'En cours');
    if (enCours.length > 5) {
      suggestions.push(`📊 ${enCours.length} projets en cours - vérifier la capacité de l'équipe`);
    }

    return suggestions;
  }

  // Méthodes de recherche
  rechercherProjet(terme: string): Projet[] {
    const termeLower = terme.toLowerCase();
    return this.projets.filter(projet => 
      projet.nom.toLowerCase().includes(termeLower) ||
      projet.client.toLowerCase().includes(termeLower) ||
      projet.responsable.toLowerCase().includes(termeLower)
    );
  }

  getProjetsParResponsable(nom: string): Projet[] {
    return this.projets.filter(projet => 
      projet.responsable.toLowerCase().includes(nom.toLowerCase())
    );
  }

  getMembreParNom(nom: string): MembreEquipe | undefined {
    return this.equipe.find(membre => 
      membre.nom.toLowerCase().includes(nom.toLowerCase())
    );
  }

  getProjetsUrgents(): Projet[] {
    const aujourdhui = new Date();
    return this.projets.filter(projet => {
      const deadline = new Date(projet.deadline);
      const joursRestants = Math.ceil((deadline.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24));
      return joursRestants <= 7 && projet.statut !== 'Terminé';
    });
  }

  // Getters
  getProjets(): Projet[] {
    return this.projets;
  }

  getEquipe(): MembreEquipe[] {
    return this.equipe;
  }
}

export const dataService = new DataService();
