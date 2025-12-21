import { Link, useLocation } from "wouter";
import { LayoutDashboard, Puzzle, Code } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/viewer", icon: Code, label: "HTML Viewer" },
    { href: "/extension", icon: Puzzle, label: "Extension Setup" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-border/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-primary" />
          WebScraper
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">Firefox Extension Hub</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"}
            `}>
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-gray-50/50">
        <div className="rounded-lg bg-white border border-border p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground mb-1">Status</h4>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">System Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
