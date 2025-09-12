import { useState, useEffect, useCallback } from 'react';
import { googleSheetsService, ProjetData, PipelineData, KpiData, EquipeData } from '@/services/GoogleSheetsService';
import { initializeIfEmpty } from '@/utils/generateGoogleSheetsStructure';

interface UseGoogleSheetsOptions {
  spreadsheetId: string;
  autoSync?: boolean;
  syncInterval?: number; // en millisecondes
}

interface UseGoogleSheetsReturn {
  // États
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  
  // Actions
  syncData: () => Promise<void>;
  saveData: (data: any) => Promise<void>;
  
  // Données
  projets: ProjetData[];
  equipe: EquipeData[];
  pipelineData: Record<string, PipelineData[]>;
  kpiData: KpiData[];
}

export const useGoogleSheets = (options: UseGoogleSheetsOptions): UseGoogleSheetsReturn => {
  const { spreadsheetId, autoSync = true, syncInterval = 30000 } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projets, setProjets] = useState<ProjetData[]>([]);
  const [equipe, setEquipe] = useState<EquipeData[]>([]);
  const [pipelineData, setPipelineData] = useState<Record<string, PipelineData[]>>({});
  const [kpiData, setKpiData] = useState<KpiData[]>([]);

  // Fonction de synchronisation
  const syncData = useCallback(async () => {
    if (!spreadsheetId) {
      setError('ID de feuille de calcul manquant');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initialiser les en-têtes et données si nécessaire
      await googleSheetsService.initializeSheetHeaders(spreadsheetId);
      await initializeIfEmpty(spreadsheetId);
      
      // Charger toutes les données en parallèle
      const [projetsData, equipeData, pipelineDataResult, kpiDataResult] = await Promise.all([
        googleSheetsService.getProjets(spreadsheetId),
        googleSheetsService.getEquipe(spreadsheetId),
        googleSheetsService.getPipelineData(spreadsheetId),
        googleSheetsService.getKpiData(spreadsheetId),
      ]);

      setProjets(projetsData);
      setEquipe(equipeData);
      setPipelineData(pipelineDataResult);
      setKpiData(kpiDataResult);
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de synchronisation';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Erreur de synchronisation Google Sheets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [spreadsheetId]);

  // Fonction de sauvegarde générique
  const saveData = useCallback(async (data: any) => {
    if (!spreadsheetId) {
      setError('ID de feuille de calcul manquant');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Déterminer le type de données et sauvegarder
      if (data.type === 'projet') {
        await googleSheetsService.saveProjet(spreadsheetId, data);
        // Recharger les projets après sauvegarde
        const updatedProjets = await googleSheetsService.getProjets(spreadsheetId);
        setProjets(updatedProjets);
      } else if (data.type === 'pipeline') {
        await googleSheetsService.savePipelineItem(spreadsheetId, data);
        // Recharger les données pipeline après sauvegarde
        const updatedPipelineData = await googleSheetsService.getPipelineData(spreadsheetId);
        setPipelineData(updatedPipelineData);
      } else if (data.type === 'kpi') {
        await googleSheetsService.saveKpiData(spreadsheetId, data.kpis);
        setKpiData(data.kpis);
      } else if (data.type === 'equipe') {
        await googleSheetsService.saveEquipe(spreadsheetId, data.equipe);
        setEquipe(data.equipe);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de sauvegarde';
      setError(errorMessage);
      console.error('Erreur de sauvegarde Google Sheets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [spreadsheetId]);

  // Synchronisation automatique
  useEffect(() => {
    if (autoSync && spreadsheetId) {
      // Synchronisation initiale
      syncData();

      // Synchronisation périodique
      const interval = setInterval(syncData, syncInterval);
      return () => clearInterval(interval);
    }
  }, [autoSync, spreadsheetId, syncInterval, syncData]);

  return {
    isLoading,
    error,
    isConnected,
    syncData,
    saveData,
    projets,
    equipe,
    pipelineData,
    kpiData,
  };
};

// Hook spécialisé pour les projets
export const useProjets = (spreadsheetId: string) => {
  const { projets, isLoading, error, saveData, syncData } = useGoogleSheets({ spreadsheetId });

  const saveProjet = useCallback(async (projet: ProjetData) => {
    await saveData({ ...projet, type: 'projet' });
  }, [saveData]);

  return {
    projets,
    isLoading,
    error,
    saveProjet,
    syncData,
  };
};

// Hook spécialisé pour le pipeline
export const usePipeline = (spreadsheetId: string) => {
  const { pipelineData, isLoading, error, saveData, syncData } = useGoogleSheets({ spreadsheetId });

  const savePipelineItem = useCallback(async (item: PipelineData) => {
    await saveData({ ...item, type: 'pipeline' });
  }, [saveData]);

  return {
    pipelineData,
    isLoading,
    error,
    savePipelineItem,
    syncData,
  };
};

// Hook spécialisé pour l'équipe
export const useEquipe = (spreadsheetId: string) => {
  const { equipe, isLoading, error, saveData, syncData } = useGoogleSheets({ spreadsheetId });

  const saveEquipe = useCallback(async (equipeData: EquipeData[]) => {
    await saveData({ equipe: equipeData, type: 'equipe' });
  }, [saveData]);

  return {
    equipe,
    isLoading,
    error,
    saveEquipe,
    syncData,
  };
};

// Hook spécialisé pour les KPIs
export const useKpis = (spreadsheetId: string) => {
  const { kpiData, isLoading, error, saveData, syncData } = useGoogleSheets({ spreadsheetId });

  const saveKpis = useCallback(async (kpis: KpiData[]) => {
    await saveData({ kpis, type: 'kpi' });
  }, [saveData]);

  return {
    kpiData,
    isLoading,
    error,
    saveKpis,
    syncData,
  };
};
