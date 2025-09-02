import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import matthieuAvatar from "@/assets/matthieu-avatar.png"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent" />
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Rechercher projets, tâches..." 
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-coral rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-2 pl-3 border-l border-border/50">
                <div className="text-right">
                  <p className="text-sm font-medium">Mathieu</p>
                  <p className="text-xs text-muted-foreground">Chef de projet</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={matthieuAvatar} alt="Avatar de Mathieu" />
                  <AvatarFallback className="bg-gradient-cyan text-white font-semibold">
                    MT
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}