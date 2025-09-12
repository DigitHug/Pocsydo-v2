export interface CSVUploadResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface ExcelUploadResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  sheets?: string[];
}

class CSVUploadService {
  
  // Parser Excel avec la bibliothèque xlsx
  async parseExcelFile(file: File, type: 'projets' | 'equipe', sheetName?: string): Promise<ExcelUploadResult> {
    try {
      const XLSX = await import('xlsx');
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Lister les feuilles disponibles
      const sheets = workbook.SheetNames;
      
      // Utiliser la feuille spécifiée ou la première
      const targetSheet = sheetName || sheets[0];
      const worksheet = workbook.Sheets[targetSheet];
      
      if (!worksheet) {
        return {
          success: false,
          message: `Feuille "${targetSheet}" non trouvée`,
          error: 'SHEET_NOT_FOUND',
          sheets
        };
      }
      
      // Convertir en JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        return {
          success: false,
          message: 'Le fichier Excel doit contenir au moins un en-tête et une ligne de données',
          error: 'EXCEL_INVALID',
          sheets
        };
      }
      
      // Convertir en format CSV pour validation
      const csvText = jsonData.map((row: any[]) => row.join(',')).join('\n');
      
      // Utiliser la validation existante
      const result = this.parseCSVFromText(csvText, type);
      
      return {
        ...result,
        sheets
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la lecture du fichier Excel',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }
  
  parseCSVFromText(csvText: string, type: 'projets' | 'equipe'): CSVUploadResult {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return {
          success: false,
          message: 'Le CSV doit contenir au moins un en-tête et une ligne de données',
          error: 'CSV_INVALID'
        };
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const data: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          data.push(row);
        }
      }

      if (type === 'projets') {
        return this.validateProjetsData(data);
      } else {
        return this.validateEquipeData(data);
      }

    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du parsing du CSV',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }

  private validateProjetsData(data: any[]): CSVUploadResult {
    const requiredFields = ['nom', 'client', 'statut', 'priorite', 'deadline', 'responsable'];
    const missingFields = requiredFields.filter(field => 
      !data[0] || data[0][field] === undefined
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Champs manquants dans le CSV projets : ${missingFields.join(', ')}`,
        error: 'MISSING_FIELDS'
      };
    }

    // Ajouter des champs par défaut si manquants
    const enrichedData = data.map((row, index) => ({
      id: row.id || (index + 1).toString(),
      nom: row.nom,
      client: row.client,
      statut: row.statut,
      priorite: row.priorite,
      deadline: row.deadline,
      responsable: row.responsable,
      progression: parseInt(row.progression) || 0,
      description: row.description || ''
    }));

    return {
      success: true,
      message: `${enrichedData.length} projets chargés avec succès`,
      data: enrichedData
    };
  }

  private validateEquipeData(data: any[]): CSVUploadResult {
    const requiredFields = ['nom', 'role', 'disponibilite', 'specialite'];
    const missingFields = requiredFields.filter(field => 
      !data[0] || data[0][field] === undefined
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Champs manquants dans le CSV équipe : ${missingFields.join(', ')}`,
        error: 'MISSING_FIELDS'
      };
    }

    // Ajouter des champs par défaut si manquants
    const enrichedData = data.map(row => ({
      nom: row.nom,
      role: row.role,
      disponibilite: row.disponibilite,
      specialite: row.specialite,
      projets_actifs: parseInt(row.projets_actifs) || 0
    }));

    return {
      success: true,
      message: `${enrichedData.length} membres d'équipe chargés avec succès`,
      data: enrichedData
    };
  }

  generateCSVTemplate(type: 'projets' | 'equipe'): string {
    if (type === 'projets') {
      return `id,nom,client,statut,priorite,deadline,responsable,progression,description
1,Exemple Projet,Client ABC,En cours,Haute,2024-02-15,Jean Dupont,75,Description du projet
2,Autre Projet,Client XYZ,Planifié,Moyenne,2024-02-20,Marie Martin,25,Autre description`;
    } else {
      return `nom,role,disponibilite,specialite,projets_actifs
Jean Dupont,Chef de projet,Disponible,Gestion de projet,2
Marie Martin,Développeur,Occupé,Développement web,1
Pierre Durand,Designer,Disponible,UI/UX Design,0`;
    }
  }

  generateExcelTemplate(type: 'projets' | 'equipe'): string {
    if (type === 'projets') {
      return `📊 **Template Excel Projets :**

**Colonnes requises :**
- id : Identifiant unique
- nom : Nom du projet
- client : Nom du client
- statut : En cours, Planifié, Terminé, etc.
- priorite : Haute, Moyenne, Basse
- deadline : Date d'échéance (YYYY-MM-DD)
- responsable : Nom du responsable
- progression : Pourcentage (0-100)
- description : Description du projet

**Conseils :**
• Utilisez la première feuille de votre fichier Excel
• La première ligne doit contenir les en-têtes
• Les dates doivent être au format YYYY-MM-DD
• Les pourcentages doivent être des nombres (ex: 75, pas "75%")`;
    } else {
      return `👥 **Template Excel Équipe :**

**Colonnes requises :**
- nom : Nom complet
- role : Poste/fonction
- disponibilite : Disponible, Occupé, Absent
- specialite : Compétence principale
- projets_actifs : Nombre de projets en cours

**Conseils :**
• Utilisez la première feuille de votre fichier Excel
• La première ligne doit contenir les en-têtes
• Les nombres doivent être des valeurs numériques`;
    }
  }
}

export const csvUploadService = new CSVUploadService();
