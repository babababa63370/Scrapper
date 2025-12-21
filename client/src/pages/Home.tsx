import { useScrapedPages, useDeletePage } from "@/hooks/use-pages";
import { Link } from "wouter";
import { Trash2, ExternalLink, Search, Clock, FileCode, Code, Upload, Download, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { StatCard } from "@/components/StatCard";
import { useState, useRef } from "react";
import { queryClient } from "@/lib/queryClient";
import { api } from "@shared/routes";

export default function Home() {
  const { data: pages, isLoading, error } = useScrapedPages();
  const deletePageMutation = useDeletePage();
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 bg-red-100 text-red-500 rounded-full p-3 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-500">Could not connect to the backend.</p>
        </div>
      </div>
    );
  }

  const filteredPages = pages?.filter(p =>
    p.url.toLowerCase().includes(search.toLowerCase()) ||
    (p.title && p.title.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  const handleExport = () => {
    if (!pages) return;
    const dataStr = JSON.stringify(pages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraped-pages-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(api.pages.upload.path, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      await queryClient.invalidateQueries({ queryKey: [api.pages.list.path] });
      alert(`Import complete: ${result.count} pages imported`);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleExport}
              disabled={!pages || pages.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              data-testid="button-export"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              data-testid="button-import"
            >
              <Upload className="w-4 h-4" />
              {importing ? 'Importing...' : 'Import'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              data-testid="input-file"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by URL or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              data-testid="input-search"
            />
          </div>

          {filteredPages.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full p-3 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No pages found</h3>
              <p className="text-gray-500 mt-1">
                {search ? "Try adjusting your search." : "Start scraping pages with the browser extension."}
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
                            data-testid="link-url"
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
                          <Link href={`/page/${page.id}`} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-all" data-testid="button-view">
                            <Code className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("Delete this page?")) {
                                deletePageMutation.mutate(page.id);
                              }
                            }}
                            disabled={deletePageMutation.isPending}
                            className="p-2 rounded-lg text-gray-400 hover:text-destructive hover:bg-destructive/5 transition-all"
                            data-testid="button-delete"
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
    </div>
  );
}
