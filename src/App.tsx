
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ProposalBuilder from "./pages/ProposalBuilder";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Context
import { UserProvider } from "./context/UserContext";
import { EnhancedApiProvider } from "./context/EnhancedApiContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <EnhancedApiProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="leads" element={<LeadManagement />} />
                  <Route path="itinerary" element={<ItineraryBuilder />} />
                  <Route path="proposals" element={<ProposalBuilder />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </EnhancedApiProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
