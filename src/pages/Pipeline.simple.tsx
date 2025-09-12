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
  CheckCircle
} from "lucide-react"

const Pipeline = () => {
  
  const pipelineData = {
    "Prospection": [
      {
        id: 1,
        nom: "Site E-commerce Bio",
        client: "Green Market",
        valeur: "€25k",
        echeance: "15 Jan",
        statut: "En attente",
        priorite: "Haute"
      },
      {
        id: 2,
        nom: "App Mobile Fitness",
        client: "FitLife",
        valeur: "€18k",
        echeance: "20 Jan",
        statut: "En cours",
        priorite: "Moyenne"
      }
    ],
    "Proposition": [
      {
        id: 3,
        nom: "Plateforme SaaS CRM",
        client: "TechCorp",
        valeur: "€45k",
        echeance: "25 Jan",
        statut: "En révision",
        priorite: "Haute"
      }
    ],
    "Négociation": [
      {
        id: 4,
        nom: "Refonte Site Web",
        client: "Digital Plus",
        valeur: "€32k",
        echeance: "30 Jan",
        statut: "En négociation",
        priorite: "Haute"
      }
    ],
    "Signature": [
      {
        id: 5,
        nom: "App E-learning",
        client: "EduTech",
        valeur: "€28k",
        echeance: "5 Fév",
        statut: "Prêt à signer",
        priorite: "Moyenne"
      }
    ]
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "En attente":
        return <Badge className="bg-muted text-muted-foreground">En attente</Badge>
      case "En cours":
        return <Badge className="bg-cyan/10 text-cyan border-cyan/20">En cours</Badge>
      case "En révision":
        return <Badge className="bg-violet/10 text-violet border-violet/20">En révision</Badge>
      case "En négociation":
        return <Badge className="bg-warning/10 text-warning border-warning/20">En négociation</Badge>
      case "Prêt à signer":
        return <Badge className="bg-success/10 text-success border-success/20">Prêt à signer</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getPriorityBadge = (priorite: string) => {
    switch (priorite) {
      case "Haute":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Haute</Badge>
      case "Moyenne":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Moyenne</Badge>
      case "Basse":
        return <Badge className="bg-success/10 text-success border-success/20">Basse</Badge>
      default:
        return <Badge variant="secondary">{priorite}</Badge>
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospection":
        return "border-coral/30 bg-coral/5"
      case "Proposition":
        return "border-cyan/30 bg-cyan/5"
      case "Négociation":
        return "border-violet/30 bg-violet/5"
      case "Signature":
        return "border-success/30 bg-success/5"
      default:
        return "border-border/30 bg-muted/5"
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Prospection":
        return <Users className="w-5 h-5 text-coral" />
      case "Proposition":
        return <FileText className="w-5 h-5 text-cyan" />
      case "Négociation":
        return <TrendingUp className="w-5 h-5 text-violet" />
      case "Signature":
        return <CheckCircle className="w-5 h-5 text-success" />
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pipeline Commercial</h1>
            <p className="text-muted-foreground">Suivi des opportunités et progression des ventes</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Filtrer
            </Button>
            <Button className="gap-2 bg-gradient-coral border-0 hover:opacity-90">
              <Users className="w-4 h-4" />
              Nouveau Prospect
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(pipelineData).map(([stage, items]) => (
            <Card key={stage} className="shadow-card bg-gradient-card border-border/50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStageIcon(stage)}
                    <h3 className="font-semibold text-sm">{stage}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  €{items.reduce((sum, item) => sum + parseInt(item.valeur.replace('€', '').replace('k', '')), 0)}k
                </div>
                <p className="text-xs text-muted-foreground">Valeur totale</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Object.entries(pipelineData).map(([stage, items]) => (
            <Card key={stage} className={`shadow-card border-2 ${getStageColor(stage)}`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStageIcon(stage)}
                    <h2 className="font-semibold">{stage}</h2>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 bg-background/50 rounded-lg border border-border/30 hover:bg-accent/30 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{item.nom}</h4>
                          <div className="flex gap-1">
                            {getPriorityBadge(item.priorite)}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">{item.client}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Euro className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.valeur}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{item.echeance}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {getStatusBadge(item.statut)}
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-coral/5 hover:border-coral/30">
                <Users className="w-5 h-5 text-coral" />
                <span>Ajouter Prospect</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-cyan/5 hover:border-cyan/30">
                <FileText className="w-5 h-5 text-cyan" />
                <span>Créer Proposition</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2 hover:bg-violet/5 hover:border-violet/30">
                <TrendingUp className="w-5 h-5 text-violet" />
                <span>Suivi Négociation</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Pipeline
