import { KpiCard } from "@/components/dashboard/KpiCard"
import { DiscordChatBot } from "@/components/dashboard/DiscordChatBot"
import { Card } from "@/components/ui/card"
import { 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Euro, 
  Calendar,
  Clock,
  Target,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const DashFlow = () => {
  const kpiData = [
    {
      title: "Prospects",
      value: "47",
      subtitle: "Appels entrants",
      icon: Users,
      variant: "coral" as const,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Projets Actifs",
      value: "23", 
      subtitle: "En cours",
      icon: FolderOpen,
      variant: "violet" as const,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Propositions",
      value: "15",
      subtitle: "En attente",
      icon: TrendingUp,
      variant: "cyan" as const,
      trend: { value: 3, isPositive: false }
    },
    {
      title: "Chiffre d'Affaires",
      value: "€187k",
      subtitle: "Ce mois",
      icon: Euro,
      variant: "navy" as const,
      trend: { value: 15, isPositive: true }
    },
  ]

  const recentProjects = [
    { id: 1, name: "Refonte Site Web Luxe", client: "Maison Martin", status: "En cours", priority: "Haute", deadline: "15 Jan" },
    { id: 2, name: "App Mobile E-commerce", client: "TechStart", status: "Review", priority: "Moyenne", deadline: "20 Jan" },
    { id: 3, name: "Plateforme SaaS", client: "InnovateCorp", status: "Planifié", priority: "Basse", deadline: "28 Jan" },
  ]

  const upcomingDeadlines = [
    { project: "Audit SEO", client: "Digital Plus", date: "Aujourd'hui", time: "14h00", urgent: true },
    { project: "Présentation Design", client: "Creative Lab", date: "Demain", time: "10h30", urgent: false },
    { project: "Livrable Final", client: "Global Tech", date: "3 Jan", time: "17h00", urgent: true },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Haute":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Haute</Badge>
      case "Moyenne":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Moyenne</Badge>
      case "Basse":
        return <Badge className="bg-success/10 text-success border-success/20">Basse</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En cours":
        return <Badge className="bg-violet/10 text-violet border-violet/20">En cours</Badge>
      case "Review":
        return <Badge className="bg-cyan/10 text-cyan border-cyan/20">Review</Badge>
      case "Planifié":
        return <Badge className="bg-muted text-muted-foreground">Planifié</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DashFlow</h1>
          <p className="text-muted-foreground">Vue d'ensemble de vos projets et performances</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Planifier
          </Button>
          <Button className="gap-2 bg-gradient-coral border-0 hover:opacity-90">
            <Target className="w-4 h-4" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Discord Chat Bot */}
      <DiscordChatBot />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 shadow-card bg-gradient-card border-border/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-violet" />
                Projets Récents
              </h2>
              <Button variant="ghost" size="sm">Voir tout</Button>
            </div>
            
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30 hover:bg-accent/30 transition-colors">
                  <div className="space-y-1">
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPriorityBadge(project.priority)}
                    {getStatusBadge(project.status)}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Échéance</p>
                      <p className="text-sm font-medium">{project.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="shadow-card bg-gradient-card border-border/50">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-coral" />
              Échéances Prochaines
            </h2>
            
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className={`p-3 rounded-lg border ${deadline.urgent ? 'bg-destructive/5 border-destructive/20' : 'bg-background/50 border-border/30'}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{deadline.project}</h4>
                        {deadline.urgent && <AlertTriangle className="w-3 h-3 text-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{deadline.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{deadline.date}</p>
                      <p className="text-xs text-muted-foreground">{deadline.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Voir le calendrier
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card bg-gradient-card border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-coral/5 hover:border-coral/30">
              <Users className="w-6 h-6 text-coral" />
              <span>Ajouter Prospect</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-violet/5 hover:border-violet/30">
              <FolderOpen className="w-6 h-6 text-violet" />
              <span>Créer Projet</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-cyan/5 hover:border-cyan/30">
              <TrendingUp className="w-6 h-6 text-cyan" />
              <span>Envoyer Proposition</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DashFlow