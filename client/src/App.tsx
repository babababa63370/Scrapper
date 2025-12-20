import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import PageDetail from "@/pages/PageDetail";
import ExtensionSetup from "@/pages/ExtensionSetup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="pl-64 min-h-screen bg-[#FAFAFA]">
      <main className="p-8 max-w-7xl mx-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/extension" component={ExtensionSetup} />
          <Route path="/page/:id" component={PageDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sidebar />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
