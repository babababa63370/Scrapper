import { useScrapedPages } from "@/hooks/use-pages";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { PagePreview } from "@/components/PagePreview";

export default function HtmlViewer() {
  const { data: pages } = useScrapedPages();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const selectedPage = pages?.find(p => p.id === selectedId) || pages?.[0];

  return (
    <div className="pl-64 h-screen flex bg-white">
      {/* Left Panel - Pages List */}
      <div className="w-72 border-r border-border bg-gray-50 overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-border sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">HTML Viewer</h2>
          <p className="text-xs text-muted-foreground mt-1">Select a page to preview</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {pages?.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedId(page.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedId === page.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
              data-testid={`button-select-page-${page.id}`}
            >
              <div className="font-medium text-sm truncate">{page.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {page.url}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 overflow-auto p-8">
        {selectedPage ? (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedPage.title || "Untitled"}</h1>
              <a 
                href={selectedPage.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-2 inline-block"
                data-testid="link-original-url"
              >
                {selectedPage.url}
              </a>
            </div>
            <PagePreview 
              htmlContent={selectedPage.htmlContent}
              cssContent={selectedPage.cssContent}
              baseUrl={selectedPage.baseUrl}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No pages available</p>
          </div>
        )}
      </div>
    </div>
  );
}
