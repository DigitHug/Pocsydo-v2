import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashFlow from "./pages/DashFlow";
import Projets from "./pages/Projets.simple";
import Pipeline from "./pages/Pipeline";
import Equipe from "./pages/Equipe";
import Calendrier from "./pages/Calendrier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashFlow />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/calendrier" element={<Calendrier />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
