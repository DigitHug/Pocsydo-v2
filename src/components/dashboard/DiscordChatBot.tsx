import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import sarahAvatar from "@/assets/sarah-martin-avatar.png"
import mathieuAvatar from "@/assets/matthieu-avatar.png"
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile,
  MessageSquare,
  Users,
  Settings,
  Phone,
  Video
} from "lucide-react"
import { useState } from "react"

interface ChatMessage {
  id: number
  user: string
  avatar?: string
  message: string
  timestamp: string
  isBot?: boolean
  isCurrentUser?: boolean
}

export function DiscordChatBot() {
  const [message, setMessage] = useState("")
  const [messages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "ProjectBot",
      message: "📋 Nouveau projet ajouté: Refonte Site Web Luxe - Échéance: 15 Jan",
      timestamp: "14:32",
      isBot: true
    },
    {
      id: 2,
      user: "Mathieu",
      avatar: mathieuAvatar,
      message: "Parfait ! J'ai vu que le client a validé la maquette",
      timestamp: "14:35",
      isCurrentUser: true
    },
    {
      id: 3,
      user: "Sarah Martin",
      avatar: sarahAvatar,
      message: "Super ! On peut commencer le développement demain",
      timestamp: "14:37"
    },
    {
      id: 4,
      user: "ProjectBot",
      message: "⚠️ Rappel: Présentation Design prévue demain à 10h30",
      timestamp: "14:40",
      isBot: true
    }
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logique d'envoi du message
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="shadow-card bg-gradient-card border-border/50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/4bdf507d-2a67-4ab7-8251-4948fd72d66c.png" alt="Discord" className="w-4 h-4" />
              <h2 className="text-xl font-semibold">TeamChat & Assit</h2>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 text-xs">
              <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
              3 en ligne
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-64 mb-4">
          <div className="space-y-3 pr-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                {!msg.isCurrentUser && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback className={msg.isBot ? "bg-violet/20 text-violet" : "bg-primary/20 text-primary"}>
                      {msg.isBot ? "🤖" : msg.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex-1 ${msg.isCurrentUser ? 'max-w-[80%]' : ''}`}>
                  {!msg.isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${msg.isBot ? 'text-violet' : 'text-foreground'}`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.isCurrentUser 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : msg.isBot
                        ? 'bg-violet/10 border border-violet/20'
                        : 'bg-muted'
                  }`}>
                    {msg.message}
                  </div>
                  
                  {msg.isCurrentUser && (
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/30">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Input
            placeholder="Envoyer un message à #TeamChat & Assit"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Smile className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon" 
            className="w-8 h-8 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}