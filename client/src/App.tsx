import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import Home from "@/pages/Home";
import PageDetail from "@/pages/PageDetail";
import HtmlViewer from "@/pages/HtmlViewer";
import ExtensionSetup from "@/pages/ExtensionSetup";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isViewer = location === "/viewer";

  if (isViewer) {
    return <HtmlViewer />;
  }

  return (
    <div className="pl-64 min-h-screen bg-[#FAFAFA]">
      <main className="p-8 w-full">
        <Switch>
          <Route path="/" component={Home} />
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
