import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  Users,
  Euro,
  MoreVertical
} from "lucide-react"
import { useState } from "react"

const Projets = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Données de fallback basées sur le CSV
  const projets = [
    {
      id: 1,
      nom: "Refonte Site Web Luxe",
      client: "Maison Martin",
      statut: "En cours",
      priorite: "Haute",
      deadline: "2024-01-15",
      responsable: "Sarah Martin",
      progression: 75,
      description: "Refonte complète du site e-commerce avec nouveau design"
    },
    {
      id: 2,
      nom: "App Mobile E-commerce",
      client: "TechStart",
      statut: "Review",
      priorite: "Moyenne", 
      deadline: "2024-01-20",
      responsable: "Tom Chen",
      progression: 60,
      description: "Développement d'une application mobile pour la vente en ligne"
    },
    {
      id: 3,
      nom: "Plateforme SaaS",
      client: "InnovateCorp",
      statut: "Planifié",
      priorite: "Basse",
      deadline: "2024-01-28",
      responsable: "Emma Wilson",
      progression: 25,
      description: "Création d'une plateforme SaaS pour la gestion d'équipe"
    },
    {
      id: 4,
      nom: "Audit SEO",
      client: "Digital Plus",
      statut: "En cours",
      priorite: "Haute",
      deadline: "2024-01-10",
      responsable: "Alexandre Dubois",
      progression: 90,
      description: "Audit complet et optimisation SEO du site existant"
    },
    {
      id: 5,
      nom: "Présentation Design",
      client: "Creative Lab",
      statut: "En cours",
      priorite: "Moyenne",
      deadline: "2024-01-12",
      responsable: "Caroline Petit",
      progression: 85,
      description: "Préparation de la présentation design pour le client"
    },
    {
      id: 6,
      nom: "Livrable Final",
      client: "Global Tech",
      statut: "En cours",
      priorite: "Haute",
      deadline: "2024-01-08",
      responsable: "Matthieu Leroy",
      progression: 95,
      description: "Finalisation et livraison du projet de migration"
    }
  ];

  // Filtrer les projets selon le terme de recherche
  const filteredProjets = projets.filter(projet =>
    projet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "En cours":
        return <Badge className="bg-violet/10 text-violet border-violet/20">En cours</Badge>
      case "Review":
        return <Badge className="bg-cyan/10 text-cyan border-cyan/20">Review</Badge>
      case "Planifié":
        return <Badge className="bg-muted text-muted-foreground">Planifié</Badge>
      case "Terminé":
        return <Badge className="bg-success/10 text-success border-success/20">Terminé</Badge>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projets</h1>
          <p className="text-muted-foreground">Gestion et suivi de tous vos projets</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="gap-2 bg-gradient-violet border-0 hover:opacity-90">
            <Plus className="w-4 h-4" />
            Nouveau Projet
          </Button>
          <Button className="gap-2 bg-gradient-coral text-white border-0 hover:opacity-90">
            Configuration Google Sheets
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-6 shadow-card bg-gradient-card border-border/50">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher un projet..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Tous</Button>
            <Button variant="outline" size="sm">En cours</Button>
            <Button variant="outline" size="sm">Review</Button>
            <Button variant="outline" size="sm">Terminés</Button>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjets.map((projet) => (
          <Card key={projet.id} className="shadow-card bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{projet.nom}</h3>
                  <p className="text-sm text-muted-foreground">{projet.client}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Status & Priority */}
              <div className="flex items-center gap-2 mb-4">
                {getStatusBadge(projet.statut)}
                {getPriorityBadge(projet.priorite)}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-muted-foreground">{projet.progression}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all bg-gradient-violet"
                    style={{ width: `${projet.progression}%` }}
                  ></div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-coral" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{projet.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-navy" />
                  <div>
                    <p className="text-xs text-muted-foreground">Responsable</p>
                    <p className="text-sm font-medium">{projet.responsable}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground line-clamp-2">{projet.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-coral text-white border-0">
          <div className="text-center">
            <FolderOpen className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{projets.length}</p>
            <p className="text-sm opacity-90">Projets Totaux</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-violet text-white border-0">
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{projets.filter(p => p.statut === 'En cours').length}</p>
            <p className="text-sm opacity-90">En Cours</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-cyan text-white border-0">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{new Set(projets.map(p => p.responsable)).size}</p>
            <p className="text-sm opacity-90">Responsables</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-navy text-white border-0">
          <div className="text-center">
            <Euro className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.round(projets.reduce((sum, p) => sum + p.progression, 0) / projets.length)}%</p>
            <p className="text-sm opacity-90">Progression Moyenne</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Projets
