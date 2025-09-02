import { useState } from "react"
import { 
  BarChart3, 
  Calendar, 
  Users, 
  FolderOpen, 
  TrendingUp,
  Settings
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "DashFlow", url: "/", icon: BarChart3 },
  { title: "Projets", url: "/projets", icon: FolderOpen },
  { title: "Pipeline", url: "/pipeline", icon: TrendingUp },
  { title: "Équipe", url: "/equipe", icon: Users },
  { title: "Calendrier", url: "/calendrier", icon: Calendar },
]


export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }
  
  const getNavClass = (path: string) => {
    const active = isActive(path)
    return active 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground transition-smooth"
  }

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-muted/30 border-r border-border/50">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <img src="/lovable-uploads/45fafc0e-fd08-419f-a2a5-5ada300bce10.png" alt="SydoFlow Logo" className="h-full w-auto object-contain" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">SydoFlow</h2>
                <p className="text-xs text-muted-foreground">Gestion de projets</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* Settings */}
        <div className="mt-auto p-4 border-t border-border/50">
          <SidebarMenuButton asChild className="h-10 w-full">
            <NavLink 
              to="/settings"
              className={getNavClass("/settings")}
            >
              <Settings className="w-4 h-4" />
              {!collapsed && <span className="ml-3">Paramètres</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}