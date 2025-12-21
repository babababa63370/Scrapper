import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { PagesList } from "@/components/PagesList";
import Home from "@/pages/Home";
import PageDetail from "@/pages/PageDetail";
import ExtensionSetup from "@/pages/ExtensionSetup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="pl-64 min-h-screen bg-[#FAFAFA]">
      <main className="p-8 max-w-5xl mx-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/extension" component={ExtensionSetup} />
          <Route path="/page/:id" component={PageDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <aside className="fixed right-0 top-0 w-72 h-screen border-l border-border bg-white shadow-lg overflow-y-auto p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Pages</h3>
        <PagesList />
      </aside>
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
