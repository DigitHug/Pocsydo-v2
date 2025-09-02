import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import youriAvatar from "@/assets/youri-avatar.png"
import mathieuAvatar from "@/assets/matthieu-avatar.png"
import sylvainAvatar from "@/assets/sylvain-avatar.png"
import antonyAvatar from "@/assets/antony-avatar.png"
import carolineAvatar from "@/assets/caroline-avatar.png"
import alexandreAvatar from "@/assets/alexandre-avatar.png"
import leaAvatar from "@/assets/lea-avatar.png"
import thomasAvatar from "@/assets/thomas-avatar.png"
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Briefcase,
  Star,
  Plus,
  MessageCircle,
  Settings
} from "lucide-react"

const Equipe = () => {
  const getAvatarByName = (prenom: string) => {
    const avatars: Record<string, string> = {
      "Youri": youriAvatar,
      "Mathieu": mathieuAvatar,
      "Sylvain": sylvainAvatar,
      "Antony": antonyAvatar,
      "Caroline": carolineAvatar,
      "Alexandre": alexandreAvatar,
      "Léa": leaAvatar,
      "Thomas": thomasAvatar
    }
    return avatars[prenom]
  }

  const membres = [
    {
      id: 1,
      nom: "Youri",
      prenom: "Youri",
      role: "Lead Developer",
      specialite: "Full-Stack",
      email: "youri@sydoflow.com",
      telephone: "+33 6 12 34 56 78",
      statut: "Disponible",
      charge: 75,
      projetsActuels: ["Refonte Site Web Luxe", "CRM Sur Mesure"],
      competences: ["React", "Node.js", "PostgreSQL", "TypeScript"],
      couleur: "violet",
      initiales: "YM"
    },
    {
      id: 2,
      nom: "Mathieu",
      prenom: "Mathieu", 
      role: "UI/UX Designer",
      specialite: "Design System",
      email: "matthieu@sydoflow.com",
      telephone: "+33 6 23 45 67 89",
      statut: "En projet",
      charge: 90,
      projetsActuels: ["App Mobile E-commerce", "Plateforme SaaS"],
      competences: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      couleur: "cyan",
      initiales: "MT"
    },
    {
      id: 3,
      nom: "Sylvain",
      prenom: "Sylvain",
      role: "DevOps Engineer",
      specialite: "Infrastructure",
      email: "sylvain@sydoflow.com", 
      telephone: "+33 6 34 56 78 90",
      statut: "Disponible",
      charge: 60,
      projetsActuels: ["Infrastructure Cloud"],
      competences: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      couleur: "navy",
      initiales: "SL"
    },
    {
      id: 4,
      nom: "Antony",
      prenom: "Antony",
      role: "Project Manager", 
      specialite: "Agile/Scrum",
      email: "antony@sydoflow.com",
      telephone: "+33 6 45 67 89 01",
      statut: "En réunion",
      charge: 85,
      projetsActuels: ["Audit SEO Complet", "Marketplace B2B"],
      competences: ["Scrum", "Jira", "Planning", "Communication"],
      couleur: "coral",
      initiales: "AT"
    },
    {
      id: 5,
      nom: "Caroline",
      prenom: "Caroline",
      role: "Business Analyst",
      specialite: "Stratégie Digitale",
      email: "caroline@sydoflow.com",
      telephone: "+33 6 56 78 90 12",
      statut: "Disponible",
      charge: 70,
      projetsActuels: ["Plateforme Formation"],
      competences: ["Analyse", "Reporting", "Excel", "Power BI"],
      couleur: "success",
      initiales: "CR"
    },
    {
      id: 6,
      nom: "Alexandre",
      prenom: "Alexandre",
      role: "Frontend Developer",
      specialite: "React/Vue.js",
      email: "alexandre@sydoflow.com",
      telephone: "+33 6 67 89 01 23",
      statut: "En congé",
      charge: 0,
      projetsActuels: [],
      competences: ["React", "Vue.js", "CSS", "JavaScript"],
      couleur: "muted",
      initiales: "AX"
    },
    {
      id: 7,
      nom: "Léa",
      prenom: "Léa",
      role: "QA Engineer",
      specialite: "Tests Automatisés",
      email: "lea@sydoflow.com",
      telephone: "+33 6 78 90 12 34",
      statut: "Disponible",
      charge: 55,
      projetsActuels: ["App Mobile E-commerce"],
      competences: ["Selenium", "Jest", "Cypress", "Testing"],
      couleur: "violet",
      initiales: "LM"
    },
    {
      id: 8,
      nom: "Thomas",
      prenom: "Thomas",
      role: "Backend Developer",
      specialite: "API/Database",
      email: "thomas@sydoflow.com",
      telephone: "+33 6 89 01 23 45",
      statut: "En projet",
      charge: 95,
      projetsActuels: ["CRM Sur Mesure", "Application IoT"],
      competences: ["Python", "Django", "MySQL", "API Rest"],
      couleur: "navy",
      initiales: "TH"
    }
  ]

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Disponible":
        return <Badge className="bg-success/10 text-success border-success/20">Disponible</Badge>
      case "En projet":
        return <Badge className="bg-coral/10 text-coral border-coral/20">En projet</Badge>
      case "En réunion":
        return <Badge className="bg-violet/10 text-violet border-violet/20">En réunion</Badge>
      case "En congé":
        return <Badge className="bg-muted text-muted-foreground">En congé</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getChargeColor = (charge: number) => {
    if (charge >= 90) return "bg-destructive"
    if (charge >= 70) return "bg-coral"
    if (charge >= 50) return "bg-cyan"
    return "bg-success"
  }

  const statsEquipe = {
    disponibles: membres.filter(m => m.statut === "Disponible").length,
    enProjet: membres.filter(m => m.statut === "En projet").length,
    chargeMovenne: Math.round(membres.reduce((sum, m) => sum + m.charge, 0) / membres.length)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Équipe</h1>
          <p className="text-muted-foreground">Gestion des ressources et disponibilités</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Planification
          </Button>
          <Button className="gap-2 bg-gradient-violet border-0 hover:opacity-90">
            <Plus className="w-4 h-4" />
            Nouveau Membre
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-cyan text-white border-0">
          <div className="text-center">
            <User className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{membres.length}</p>
            <p className="text-sm opacity-90">Membres Total</p>
          </div>
        </Card>
        <Card className="p-4 bg-success/10 text-success border-success/20">
          <div className="text-center">
            <Star className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statsEquipe.disponibles}</p>
            <p className="text-sm">Disponibles</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-coral text-white border-0">
          <div className="text-center">
            <Briefcase className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statsEquipe.enProjet}</p>
            <p className="text-sm opacity-90">En Projet</p>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-navy text-white border-0">
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{statsEquipe.chargeMovenne}%</p>
            <p className="text-sm opacity-90">Charge Moyenne</p>
          </div>
        </Card>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membres.map((membre) => (
          <Card key={membre.id} className="shadow-card bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getAvatarByName(membre.prenom)} alt={`Avatar de ${membre.prenom}`} />
                    <AvatarFallback className={`bg-gradient-${membre.couleur} text-white font-semibold`}>
                      {membre.initiales}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{membre.prenom}</h3>
                    <p className="text-sm text-muted-foreground">{membre.role}</p>
                  </div>
                </div>
                {getStatutBadge(membre.statut)}
              </div>

              {/* Specialité */}
              <div className="mb-4">
                <p className="text-sm font-medium text-coral">{membre.specialite}</p>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {membre.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {membre.telephone}
                </div>
              </div>

              {/* Charge de travail */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Charge de travail</span>
                  <span className="text-sm text-muted-foreground">{membre.charge}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${getChargeColor(membre.charge)}`}
                    style={{ width: `${membre.charge}%` }}
                  ></div>
                </div>
              </div>

              {/* Projets actuels */}
              {membre.projetsActuels.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Projets en cours</p>
                  <div className="space-y-1">
                    {membre.projetsActuels.map((projet, index) => (
                      <p key={index} className="text-xs text-muted-foreground">• {projet}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Compétences */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1">
                  {membre.competences.map((competence, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {competence}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planning
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Equipe