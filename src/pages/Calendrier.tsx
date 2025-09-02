import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Clock, Plus, Users, Briefcase, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface WorkEvent {
  id: string;
  title: string;
  time: string;
  type: "meeting" | "task" | "deadline";
  priority: "low" | "medium" | "high";
}

const mockEvents: Record<string, WorkEvent[]> = {
  // Semaine 1 - Janvier 2025
  "2025-01-02": [
    { id: "1", title: "Réunion équipe produit", time: "09:00", type: "meeting", priority: "high" },
    { id: "2", title: "Révision code Sprint 12", time: "14:00", type: "task", priority: "medium" },
  ],
  "2025-01-03": [
    { id: "3", title: "Deadline projet Alpha", time: "17:00", type: "deadline", priority: "high" },
    { id: "4", title: "Call client Sydoflow", time: "11:00", type: "meeting", priority: "medium" },
  ],
  "2025-01-06": [
    { id: "5", title: "Formation React 18", time: "10:00", type: "meeting", priority: "low" },
    { id: "6", title: "Test utilisateur app mobile", time: "15:30", type: "task", priority: "medium" },
  ],
  "2025-01-07": [
    { id: "7", title: "Standup équipe dev", time: "09:15", type: "meeting", priority: "medium" },
    { id: "8", title: "Refactoring composants UI", time: "14:00", type: "task", priority: "low" },
  ],
  "2025-01-08": [
    { id: "9", title: "Demo client Beta", time: "16:00", type: "meeting", priority: "high" },
  ],
  "2025-01-09": [
    { id: "10", title: "Code review PR #234", time: "10:30", type: "task", priority: "medium" },
    { id: "11", title: "Réunion architecture", time: "14:30", type: "meeting", priority: "high" },
  ],
  "2025-01-10": [
    { id: "12", title: "Livraison version 2.1", time: "18:00", type: "deadline", priority: "high" },
  ],
  
  // Semaine 2
  "2025-01-13": [
    { id: "13", title: "Sprint Planning", time: "09:00", type: "meeting", priority: "high" },
    { id: "14", title: "Setup CI/CD pipeline", time: "15:00", type: "task", priority: "medium" },
  ],
  "2025-01-14": [
    { id: "15", title: "Entretien candidat dev", time: "11:00", type: "meeting", priority: "medium" },
    { id: "16", title: "Bug fix authentification", time: "16:00", type: "task", priority: "high" },
  ],
  "2025-01-15": [
    { id: "17", title: "Workshop UX Design", time: "10:00", type: "meeting", priority: "low" },
    { id: "18", title: "Mise à jour documentation", time: "14:00", type: "task", priority: "low" },
  ],
  "2025-01-16": [
    { id: "19", title: "Réunion budget Q1", time: "09:30", type: "meeting", priority: "high" },
    { id: "20", title: "Tests performance", time: "15:30", type: "task", priority: "medium" },
  ],
  "2025-01-17": [
    { id: "21", title: "Présentation roadmap", time: "14:00", type: "meeting", priority: "high" },
  ],
  
  // Semaine 3
  "2025-01-20": [
    { id: "22", title: "Réunion équipe design", time: "10:00", type: "meeting", priority: "medium" },
    { id: "23", title: "Implémentation dashboard", time: "14:00", type: "task", priority: "high" },
  ],
  "2025-01-21": [
    { id: "24", title: "Formation Supabase", time: "09:00", type: "meeting", priority: "low" },
    { id: "25", title: "Migration base données", time: "16:00", type: "task", priority: "high" },
  ],
  "2025-01-22": [
    { id: "26", title: "Code review hebdo", time: "11:00", type: "task", priority: "medium" },
    { id: "27", title: "Call équipe marketing", time: "15:00", type: "meeting", priority: "low" },
  ],
  "2025-01-23": [
    { id: "28", title: "Demo interne v2.2", time: "13:30", type: "meeting", priority: "medium" },
    { id: "29", title: "Optimisation SEO", time: "17:00", type: "task", priority: "low" },
  ],
  "2025-01-24": [
    { id: "30", title: "Deadline features Q1", time: "23:59", type: "deadline", priority: "high" },
  ],
  
  // Semaine 4 & 5
  "2025-01-27": [
    { id: "31", title: "Retrospective Sprint", time: "09:00", type: "meeting", priority: "medium" },
    { id: "32", title: "Setup monitoring", time: "14:30", type: "task", priority: "medium" },
  ],
  "2025-01-28": [
    { id: "33", title: "Réunion conseil admin", time: "10:30", type: "meeting", priority: "high" },
  ],
  "2025-01-29": [
    { id: "34", title: "Training sécurité", time: "09:30", type: "meeting", priority: "low" },
    { id: "35", title: "Audit code qualité", time: "15:00", type: "task", priority: "medium" },
  ],
  "2025-01-30": [
    { id: "36", title: "Préparation démo client", time: "11:00", type: "task", priority: "high" },
    { id: "37", title: "Réunion équipe support", time: "16:00", type: "meeting", priority: "medium" },
  ],
  "2025-01-31": [
    { id: "38", title: "Bilan mensuel janvier", time: "17:00", type: "deadline", priority: "high" },
  ],
};

const getEventTypeColor = (type: WorkEvent["type"]) => {
  switch (type) {
    case "meeting": return "bg-blue-500/10 text-blue-700 border-blue-200";
    case "task": return "bg-green-500/10 text-green-700 border-green-200";
    case "deadline": return "bg-red-500/10 text-red-700 border-red-200";
  }
};

const getPriorityColor = (priority: WorkEvent["priority"]) => {
  switch (priority) {
    case "low": return "bg-gray-500";
    case "medium": return "bg-yellow-500";
    case "high": return "bg-red-500";
  }
};

export default function Calendrier() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "task" as WorkEvent["type"],
    priority: "medium" as WorkEvent["priority"]
  });
  
  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");
  const selectedEvents = events[formatDateKey(selectedDate)] || [];

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    
    const dateKey = formatDateKey(selectedDate);
    const eventToAdd: WorkEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      priority: newEvent.priority
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventToAdd].sort((a, b) => a.time.localeCompare(b.time))
    }));

    // Reset form
    setNewEvent({
      title: "",
      time: "",
      type: "task",
      priority: "medium"
    });
    setIsDialogOpen(false);
  };

  const getEventIcon = (type: WorkEvent["type"]) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4" />;
      case "task": return <Briefcase className="h-4 w-4" />;
      case "deadline": return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Calendrier</h1>
            <p className="text-sm text-muted-foreground">Planification et timeline de travail</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter un événement</DialogTitle>
              <DialogDescription>
                Créez un nouvel événement pour le {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Titre
                </Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="Nom de l'événement"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Heure
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value: WorkEvent["type"]) => 
                    setNewEvent(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Réunion</SelectItem>
                    <SelectItem value="task">Tâche</SelectItem>
                    <SelectItem value="deadline">Échéance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priorité
                </Label>
                <Select 
                  value={newEvent.priority} 
                  onValueChange={(value: WorkEvent["priority"]) => 
                    setNewEvent(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.time}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 p-6">
        {/* Calendar */}
        <Card className="w-fit">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasEvent: Object.keys(events).map(dateStr => new Date(dateStr))
              }}
              modifiersStyles={{
                hasEvent: { 
                  backgroundColor: "hsl(var(--primary))", 
                  color: "hsl(var(--primary-foreground))",
                  fontWeight: "600"
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline - {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                      <span className="text-sm font-medium text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                      </div>
                    </div>
                    <Badge variant="outline" className={getEventTypeColor(event.type)}>
                      {event.type === "meeting" && "Réunion"}
                      {event.type === "task" && "Tâche"}
                      {event.type === "deadline" && "Échéance"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Aucun événement planifié
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez des événements pour organiser votre journée
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter un événement
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}