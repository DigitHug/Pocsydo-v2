import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react';
import { googleSheetsService } from '@/services/GoogleSheetsService';

interface GoogleSheetsConfigProps {
  onConfigChange?: (spreadsheetId: string) => void;
}

const GoogleSheetsConfig = ({ onConfigChange }: GoogleSheetsConfigProps) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'ID depuis le localStorage au montage
  useEffect(() => {
    const savedId = localStorage.getItem('googleSheetsId');
    if (savedId) {
      setSpreadsheetId(savedId);
      testConnection(savedId);
    }
  }, []);

  const testConnection = async (id: string) => {
    if (!id) return;

    setIsTesting(true);
    setError(null);

    try {
      // Tester la connexion en essayant de lire les en-têtes
      await googleSheetsService.initializeSheetHeaders(id);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (spreadsheetId) {
      localStorage.setItem('googleSheetsId', spreadsheetId);
      testConnection(spreadsheetId);
      onConfigChange?.(spreadsheetId);
    }
  };

  const handleTest = () => {
    testConnection(spreadsheetId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSpreadsheetUrl = (id: string) => {
    return `https://docs.google.com/spreadsheets/d/${id}/edit`;
  };

  return (
    <Card className="p-6 shadow-card bg-gradient-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-violet" />
          <h3 className="text-lg font-semibold">Configuration Google Sheets</h3>
          {isConnected && (
            <Badge className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connecté
            </Badge>
          )}
          {error && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
              <AlertCircle className="w-3 h-3 mr-1" />
              Erreur
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              ID de la feuille Google Sheets
            </label>
            <div className="flex gap-2">
              <Input
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(spreadsheetId)}
                disabled={!spreadsheetId}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trouvez l'ID dans l'URL de votre feuille Google Sheets
            </p>
          </div>

          {spreadsheetId && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(getSpreadsheetUrl(spreadsheetId), '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ouvrir la feuille
              </Button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleTest}
              disabled={!spreadsheetId || isTesting}
              variant="outline"
              className="flex-1"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tester la connexion
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!spreadsheetId || isTesting}
              className="flex-1 bg-gradient-violet border-0 hover:opacity-90"
            >
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Instructions :</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Créez une nouvelle feuille Google Sheets</li>
            <li>Partagez-la avec l'adresse email de votre compte de service</li>
            <li>Copiez l'ID depuis l'URL (partie après /d/ et avant /edit)</li>
            <li>Collez l'ID ci-dessus et testez la connexion</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default GoogleSheetsConfig;
