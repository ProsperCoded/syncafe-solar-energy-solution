import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "./hooks/useAuth";
import { BatteryStorageProvider } from "./hooks/useBatteryStorage";
import { NotificationsProvider } from "./hooks/useNotifications";
import { DataProvider } from "./hooks/useDataProvider";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // Data remains fresh for 5 seconds
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BatteryStorageProvider>
          <NotificationsProvider>
            <DataProvider queryClient={queryClient}>
              <TooltipProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/dashboard/*"
                      element={
                        session ? (
                          <Dashboard />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>

                  <Toaster />
                  <Sonner />
                </BrowserRouter>
              </TooltipProvider>
            </DataProvider>
          </NotificationsProvider>
        </BatteryStorageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
