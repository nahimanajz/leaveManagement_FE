import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";

const queryClient = new QueryClient();

const msalInstance = new PublicClientApplication(msalConfig);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MsalProvider instance={msalInstance}>
        <RouterProvider router={router} />
      </MsalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
