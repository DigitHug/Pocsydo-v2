import { googleSheetsService } from '@/services/GoogleSheetsService';

// Données basées sur vos fichiers CSV
const projetsData = [
  [1, "Refonte Site Web Luxe", "Maison Martin", "En cours", "Haute", "2024-01-15", "Sarah Martin", 75, "Refonte complète du site e-commerce avec nouveau design"],
  [2, "App Mobile E-commerce", "TechStart", "Review", "Moyenne", "2024-01-20", "Tom Chen", 60, "Développement d'une application mobile pour la vente en ligne"],
  [3, "Plateforme SaaS", "InnovateCorp", "Planifié", "Basse", "2024-01-28", "Emma Wilson", 25, "Création d'une plateforme SaaS pour la gestion d'équipe"],
  [4, "Audit SEO", "Digital Plus", "En cours", "Haute", "2024-01-10", "Alexandre Dubois", 90, "Audit complet et optimisation SEO du site existant"],
  [5, "Présentation Design", "Creative Lab", "En cours", "Moyenne", "2024-01-12", "Caroline Petit", 85, "Préparation de la présentation design pour le client"],
  [6, "Livrable Final", "Global Tech", "En cours", "Haute", "2024-01-08", "Matthieu Leroy", 95, "Finalisation et livraison du projet de migration"]
];

const equipeData = [
  ["Sarah Martin", "Chef de projet", "Disponible", "Gestion de projet", 2],
  ["Tom Chen", "Développeur", "Occupé", "Développement mobile", 1],
  ["Emma Wilson", "Designer", "Disponible", "UI/UX Design", 1],
  ["Alexandre Dubois", "SEO Specialist", "Disponible", "SEO/SEA", 1],
  ["Caroline Petit", "Designer", "Occupé", "Graphisme", 1],
  ["Matthieu Leroy", "Développeur", "Disponible", "Backend", 1],
  ["Lea Moreau", "Marketing", "Disponible", "Marketing digital", 0],
  ["Antony Roux", "DevOps", "Disponible", "Infrastructure", 0],
  ["Sylvain Bernard", "Analyste", "Disponible", "Analyse de données", 0]
];

const pipelineData = [
  [1, "Site E-commerce Bio", "Green Market", "€25k", 30, "5 Jan 2024", "Appel de suivi, Présentation produit", "muted", "Prospection"],
  [2, "App Fitness Studio", "FitZone", "€18k", 20, "8 Jan 2024", "Rendez-vous commercial", "muted", "Prospection"],
  [3, "Plateforme Formation", "EduTech Solutions", "€45k", 50, "3 Jan 2024", "Analyse besoins, Cahier des charges", "cyan", "Qualification"],
  [4, "Site Vitrine Luxe", "Prestige Jewels", "€12k", 60, "10 Jan 2024", "Validation budget", "cyan", "Qualification"],
  [5, "CRM Sur Mesure", "Sales Dynamics", "€67k", 75, "28 Déc 2023", "Négociation tarifs, Présentation finale", "coral", "Proposition"],
  [6, "Marketplace B2B", "TradePro", "€89k", 85, "2 Jan 2024", "Signature imminente", "coral", "Proposition"],
  [7, "Application IoT", "SmartHome Inc", "€55k", 90, "20 Déc 2023", "Validation technique, Planning", "violet", "Négociation"],
  [8, "Refonte Site Web Luxe", "Maison Martin", "€45k", 100, "15 Déc 2023", "Projet en cours", "success", "Gagné"],
  [9, "App Mobile E-commerce", "TechStart", "€32k", 100, "10 Déc 2023", "Livraison prévue", "success", "Gagné"]
];

const kpiData = [
  ["Prospects", "47", "Appels entrants", 12],
  ["Projets Actifs", "23", "En cours", 8],
  ["Propositions", "15", "En attente", -3],
  ["Chiffre d'Affaires", "€187k", "Ce mois", 15]
];

export const generateGoogleSheetsStructure = async (spreadsheetId: string) => {
  try {
    console.log('🚀 Génération de la structure Google Sheets...');

    // 1. Initialiser les en-têtes
    await googleSheetsService.initializeSheetHeaders(spreadsheetId);
    console.log('✅ En-têtes initialisés');

    // 2. Ajouter les données des projets
    await googleSheetsService.writeSheetData(spreadsheetId, 'Projets!A2:I', projetsData);
    console.log('✅ Données des projets ajoutées');

    // 3. Ajouter les données de l'équipe
    await googleSheetsService.writeSheetData(spreadsheetId, 'Equipe!A2:E', equipeData);
    console.log('✅ Données de l\'équipe ajoutées');

    // 4. Ajouter les données du pipeline
    await googleSheetsService.writeSheetData(spreadsheetId, 'Pipeline!A2:I', pipelineData);
    console.log('✅ Données du pipeline ajoutées');

    // 5. Ajouter les données des KPIs
    await googleSheetsService.writeSheetData(spreadsheetId, 'KPIs!A2:D', kpiData);
    console.log('✅ Données des KPIs ajoutées');

    console.log('🎉 Structure Google Sheets générée avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la structure:', error);
    throw error;
  }
};

// Fonction pour vérifier si la feuille est vide
export const isSheetEmpty = async (spreadsheetId: string, sheetName: string): Promise<boolean> => {
  try {
    const data = await googleSheetsService.readSheetData(spreadsheetId, `${sheetName}!A2:Z`);
    return data.length === 0;
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${sheetName}:`, error);
    return true; // Considérer comme vide en cas d'erreur
  }
};

// Fonction pour initialiser seulement si la feuille est vide
export const initializeIfEmpty = async (spreadsheetId: string) => {
  try {
    const [projetsEmpty, equipeEmpty, pipelineEmpty, kpisEmpty] = await Promise.all([
      isSheetEmpty(spreadsheetId, 'Projets'),
      isSheetEmpty(spreadsheetId, 'Equipe'),
      isSheetEmpty(spreadsheetId, 'Pipeline'),
      isSheetEmpty(spreadsheetId, 'KPIs')
    ]);

    if (projetsEmpty || equipeEmpty || pipelineEmpty || kpisEmpty) {
      console.log('📋 Feuille détectée comme vide, initialisation des données...');
      await generateGoogleSheetsStructure(spreadsheetId);
    } else {
      console.log('📋 Feuille déjà remplie, pas d\'initialisation nécessaire');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation conditionnelle:', error);
    throw error;
  }
};
