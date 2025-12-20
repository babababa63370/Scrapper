import { useScrapedPages, useDeletePage } from "@/hooks/use-pages";
import { Link } from "wouter";
import { 
  Trash2, 
  ExternalLink, 
  Search, 
  Clock, 
  FileCode, 
  AlertCircle,
  Code
} from "lucide-react";
import { format } from "date-fns";
import { StatCard } from "@/components/StatCard";
import { useState } from "react";

export default function Dashboard() {
  const { data: pages, isLoading, error } = useScrapedPages();
  const deletePageMutation = useDeletePage();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
        </div>
        <div className="space-y-4">
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-500">Could not connect to the backend. Ensure the server is running.</p>
        </div>
      </div>
    );
  }

  const filteredPages = pages?.filter(p => 
    p.url.toLowerCase().includes(search.toLowerCase()) || 
    (p.title && p.title.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your captured web pages and content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Scraped Pages" 
          value={pages?.length || 0} 
          icon={FileCode}
          trend="+12% from last week"
          trendUp={true}
        />
        <StatCard 
          title="Recent Activity" 
          value={pages?.length ? format(new Date(pages[0].createdAt || new Date()), "MMM d, h:mm a") : "No activity"} 
          icon={Clock}
        />
        <StatCard 
          title="Active Extension" 
          value="Firefox" 
          icon={Code}
        />
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Captures</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by URL or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {filteredPages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No pages found</h3>
            <p className="text-gray-500 mt-1">
              {search ? "Try adjusting your search terms." : "Start scraping pages with the browser extension."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / URL</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Captured At</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link href={`/page/${page.id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors">
                          {page.title || "Untitled Page"}
                        </Link>
                        <a 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 truncate max-w-md"
                        >
                          {page.url}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {page.createdAt && format(new Date(page.createdAt), "MMM d, yyyy • h:mm a")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/page/${page.id}`} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all">
                          <Code className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this page?")) {
                              deletePageMutation.mutate(page.id);
                            }
                          }}
                          disabled={deletePageMutation.isPending}
                          className="p-2 rounded-lg text-gray-400 hover:text-destructive hover:bg-destructive/5 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
