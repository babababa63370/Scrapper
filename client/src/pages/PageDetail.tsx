import { useScrapedPage } from "@/hooks/use-pages";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ExternalLink, Calendar, Copy, Check } from "lucide-react";
import { CodeViewer } from "@/components/CodeViewer";
import { PagePreview } from "@/components/PagePreview";
import { format } from "date-fns";
import { useState } from "react";

export default function PageDetail() {
  const [, params] = useRoute("/page/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: page, isLoading, error } = useScrapedPage(id);
  const [copiedType, setCopiedType] = useState<'html' | 'css' | null>(null);

  const handleCopy = (type: 'html' | 'css') => {
    let content = '';
    if (type === 'html' && page?.htmlContent) {
      content = page.htmlContent;
    } else if (type === 'css' && page?.cssContent) {
      content = page.cssContent;
    } else {
      return;
    }
    
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  if (isLoading) return <div className="p-12 text-center animate-pulse">Loading details...</div>;
  if (error || !page) return <div className="p-12 text-center text-red-500">Page not found or error loading details.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 rounded-full bg-white border border-border shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 truncate max-w-2xl">{page.title || "Untitled Page"}</h1>
          <div className="flex items-center gap-4 mt-1">
            <a 
              href={page.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {page.url}
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {page.createdAt && format(new Date(page.createdAt), "PPP p")}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => handleCopy('html')}
            className="btn-secondary"
          >
            {copiedType === 'html' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copiedType === 'html' ? "Copied HTML" : "Copy HTML"}
          </button>
          {page.cssContent && (
            <button 
              onClick={() => handleCopy('css')}
              className="btn-secondary"
            >
              {copiedType === 'css' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copiedType === 'css' ? "Copied CSS" : "Copy CSS"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Rendered Preview
            </h3>
            <PagePreview htmlContent={page.htmlContent} cssContent={page.cssContent} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              HTML Source
            </h3>
            <CodeViewer code={page.htmlContent} language="html" />
          </div>
          {page.cssContent && (
            <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                CSS Styles
              </h3>
              <CodeViewer code={page.cssContent} language="css" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
