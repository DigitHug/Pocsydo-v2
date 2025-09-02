import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Plus } from "lucide-react";
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
  "2025-01-02": [
    { id: "1", title: "Réunion équipe produit", time: "09:00", type: "meeting", priority: "high" },
    { id: "2", title: "Révision code", time: "14:00", type: "task", priority: "medium" },
  ],
  "2025-01-03": [
    { id: "3", title: "Deadline projet Alpha", time: "17:00", type: "deadline", priority: "high" },
  ],
  "2025-01-06": [
    { id: "4", title: "Formation React", time: "10:00", type: "meeting", priority: "low" },
    { id: "5", title: "Test utilisateur", time: "15:30", type: "task", priority: "medium" },
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
  
  const formatDateKey = (date: Date) => format(date, "yyyy-MM-dd");
  const selectedEvents = mockEvents[formatDateKey(selectedDate)] || [];

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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel événement
        </Button>
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
                hasEvent: Object.keys(mockEvents).map(dateStr => new Date(dateStr))
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
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{event.title}</h3>
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
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un événement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}