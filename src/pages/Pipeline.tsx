import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Eye,
  FileText, 
  Calendar,
  Euro,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
  RefreshCw,
  Settings,
  AlertCircle
} from "lucide-react"
import { usePipeline } from "@/hooks/useGoogleSheets"
import GoogleSheetsConfig from "@/components/GoogleSheetsConfig"
import { useState, useEffect } from "react"

const Pipeline = () => {
  const [spreadsheetId, setSpreadsheetId] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  // Charger l'ID depuis le localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('googleSheetsId');
    if (savedId) {
      setSpreadsheetId(savedId);
    }
  }, []);

  // Utiliser le hook Google Sheets si un ID est configuré
  const { 
    pipelineData: pipelineDataFromSheets, 
    isLoading, 
    error, 
    savePipelineItem, 
    syncData 
  } = usePipeline(spreadsheetId);

  // Données de fallback si Google Sheets n'est pas configuré
  const pipelineDataFallback = {
    "Prospection": [
      {
        id: 1,
        nom: "Site E-commerce Bio",
        client: "Green Market",
        valeur: "€25k",
        probabilite: 30,
        dateContact: "5 Jan 2024",
        actions: ["Appel de suivi", "Présentation produit"],
        couleur: "muted"
      },
      {
        id: 2,
        nom: "App Fitness Studio",
        client: "FitZone",
        valeur: "€18k",
        probabilite: 20,
        dateContact: "8 Jan 2024", 
        actions: ["Rendez-vous commercial"],
        couleur: "muted"
      }
    ],
    "Qualification": [
      {
        id: 3,
        nom: "Plateforme Formation",
        client: "EduTech Solutions",
        valeur: "€45k",
        probabilite: 50,
        dateContact: "3 Jan 2024",
        actions: ["Analyse besoins", "Cahier des charges"],
        couleur: "cyan"
      },
      {
        id: 4,
        nom: "Site Vitrine Luxe",
        client: "Prestige Jewels",
        valeur: "€12k",
        probabilite: 60,
        dateContact: "10 Jan 2024",
        actions: ["Validation budget"],
        couleur: "cyan"
      }
    ],
    "Proposition": [
      {
        id: 5,
        nom: "CRM Sur Mesure",
        client: "Sales Dynamics",
        valeur: "€67k",
        probabilite: 75,
        dateContact: "28 Déc 2023",
        actions: ["Négociation tarifs", "Présentation finale"],
        couleur: "coral"
      },
      {
        id: 6,
        nom: "Marketplace B2B",
        client: "TradePro",
        valeur: "€89k",
        probabilite: 85,
        dateContact: "2 Jan 2024",
        actions: ["Signature imminente"],
        couleur: "coral"
      }
    ],
    "Négociation": [
      {
        id: 7,
        nom: "Application IoT",
        client: "SmartHome Inc",
        valeur: "€55k",
        probabilite: 90,
        dateContact: "20 Déc 2023",
        actions: ["Validation technique", "Planning"],
        couleur: "violet"
      }
    ],
    "Gagné": [
      {
        id: 8,
        nom: "Refonte Site Web Luxe",
        client: "Maison Martin",
        valeur: "€45k",
        probabilite: 100,
        dateContact: "15 Déc 2023",
        actions: ["Projet en cours"],
        couleur: "success"
      },
      {
        id: 9,
        nom: "App Mobile E-commerce",
        client: "TechStart",
        valeur: "€32k", 
        probabilite: 100,
        dateContact: "10 Déc 2023",
        actions: ["Livraison prévue"],
        couleur: "success"
      }
    ]
  };

  // Utiliser les données de Google Sheets si disponibles, sinon les données de fallback
  const pipelineData = spreadsheetId && Object.keys(pipelineDataFromSheets).length > 0 
    ? pipelineDataFromSheets 
    : pipelineDataFallback;

  const getProbabilityColor = (probabilite: number) => {
    if (probabilite >= 80) return "text-success"
    if (probabilite >= 60) return "text-coral"
    if (probabilite >= 40) return "text-cyan"
    return "text-muted-foreground"
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospection": return "border-l-muted"
      case "Qualification": return "border-l-cyan"
      case "Proposition": return "border-l-coral"
      case "Négociation": return "border-l-violet"
      case "Gagné": return "border-l-success"
      default: return "border-l-muted"
    }
  }

  const totalValeur = Object.values(pipelineData).flat().reduce((sum, projet) => {
    const valeur = parseInt(projet.valeur.replace(/[€k]/g, ''))
    return sum + (valeur * projet.probabilite / 100)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Commercial</h1>
          <p className="text-muted-foreground">Suivi des opportunités et du processus commercial</p>
          {spreadsheetId && (
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                Synchronisé avec Google Sheets
              </Badge>
              {isLoading && (
                <Badge variant="secondary">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Synchronisation...
                </Badge>
              )}
              {error && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Erreur de sync
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            className="gap-2 bg-gradient-violet border-0 hover:opacity-90"
            onClick={() => {/* TODO: Implémenter la création d'opportunité */}}
          >
            <FileText className="w-4 h-4" />
            Nouvelle Opportunité
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={syncData}
            disabled={isLoading || !spreadsheetId}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Configuration Google Sheets */}
      {showConfig && (
        <GoogleSheetsConfig 
          onConfigChange={(id) => {
            setSpreadsheetId(id);
            setShowConfig(false);
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-cyan text-white border-0">
          <div className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">€{totalValeur.toFixed(0)}k</p>
            <p className="text-sm opacity-90">Valeur Pondérée</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-coral text-white border-0">
          <div className="text-center">
            <Eye className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Object.values(pipelineData).flat().length}</p>
            <p className="text-sm opacity-90">Opportunités</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-violet text-white border-0">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{pipelineData["Gagné"].length}</p>
            <p className="text-sm opacity-90">Projets Gagnés</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-navy text-white border-0">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">65%</p>
            <p className="text-sm opacity-90">Taux Conversion</p>
          </div>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {Object.entries(pipelineData).map(([stage, projets]) => (
          <div key={stage} className="space-y-4">
            {/* Stage Header */}
            <div className={`p-3 rounded-lg border-l-4 ${getStageColor(stage)} bg-gradient-card`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{stage}</h3>
                <Badge variant="secondary">{projets.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                €{projets.reduce((sum, p) => sum + parseInt(p.valeur.replace(/[€k]/g, '')), 0)}k total
              </p>
            </div>

            {/* Stage Projects */}
            <div className="space-y-3">
              {projets.map((projet) => (
                <Card key={projet.id} className="p-4 shadow-card bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300">
                  <div className="space-y-3">
                    {/* Project Header */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">{projet.nom}</h4>
                      <p className="text-xs text-muted-foreground">{projet.client}</p>
                    </div>

                    {/* Value & Probability */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Euro className="w-3 h-3 text-navy" />
                        <span className="text-sm font-medium">{projet.valeur}</span>
                      </div>
                      <span className={`text-sm font-medium ${getProbabilityColor(projet.probabilite)}`}>
                        {projet.probabilite}%
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {projet.dateContact}
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      {projet.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Clock className="w-3 h-3 text-coral" />
                          <span className="text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Avancer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pipeline